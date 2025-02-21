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
