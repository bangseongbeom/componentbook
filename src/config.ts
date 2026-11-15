import { pathToFileURL } from "node:url";

export const frameworks = ["fumadocs", "docusaurus"] as const;

export type Framework = (typeof frameworks)[number];

export function isFramework(framework: string): framework is Framework {
  return (frameworks as readonly string[]).includes(framework);
}

export interface ComponentbookConfig {
  framework?: Framework;
  outputDir?: string;
  exclude?: string[];
}

export async function loadConfig(): Promise<ComponentbookConfig> {
  for (const ext of ["ts", "mts", "cts", "js", "mjs", "cjs"]) {
    const url = pathToFileURL(`componentbook.config.${ext}`).toString();
    try {
      return (await import(url)).default;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ERR_MODULE_NOT_FOUND") throw error;
    }
  }
  return {};
}
