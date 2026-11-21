import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import MagicString from "magic-string";
import { fromMarkdown } from "mdast-util-from-markdown";
import { micromark } from "micromark";
import { parseSync, type StaticImport } from "oxc-parser";
import { codeToHtml } from "shiki";

import type { Framework } from "../config.js";
import { isAstroPath, renderAstroCodeBlock, splitAstroExample } from "./astro.js";
import type { ComponentInfo } from "./component.js";
import type { ComponentDoc } from "./index.js";
import type { PropInfo } from "./props.js";

const startMarker = "{/* componentbook-start */}";
const endMarker = "{/* componentbook-end */}";

export type WriteStatus = "created" | "updated" | "unchanged" | "skipped";

/** Creates the MDX file, or replaces only its generated block. */
export async function writeMDX(doc: ComponentDoc, framework: Framework): Promise<WriteStatus> {
  const block = await renderBlock(doc, framework);

  let source: string;
  try {
    source = await readFile(doc.mdxPath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await mkdir(dirname(doc.mdxPath), { recursive: true });
      await writeFile(doc.mdxPath, `${renderFrontmatter(doc)}\n\n${block}\n`);
      return "created";
    } else throw error;
  }

  const start = source.indexOf(startMarker);
  const endMarkerIndex = start === -1 ? -1 : source.indexOf(endMarker, start);
  // Without both markers, the file is the user's to maintain.
  if (endMarkerIndex === -1) return "skipped";
  const end = endMarkerIndex + endMarker.length;

  const updated = new MagicString(source).overwrite(start, end, block).toString();
  if (updated === source) return "unchanged";

  await writeFile(doc.mdxPath, updated);
  return "updated";
}

function renderFrontmatter(doc: ComponentDoc): string {
  const primary = getPrimaryComponent(doc);
  const lines = ["---", `title: ${JSON.stringify(primary.exportName)}`];
  const description = primary.description?.split("\n")[0]?.trim();
  if (description) lines.push(`description: ${JSON.stringify(description)}`);
  lines.push("---");
  return lines.join("\n");
}

/** Renders the generated block, from `startMarker` to `endMarker`. */
async function renderBlock(doc: ComponentDoc, framework: Framework): Promise<string> {
  const lines = [startMarker, ""];

  const componentbookImports: string[] = [];
  if (doc.components.some(canPreview)) componentbookImports.push("ComponentbookPreview");
  if (doc.components.some((component) => component.props.length > 0))
    componentbookImports.push("ComponentbookTypeTable");
  if (componentbookImports.length > 0)
    lines.push(`import { ${componentbookImports.join(", ")} } from "componentbook/${framework}";`);

  // The sections are rendered first, to collect the imports of their examples.
  const sections: string[] = [];
  const exampleImports: StaticImport[] = [];
  for (const component of doc.components) {
    const section = await renderComponentSection(doc, component, framework);
    sections.push(...section.lines);
    exampleImports.push(...section.exampleImports);
  }

  lines.push(
    `import ${renderImportClause(doc.components)} from ${JSON.stringify(doc.relativeSpecifier)};`,
    ...renderImports(doc, exampleImports),
    "",
    ...sections,
    endMarker,
  );
  return lines.join("\n");
}

function renderImports(doc: ComponentDoc, imports: StaticImport[]): string[] {
  // The names imported from each module, like `a` and `b as c`.
  const names = new Map<string, Set<string>>();
  // Namespace and side-effect imports, which can't be merged with them.
  const standaloneImports = new Set<string>();

  for (const { moduleRequest, entries } of imports) {
    const from = JSON.stringify(moduleRequest.value);
    if (entries.length === 0) standaloneImports.add(`import ${from};`);

    for (const { importName, localName, isType } of entries) {
      const local = localName.value;
      // Types are left out, because MDX is JavaScript.
      // The components of the file are already imported.
      if (isType || doc.components.some((component) => component.exportName === local)) continue;

      const kind: string = importName.kind;
      if (kind === "NamespaceObject") standaloneImports.add(`import * as ${local} from ${from};`);
      else {
        const imported = kind === "Default" ? "default" : (importName.name ?? local);
        const name = imported === local ? local : `${imported} as ${local}`;
        names.set(from, (names.get(from) ?? new Set<string>()).add(name));
      }
    }
  }

  const mergedImports = [...names].map(
    ([from, moduleNames]) => `import { ${[...moduleNames].join(", ")} } from ${from};`,
  );
  return [...mergedImports, ...standaloneImports];
}

/** The default export, or the first component. */
function getPrimaryComponent(doc: ComponentDoc): ComponentInfo {
  const [first] = doc.components;
  if (!first) throw new Error(`No components in ${doc.sourcePath}`);
  return doc.components.find((component) => component.isDefault) ?? first;
}

function renderImportClause(components: ComponentInfo[]): string {
  const defaultComponent = components.find((component) => component.isDefault);
  const named = components
    .filter((component) => !component.isDefault)
    .map((component) => component.exportName);

  return [defaultComponent?.exportName, named.length > 0 ? `{ ${named.join(", ")} }` : undefined]
    .filter((clause) => clause !== undefined)
    .join(", ");
}

async function renderComponentSection(
  doc: ComponentDoc,
  component: ComponentInfo,
  framework: Framework,
): Promise<{ lines: string[]; exampleImports: StaticImport[] }> {
  const { exportName } = component;
  const lines = [`## ${exportName}`, ""];
  const exampleImports: StaticImport[] = [];

  if (component.description) lines.push(escapeMDX(component.description), "");
  if (component.remarks) lines.push("**Remarks**", "", escapeMDX(component.remarks), "");

  if (component.examples.length > 0)
    for (const example of component.examples) {
      const rendered = renderExample(doc, component, example);
      lines.push(...rendered.lines);
      exampleImports.push(...rendered.exampleImports);
    }
  else {
    const requiredProps = getRequiredProps(component);
    const children = component.props.find((prop) => prop.name === "children" && prop.required);

    if (canPreview(component)) {
      // An expression keeps MDX from parsing the text as Markdown:
      // `"_a_"` -> `{"_a_"}`, because `<A>_a_</A>` would render `<A><em>a</em></A>`
      const previewChildren = children?.dummy === undefined ? undefined : `{${children.dummy}}`;
      lines.push(
        "<ComponentbookPreview>",
        `  ${renderElement(exportName, requiredProps, previewChildren)}`,
        "</ComponentbookPreview>",
        "",
      );
    }

    lines.push(
      ...renderCodeBlock(
        doc,
        component,
        renderElement(exportName, requiredProps, children && renderChildren(children)),
      ),
    );
  }

  if (component.props.length > 0) lines.push(await renderTypeTable(component.props, framework), "");

  return { lines, exampleImports };
}

function renderExample(
  doc: ComponentDoc,
  component: ComponentInfo,
  text: string,
): { lines: string[]; exampleImports: StaticImport[] } {
  const astro = isAstroPath(doc.sourcePath);
  const defaultLang = astro ? "astro" : "tsx";
  const previewLangs = astro ? ["tsx", "jsx", "astro"] : ["tsx", "jsx"];
  const caption = /^<caption>(.*?)<\/caption>\s*\n/.exec(text);
  const body = caption ? text.slice(caption[0].length) : text;
  // An example without a code fence is a single code block.
  const markdown =
    (caption ? `${caption[1]}\n\n` : "") +
    (/^\s*[`~]{3}/m.test(body) ? body : "```" + defaultLang + "\n" + body + "\n```");

  const exampleImports: StaticImport[] = [];
  const lines = fromMarkdown(markdown).children.flatMap((node) => {
    const raw = markdown.slice(node.position?.start.offset, node.position?.end.offset);
    if (node.type !== "code") return [escapeMDX(raw), ""];
    if (node.lang && !previewLangs.includes(node.lang)) return [raw, ""];

    const code = node.value;
    const { imports, markup } =
      (node.lang ?? defaultLang) === "astro" ? splitAstroExample(code) : splitExample(code);
    // Imports must be at the top level of the MDX file, not in the preview.
    exampleImports.push(...imports);
    return [
      "<ComponentbookPreview>",
      // Without the expression, MDX parses text on its own line as a Markdown paragraph:
      // `<A>\n  Use *args* here.\n</A>` -> `<A><p>Use <em>args</em> here.</p></A>`
      // Without the fragment, MDX can't parse several root elements as an expression:
      // `{<A /><B />}` -> a syntax error
      // The fragment isn't indented, to keep the markup nested in it.
      "{<>",
      // MDX strips up to 2 spaces from each line of an expression, so the markup is indented by 2.
      // If it is indented by 4, multiline strings get 2 extra spaces:
      // `a\n  b` -> `a\n    b`
      // Blank lines stay empty, to avoid trailing whitespace.
      ...markup.split("\n").map((line) => (line === "" ? line : `  ${line}`)),
      "</>}",
      "</ComponentbookPreview>",
      "",
      ...renderCodeBlock(doc, component, code),
    ];
  });
  return { lines, exampleImports };
}

function splitExample(code: string): { imports: StaticImport[]; markup: string } {
  // An example can have several root elements, like `<A /><B />`, so parse errors are ignored.
  const { staticImports } = parseSync("example.tsx", code).module;
  // The offset in the code where the import declarations end.
  const end = Math.max(0, ...staticImports.map(({ end }) => end));
  return { imports: staticImports, markup: end > 0 ? code.slice(end).trimStart() : code };
}

/** Required props excluding `children`, which is passed as element children. */
function getRequiredProps(component: ComponentInfo): PropInfo[] {
  return component.props.filter((prop) => prop.required && prop.name !== "children");
}

function canPreview(component: ComponentInfo): boolean {
  return (
    component.examples.length > 0 ||
    component.props.every((prop) => !prop.required || prop.dummy !== undefined)
  );
}

function renderCodeBlock(doc: ComponentDoc, component: ComponentInfo, code: string): string[] {
  const components = getComponentsToImport(doc, component, code);
  const declaration = `import ${renderImportClause(components)} from ${JSON.stringify(doc.displaySpecifier)};`;
  return isAstroPath(doc.sourcePath)
    ? renderAstroCodeBlock(declaration, code)
    : ["```tsx", declaration, "", code, "```", ""];
}

/** Returns the target component, and the others used in the code. */
function getComponentsToImport(
  doc: ComponentDoc,
  targetComponent: ComponentInfo,
  code: string,
): ComponentInfo[] {
  const words = new Set(code.match(/[\w$]+/g));
  return doc.components.filter(
    (component) => component === targetComponent || words.has(component.exportName),
  );
}

function renderElement(
  name: string,
  requiredProps: PropInfo[],
  children: string | undefined,
): string {
  const attributes = requiredProps.map((prop) => ` ${renderAttribute(prop)}`).join("");
  return children === undefined
    ? `<${name}${attributes} />`
    : `<${name}${attributes}>${children}</${name}>`;
}

/** Renders the dummy as an attribute, or a placeholder if there's no dummy. */
function renderAttribute({ name, dummy }: PropInfo): string {
  // `data-node` -> `data-node={dataNode}`
  if (dummy === undefined) return `${name}={${toCamelCase(name)}}`;
  // `"a\nb"` -> `"a\\nb"`
  // `"&lt;"` -> `"<"`
  return /^"[^"\\&]*"$/.test(dummy) ? `${name}=${dummy}` : `${name}={${dummy}}`;
}

function toCamelCase(name: string): string {
  return name.replace(/-(\w)/g, (_, char: string) => char.toUpperCase());
}

/** Renders the dummy as JSX children, or a placeholder if there's no dummy. */
function renderChildren({ dummy }: PropInfo): string {
  if (dummy === undefined) return "{children}";
  // `"{x}"` -> `x`
  // `"&lt;"` -> `"<"`
  return /^"[^"\\&{}<>]*"$/.test(dummy) ? (JSON.parse(dummy) as string) : `{${dummy}}`;
}

/** Renders the type table, with its code highlighted and its descriptions rendered at build time. */
async function renderTypeTable(props: PropInfo[], framework: Framework): Promise<string> {
  const entries = await Promise.all(
    props.map(async ({ name, remarks, ...prop }) => [
      name,
      {
        ...prop,
        description: renderDescription(prop.description, remarks),
        type: await highlightCode(prop.type, framework),
        typeDescription: await highlightCode(prop.typeDescription, framework),
        default: prop.default && (await highlightCode(prop.default, framework)),
      },
    ]),
  );
  const type = JSON.stringify(Object.fromEntries(entries), null, 2);
  // `client:load` is for Astro with Fumadocs. Without it, the table's rows can't be expanded.
  const directive = framework === "fumadocs" ? " client:load" : "";
  return `<ComponentbookTypeTable${directive} type={${type}} />`;
}

function renderDescription(
  description: string | undefined,
  remarks: string | undefined,
): string | undefined {
  const lines: string[] = [];
  if (description) lines.push(description, "");
  if (remarks) lines.push("**Remarks**", "", remarks, "");
  return lines.length > 0 ? micromark(lines.join("\n")) : undefined;
}

function highlightCode(code: string, framework: Framework): Promise<string> {
  return codeToHtml(code, {
    lang: "ts",
    themes:
      framework === "starlight"
        ? // Starlight's default theme.
          { light: "night-owl-light", dark: "night-owl" }
        : // Fumadocs' default theme.
          { light: "github-light", dark: "github-dark" },
    defaultColor: false,
    structure: "inline",
  });
}

/** Escapes characters MDX would parse as JSX or expressions, outside code spans. */
function escapeMDX(text: string): string {
  return text
    .split(/(`[^`]*`)/)
    .map((part, index) => (index % 2 === 1 ? part : part.replace(/[{}<]/g, (char) => `\\${char}`)))
    .join("");
}
