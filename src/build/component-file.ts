import { glob } from "node:fs/promises";
import { join, relative } from "node:path";

export const componentRoots = ["components", "src/components", "app/components"];

export interface ComponentFile {
  absolutePath: string;
  relativePath: string;
}

export async function scanComponentFiles(exclude: string[]): Promise<ComponentFile[]> {
  const componentFiles: ComponentFile[] = [];

  for (const root of componentRoots) {
    const entries: string[] = [];
    for await (const entry of glob(`${root}/**/*.{tsx,jsx}`, {
      exclude: ["**/*.{test,spec,stories}.*", ...exclude],
    }))
      entries.push(entry);

    entries.sort();

    for (const entry of entries)
      componentFiles.push({
        absolutePath: join(process.cwd(), entry),
        relativePath: relative(root, entry),
      });
  }

  return componentFiles;
}
