import { glob, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

import type { Framework } from "../config.js";
import { componentRoots } from "./component-file.js";
import type { WriteStatus } from "./mdx.js";

/** Copies the meta next to the components to the same folders in the output directory. */
export async function copyMeta(
  framework: Framework,
  outputDir: string,
  exclude: string[],
): Promise<{ path: string; status: WriteStatus }[]> {
  // Starlight has no folder meta. Its sidebar is configured in `astro.config.mjs` and the frontmatter.
  if (framework === "starlight") return [];

  const results = [];

  for (const root of componentRoots) {
    const entries: string[] = [];
    const pattern = {
      // A meta module like `meta.ts` is copied as is, so its relative imports resolve from the output directory.
      fumadocs: "meta{,.*}.{json,yaml,js,ts}",
      docusaurus: "_category_.{json,yml,yaml}",
    }[framework];
    for await (const entry of glob(`${root}/**/${pattern}`, { exclude })) entries.push(entry);

    entries.sort();

    for (const entry of entries) {
      const path = resolve(process.cwd(), outputDir, relative(root, entry));
      results.push({ path, status: await copyFileIfChanged(entry, path) });
    }
  }

  return results;
}

/** Copies the file, unless its copy is already up to date. */
async function copyFileIfChanged(inputPath: string, outputPath: string): Promise<WriteStatus> {
  const contents = await readFile(inputPath);

  let existingContents;
  try {
    existingContents = await readFile(outputPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, contents);
      return "created";
    } else throw error;
  }

  if (existingContents.equals(contents)) return "unchanged";

  await writeFile(outputPath, contents);

  return "updated";
}
