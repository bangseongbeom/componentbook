import { join } from "node:path";

import { API, Project } from "typescript/unstable/async";
import type { FileSystem } from "typescript/unstable/fs";

export async function withProject<T>(
  fn: (project: Project) => Promise<T>,
  fs?: FileSystem,
): Promise<T> {
  const configFileName = join(process.cwd(), "tsconfig.json");
  const api = new API({ fs });
  try {
    const snapshot = await api.updateSnapshot({
      openProjects: [configFileName],
    });
    try {
      const project = snapshot.getProject(configFileName);
      if (!project) throw new Error(`Cannot load the TypeScript project at ${configFileName}`);
      return await fn(project);
    } finally {
      await snapshot.dispose();
    }
  } finally {
    await api.close();
  }
}
