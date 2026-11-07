import { watch } from "node:fs/promises";
import { relative, sep } from "node:path";

import { log } from "@clack/prompts";
import { debounce } from "perfect-debounce";

import build from "../build/index.js";

export default async function ({ outputDir }: { outputDir: string }): Promise<void> {
  const rebuild = debounce(() => build({ outputDir }));
  const outputPrefix = relative(process.cwd(), outputDir) + sep;

  await rebuild();
  log.info("Watching for changes", { withGuide: false });

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
