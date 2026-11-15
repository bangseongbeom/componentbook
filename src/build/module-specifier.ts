import { relative, resolve, sep } from "node:path";

import { Project } from "typescript/unstable/async";

/** Returns a relative module specifier like `../../components/ui/button`. */
export function getRelativeSpecifier(fromDir: string, fileName: string): string {
  const specifier = toPosix(relative(fromDir, fileName.replace(/\.[cm]?[jt]sx?$/, "")));
  return specifier.startsWith(".") ? specifier : `./${specifier}`;
}

const aliases = ["@/*", "@site/*"];

/** Returns a module specifier using a path alias (e.g. `@/components/ui/button`), or a module specifier relative to the cwd. */
export function getDisplaySpecifier(project: Project, fileName: string): string {
  const { compilerOptions } = project;
  // Paths in `compilerOptions.paths` are relative to `compilerOptions.baseUrl` if it is set (deprecated, but Docusaurus sets it).
  // Otherwise, the paths are relative to `compilerOptions.pathsBasePath` (the directory of the tsconfig that defines `paths`).
  // Neither option is in the `CompilerOptions` type.
  const { baseUrl, pathsBasePath } = compilerOptions as { baseUrl?: string; pathsBasePath: string };
  const basePath = baseUrl ?? pathsBasePath;

  for (const alias of aliases) {
    const target = compilerOptions.paths?.[alias]?.[0];
    if (!target) continue;

    const root = resolve(basePath, target.replace("*", ""));
    const specifier = toPosix(relative(root, fileName.replace(/\.[cm]?[jt]sx?$/, ""))).replace(
      /(^|\/)index$/,
      "",
    );
    if (!specifier.startsWith("..")) return alias.replace("*", specifier);
  }

  return getRelativeSpecifier(process.cwd(), fileName);
}

function toPosix(value: string): string {
  return value.split(sep).join("/");
}
