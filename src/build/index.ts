import { dirname, relative, resolve } from "node:path";
import { styleText } from "node:util";

import { type ComponentInfo, getComponents } from "./component.js";
import { writeMDX, type WriteStatus } from "./mdx.js";
import { getDisplaySpecifier, getRelativeSpecifier } from "./module-specifier.js";
import { withProject } from "./project.js";
import { componentRoots, scanSources } from "./source.js";

export interface ComponentDoc {
  /** Absolute path to the component source file. */
  sourceFileName: string;
  /** Absolute path to the generated MDX file. */
  mdxPath: string;
  /** Module specifier used to import the component from the MDX file. */
  relativeSpecifier: string;
  /** Module specifier shown in usage examples (e.g. `@/components/ui/button`). */
  displaySpecifier: string;
  components: ComponentInfo[];
}

export default async function ({ outputDir }: { outputDir: string }): Promise<void> {
  const sources = await scanSources();
  if (sources.length === 0) {
    console.error(
      styleText("red", `No components found in ${componentRoots.join(", ")}`, {
        stream: process.stderr,
      }),
    );
    process.exitCode = 1;
    return;
  }

  console.log(`Analyzing ${sources.length} files...`);

  const docs: ComponentDoc[] = [];
  const excludedSources: string[] = [];
  try {
    await withProject(async (project) => {
      const results = await Promise.all(
        sources.map(async ({ fileName, route }) => {
          const sourceFile = await project.program.getSourceFile(fileName);
          if (!sourceFile) return { fileName, route };
          else
            return {
              fileName,
              route,
              components: await getComponents(project, sourceFile),
            };
        }),
      );

      for (const { fileName, route, components } of results) {
        if (!components) {
          excludedSources.push(fileName);
          continue;
        }
        if (components.length === 0) continue;

        const mdxPath = resolve(process.cwd(), outputDir, `${route}.mdx`);
        docs.push({
          sourceFileName: fileName,
          mdxPath,
          relativeSpecifier: getRelativeSpecifier(dirname(mdxPath), fileName),
          displaySpecifier: getDisplaySpecifier(project, fileName),
          components,
        });
      }
    });
  } catch (error) {
    console.error(styleText("red", "Failed to analyze components", { stream: process.stderr }));
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }

  const componentCount = docs.reduce((count, doc) => count + doc.components.length, 0);
  console.log(`Found ${componentCount} components in ${docs.length} files`);

  for (const excludedSource of excludedSources)
    console.warn(
      styleText(
        "yellow",
        `excluded ${relative(process.cwd(), excludedSource)} (not included in tsconfig.json)`,
        { stream: process.stderr },
      ),
    );

  const counts: Record<WriteStatus, number> = {
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
  };
  const writeResults = await Promise.all(
    docs.map(async (doc) => ({ doc, status: await writeMDX(doc) })),
  );
  for (const { doc, status } of writeResults) {
    counts[status]++;

    const relativePath = relative(process.cwd(), doc.mdxPath);
    if (status === "created" || status === "updated")
      console.log(styleText("green", `${status} ${relativePath}`));
    else if (status === "skipped")
      console.warn(
        styleText("yellow", `skipped ${relativePath} (componentbook markers not found)`, {
          stream: process.stderr,
        }),
      );
  }

  console.log(
    Object.entries(counts)
      .filter(([status, count]) => count > 0 || status !== "skipped")
      .map(([status, count]) => `${count} ${status}`)
      .join(", "),
  );
}
