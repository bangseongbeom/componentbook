import type { Dirent } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, posix, sep } from "node:path";

import { parseSync, type StaticImport } from "oxc-parser";
import {
  isObjectBindingPattern,
  isVariableStatement,
  type ObjectBindingPattern,
  type SourceFile,
} from "typescript/unstable/ast";
import type { FileSystem, FileSystemEntries } from "typescript/unstable/fs";

export function isAstroPath(path: string): boolean {
  return path.endsWith(".astro");
}

export function toTypeScriptPath(path: string): string {
  return isAstroPath(path) ? `${path}.ts` : path;
}

export function fromTypeScriptPath(path: string): string {
  return path.replace(/\.astro\.ts$/, ".astro");
}

function splitAstroFrontmatter(code: string): { frontmatter?: string; template: string } {
  const match = /^\s*---[^\S\n]*\n(.*?\n)?---[^\S\n]*(?:\n|$)/s.exec(code);
  return match
    ? { frontmatter: match[1]?.trimEnd() ?? "", template: code.slice(match[0].length).trimStart() }
    : { template: code.trimStart() };
}

/**
 * Splits an Astro example into the imports of its frontmatter and its template, which is previewed.
 * The rest of the frontmatter is left out of the preview, like the code around the JSX of other examples.
 */
export function splitAstroExample(code: string): { imports: StaticImport[]; markup: string } {
  const { frontmatter, template } = splitAstroFrontmatter(code);
  return {
    imports: frontmatter ? parseSync("example.ts", frontmatter).module.staticImports : [],
    markup: template,
  };
}

export function renderAstroCodeBlock(importDeclaration: string, code: string): string[] {
  const { frontmatter, template } = splitAstroFrontmatter(code);
  return [
    "```astro",
    "---",
    importDeclaration,
    ...(frontmatter ? [frontmatter] : []),
    "---",
    "",
    template,
    "```",
    "",
  ];
}

/**
 * Generates TypeScript from the frontmatter of an Astro component, with the component as its default export.
 * The first JSDoc comment of the frontmatter documents the component.
 */
function astroToTypeScript(source: string): string {
  const { frontmatter = "" } = splitAstroFrontmatter(source);
  const doc = /^\s*(\/\*\*.*?\*\/)/s.exec(frontmatter)?.[1] ?? "";
  const rest = frontmatter.replace(doc, "");
  // The props are typed by `Props`, declared or imported in the frontmatter.
  const parameter = /\bProps\b/.test(rest) ? "props: Props" : "";
  return `${rest}\n${doc}\nexport default function (${parameter}) {}\n`;
}

/** Finds the `{ variant = "default" }` of `const { variant = "default" } = Astro.props` in the frontmatter. */
export function findAstroPropsPattern(sourceFile: SourceFile): ObjectBindingPattern | undefined {
  for (const statement of sourceFile.statements)
    if (isVariableStatement(statement))
      for (const { name, initializer } of statement.declarationList.declarations)
        if (
          isObjectBindingPattern(name) &&
          initializer &&
          /^Astro\.props\b/.test(initializer.getText())
        )
          return name;
  return undefined;
}

/** Returns a file system that adds the TypeScript files of the Astro components to the real one. */
export async function createAstroFileSystem(astroPaths: string[]): Promise<FileSystem | undefined> {
  if (astroPaths.length === 0) return undefined;

  // TypeScript uses `/` on every platform.
  const files = new Map<string, string>();
  const directories = new Map<string, FileSystemEntries>();
  for (const astroPath of astroPaths) {
    const path = toPosix(toTypeScriptPath(astroPath));
    const directory = posix.dirname(path);
    files.set(path, astroToTypeScript(await readFile(astroPath, "utf8")));

    const entries = directories.get(directory) ?? (await readEntries(dirname(astroPath)));
    entries.files.push(posix.basename(path));
    directories.set(directory, entries);
  }

  // `undefined` falls back to the real file system.
  return {
    readFile: (fileName) => files.get(fileName),
    fileExists: (fileName) => files.has(fileName) || undefined,
    realpath: (path) => (files.has(path) ? path : undefined),
    getAccessibleEntries: (directoryName) => directories.get(directoryName),
  };
}

async function readEntries(directoryName: string): Promise<FileSystemEntries> {
  const entries: FileSystemEntries = { files: [], directories: [] };
  for (const entry of await readdir(directoryName, { withFileTypes: true }))
    ((await isDirectory(entry)) ? entries.directories : entries.files).push(entry.name);
  return entries;
}

async function isDirectory(entry: Dirent): Promise<boolean> {
  if (!entry.isSymbolicLink()) return entry.isDirectory();
  const stats = await stat(join(entry.parentPath, entry.name)).catch(() => undefined);
  return stats?.isDirectory() ?? false;
}

function toPosix(path: string): string {
  return path.split(sep).join("/");
}
