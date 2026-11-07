#!/usr/bin/env node
import { parseArgs } from "node:util";

import packageConfig from "../../package.json" with { type: "json" };
import build from "../build/index.js";
import { loadConfig } from "../config.js";
import watch from "../watch/index.js";

const [bin] = Object.keys(packageConfig.bin);

const { values, positionals } = parseArgs({
  options: {
    version: {
      short: "v",
      type: "boolean",
    },
    help: {
      short: "h",
      type: "boolean",
    },
    "output-dir": {
      short: "o",
      type: "string",
    },
    exclude: {
      type: "string",
      multiple: true,
    },
  },
  allowPositionals: true,
});

const help = `Usage: ${bin} [options] <command>

${packageConfig.description}

Options:
  -v, --version            output the version number
  -h, --help               display help for command

Commands:
  build                    build the Componentbook project
  watch                    build the Componentbook project and rebuild on changes

Run "${bin} <command> --help" for command options.`;

const buildHelp = `Usage: ${bin} build [options]

Build the Componentbook project

Options:
  -o, --output-dir <dir>   output directory for MDX files (default: "content/docs/components")
      --exclude <pattern>  skip paths matching a glob pattern, e.g. "src/components/ui" (repeatable)
  -h, --help               display help for command`;

const watchHelp = `Usage: ${bin} watch [options]

Build the Componentbook project and rebuild on changes

Options:
  -o, --output-dir <dir>   output directory for MDX files (default: "content/docs/components")
      --exclude <pattern>  skip paths matching a glob pattern, e.g. "src/components/ui" (repeatable)
  -h, --help               display help for command`;

const command = positionals[0];
const config = await loadConfig();
const outputDir = values["output-dir"] ?? config.outputDir ?? "content/docs/components";
const exclude = values.exclude ?? config.exclude ?? [];

if (values.version) console.log(packageConfig.version);
else if (values.help)
  switch (command) {
    case "build":
      console.log(buildHelp);
      break;

    case "watch":
      console.log(watchHelp);
      break;

    default:
      console.log(help);
  }
else if (command === "build") await build({ outputDir, exclude });
else if (command === "watch") await watch({ outputDir, exclude });
else if (command === undefined) {
  console.error(help);
  process.exitCode = 1;
} else {
  console.error(`Unknown command: ${command}`);
  console.error();
  console.error(help);
  process.exitCode = 1;
}
