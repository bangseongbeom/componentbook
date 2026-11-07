import { watch } from "node:fs/promises";
import { relative, sep } from "node:path";
import { styleText } from "node:util";

import { debounce } from "perfect-debounce";

import build from "../build/index.js";

export default async function ({
  outputDir,
  exclude,
}: {
  outputDir: string;
  exclude: string[];
}): Promise<void> {
  const rebuild = debounce(async () => {
    try {
      await build({ outputDir, exclude });
    } catch (error) {
      console.error(styleText("red", "Failed to build components", { stream: process.stderr }));
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  });
  const outputPrefix = relative(process.cwd(), outputDir) + sep;

  rebuild().then(() => console.log("Watching for changes..."));

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
