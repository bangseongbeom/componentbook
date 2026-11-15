import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export const frameworks = ["fumadocs", "docusaurus"] as const;

export type Framework = (typeof frameworks)[number];

export function isFramework(framework: string): framework is Framework {
  return (frameworks as readonly string[]).includes(framework);
}

const frameworkPackages: Record<Framework, string[]> = {
  fumadocs: ["fumadocs-ui", "fumadocs-core"],
  docusaurus: ["@docusaurus/core"],
};

export async function detectFramework(): Promise<Framework | undefined> {
  let packageConfig: { dependencies?: object; devDependencies?: object };
  try {
    packageConfig = JSON.parse(await readFile("package.json", "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }

  const dependencies = { ...packageConfig.dependencies, ...packageConfig.devDependencies };
  const detectedFrameworks = frameworks.filter((framework) =>
    frameworkPackages[framework].some((name) => Object.hasOwn(dependencies, name)),
  );
  return detectedFrameworks.length === 1 ? detectedFrameworks[0] : undefined;
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
