import { pathToFileURL } from "node:url";

export interface ComponentbookConfig {
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
