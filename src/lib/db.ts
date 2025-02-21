import Dexie, { Table } from "dexie";
import { Project } from "./types";

export class ProjectDatabase extends Dexie {
  projects!: Table<Project>;

  constructor() {
    super("ProjectDB");
    this.version(1).stores({
      projects: "id, name",
    });
  }
}

export const db = new ProjectDatabase();

// Helper functions for database operations
export const dbHelpers = {
  async saveProject(project: Project) {
    return await db.projects.put(project);
  },

  async getAllProjects() {
    return await db.projects.toArray();
  },

  async deleteProject(id: string) {
    return await db.projects.delete(id);
  },

  async clearAllData() {
    return await db.projects.clear();
  },
};
