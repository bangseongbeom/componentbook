import { watch } from "node:fs/promises";
import { relative, sep } from "node:path";

import { debounce } from "perfect-debounce";

import build from "../build/index.js";

export default async function ({ outputDir }: { outputDir: string }): Promise<void> {
  const rebuild = debounce(() => build({ outputDir }));
  const outputPrefix = relative(process.cwd(), outputDir) + sep;

  await rebuild();
  console.log("Watching for changes...");

  for await (const _ of watch(process.cwd(), {
    recursive: true,
    ignore: [
      "**/node_modules{,/**}",
      "**/.*{,/**}",
      (filename) => filename.startsWith(outputPrefix),
    ],
  }))
    rebuild();
}
