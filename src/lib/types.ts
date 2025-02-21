export type StepFieldType = "title" | "text" | "image" | "video" | "iframe";

export interface StepField {
  id: string;
  type: StepFieldType;
  content: string;
  width?: number;
  height?: number;
  embedUrl?: string;
}

export interface Step {
  id: string;
  fields: StepField[];
}

export interface Project {
  id: string;
  name: string;
  steps: Step[];
}

export interface ProjectStore {
  projects: Project[];
  selectedProjectId: string;
  setSelectedProject: (id: string) => void;
  updateProjectSteps: (projectId: string, steps: Step[]) => void;
  updateProjectName: (projectId: string, name: string) => void;
  createProject: () => void;
  deleteProject: (id: string) => void;
  exportProject: (id: string) => void;
  importProject: (projectData: { name: string; steps: Step[] }) => void;
  resetToDefault: () => void;
}
