import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db, dbHelpers } from "./db";
import { Step, Project, StepField, StepFieldType } from "./types";

interface ProjectStore {
  projects: Project[];
  selectedProjectId: string;
  setSelectedProject: (id: string) => void;
  updateProjectSteps: (projectId: string, steps: Step[]) => void; // Mark as non-async
  updateProjectName: (projectId: string, name: string) => void;
  createProject: () => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  exportProject: (id: string) => void;
  importProject: (projectData: {
    name: string;
    steps: Step[];
  }) => Promise<void>;
  resetToDefault: () => Promise<void>;
}

// Helper function to create StepField objects with guaranteed type safety
const createStepField = (
  id: string,
  type: StepFieldType,
  content: string,
  width?: number,
  height?: number,
  embedUrl?: string,
): StepField => ({
  id,
  type,
  content,
  width,
  height,
  embedUrl,
});

const defaultState = {
  projects: [
    {
      id: "1",
      name: "Getting Started",
      steps: [
        {
          id: "1",
          fields: [
            createStepField("f1", "title", "Welcome to Project Documentation"),
            createStepField(
              "f2",
              "text",
              "This quick start will help you create and maintain detailed project documentation, step-by-step instructions, or interactive slide shows as HTML.",
            ),
            createStepField(
              "f3",
              "image",
              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
              800,
              400,
            ),
          ],
        },
        {
          id: "2",
          fields: [
            createStepField("f4", "title", "Creating Your First Slide"),
            createStepField(
              "f5",
              "text",
              "Click the 'Add Slide' button to create a new slide. Each slide can include text and interactive media.",
            ),
          ],
        },
        {
          id: "3",
          fields: [
            createStepField("f6", "title", "Organizing Slides"),
            createStepField(
              "f7",
              "text",
              "Drag and drop slides to reorder them. Use the grip handle on the left to move slides around.",
            ),
          ],
        },
        {
          id: "4",
          fields: [
            createStepField("f8", "title", "Adding Media"),
            createStepField(
              "f9",
              "text",
              "Enhance your documentation by adding media to each slide using the 'Encode Media' or 'Embed Media' buttons.  Encoded videos or images will be available for offline presentation.  Embedded media will be interactive online!",
            ),
          ],
        },
        {
          id: "5",
          fields: [
            createStepField("f10", "title", "Previewing and Exporting"),
            createStepField(
              "f11",
              "text",
              "Use the 'Preview' button to see how your documentation will look, and export it when you're ready.",
            ),
          ],
        },

        {
          id: "6",
          fields: [
            createStepField("f12", "title", "Returning and Revising"),
            createStepField(
              "f13",
              "text",
              "Start documenting every new project with the '+ New Project' button and manage all your 'Document-Everything' projects using the 'Import Project' button.  Use the 'Settings' button to reset persistant memory when you'd like to start with a blank slate.",
            ),
          ],
        },
      ],
    },
  ],
  selectedProjectId: "1", // Default to first project if it exists
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  ...defaultState,

  setSelectedProject: (id) => set({ selectedProjectId: id }),

  updateProjectSteps: (projectId, steps) => {
    // 1. Optimistically update the UI
    set((state) => {
      return {
        ...state, // Copy existing state
        projects: state.projects.map((project) => {
          if (project.id === projectId) {
            // Create a new project object with updated steps
            return {
              ...project,
              steps: [...steps], // Ensure steps is also copied
            };
          }
          return project; // Return other projects unchanged
        }),
      };
    });

    // 2. Persist to IndexedDB (in the background, no await)
    dbHelpers
      .saveProject({
        ...get().projects.find((p) => p.id === projectId)!, // Get the full project state, not just steps
        steps: steps,
      })
      .catch((error) => {
        console.error("Failed to save to IndexedDB, reverting state", error);
        // Implement some kind of state versioning for reliable revert
        // Consider implementing a way to revert the steps to the previous known version
      });
  },

  updateProjectName: (projectId, name) => {
    // 1. Optimistically update the UI
    set((state) => ({
      ...state,
      projects: state.projects.map((project) =>
        project.id === projectId ? { ...project, name } : project,
      ),
    }));

    // 2. Persist to IndexedDB (in the background, no await)
    dbHelpers
      .saveProject({
        ...get().projects.find((p) => p.id === projectId)!,
        name: name,
      })
      .catch((error) => {
        console.error("Failed to save to IndexedDB, reverting state", error);
        // Implement a revert mechanism here to restore the previous name
        //  if the save fails
      });
  },

  createProject: async () => {
    const newProject = {
      id: Date.now().toString(),
      name: "New Project",
      steps: [
        {
          id: "1",
          fields: [
            createStepField("f12", "title", "Getting Started"),
            createStepField("f13", "text", "Begin documenting your project..."),
          ],
        },
      ],
    };
    await dbHelpers.saveProject(newProject);
    set((state) => ({
      projects: [...state.projects, newProject],
      selectedProjectId: newProject.id,
    }));
  },
  deleteProject: async (id) => {
    await dbHelpers.deleteProject(id);
    set((state) => {
      const filteredProjects = state.projects.filter((p) => p.id !== id);
      const isCurrentProjectDeleted = state.selectedProjectId === id;

      // If we deleted the current project, try to select the next available one
      let newSelectedId = state.selectedProjectId;
      if (isCurrentProjectDeleted && filteredProjects.length > 0) {
        // Find the index of the deleted project
        const deletedIndex = state.projects.findIndex((p) => p.id === id);
        // Try to select the next project, or the last one if we deleted the last project
        const nextIndex = Math.min(deletedIndex, filteredProjects.length - 1);
        newSelectedId = filteredProjects[nextIndex].id;
      } else if (isCurrentProjectDeleted) {
        // If no projects left, clear the selection
        newSelectedId = "";
      }

      return {
        projects: filteredProjects,
        selectedProjectId: newSelectedId,
      };
    });
  },

  exportProject: (id) => {
    console.log("Exporting project:", id);
    const state = get();
    const project = state.projects.find((p) => p.id === id);
    if (!project) return;

    const projectData = {
      version: "1.0",
      metadata: {
        name: project.name,
        updatedAt: new Date().toISOString(),
      },
      content: {
        steps: project.steps,
      },
    };

    const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>${project.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { margin: 0; padding: 20px; font-family: system-ui, sans-serif; }
      .prose { max-width: 8.5in; margin: auto; }
      img, video { max-width: 100%; height: auto; border-radius: 0.5rem; }
      a { color: #0066cc; text-decoration: underline; }
    </style>
    <script type="application/json" id="tempo-project-data">
      ${JSON.stringify(projectData)}
    </script>
  </head>
  <body>
    <div class="prose">
      <h1 class="text-3xl font-bold mb-8">${project.name}</h1>
      ${project.steps
        .map(
          (step) => `
        <div class="mb-8">
          ${step.fields
            .map((field) => {
              if (field.type === "title") {
                return `<h2 class="text-xl font-semibold mb-4">${field.content}</h2>`;
              } else if (field.type === "text") {
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const contentWithLinks = field.content.replace(
                  urlRegex,
                  (url) =>
                    `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`,
                );
                return `<p class="mb-4 whitespace-pre-wrap">${contentWithLinks}</p>`;
              } else if (field.type === "image") {
                return `<img src="${field.content}" alt="Step" class="rounded-lg mb-4" style="max-width: 100%; width: ${field.width}px; height: ${field.height}px; object-fit: cover;">`;
              } else if (field.type === "video") {
                return `<video src="${field.content}" controls class="rounded-lg mb-4" style="max-width: 100%; width: ${field.width || 800}px; height: ${field.height || 450}px;"></video>`;
              } else if (field.type === "iframe") {
                return `<iframe src="${field.content}" frameborder="0" allow="serial; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="rounded-lg mb-4" style="max-width: 100%; width: ${field.width || 800}px; height: ${field.height || 450}px;"></iframe>`;
              }
              return "";
            })
            .join("")}
        </div>
      `,
        )
        .join("")}
    </div>
  </body>
</html>`;

    try {
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting project:", error);
    }
  },
  importProject: async (projectData) => {
    const newProject = {
      id: Date.now().toString(),
      name: projectData.name,
      steps: projectData.steps,
    };
    await dbHelpers.saveProject(newProject);
    set((state) => ({
      projects: [...state.projects, newProject],
      selectedProjectId: newProject.id,
    }));
  },

  resetToDefault: async () => {
    await dbHelpers.clearAllData();
    set(defaultState);
  },
}));

const persistedStore = persist(useProjectStore, {
  name: "project-ui-storage",
  partialize: (state: ProjectStore) => ({
    selectedProjectId: state.selectedProjectId,
  }),
});
