export interface StepField {
  id: string;
  type: "title" | "text" | "image" | "video" | "iframe";
  content: string;
  width?: number;
  height?: number;
  source?: "file" | "url";
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
