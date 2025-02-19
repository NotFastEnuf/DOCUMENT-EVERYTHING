import { create } from "zustand";
import { Step, Project } from "./types";

interface ProjectStore {
  projects: Project[];
  selectedProjectId: string;
  setSelectedProject: (id: string) => void;
  updateProjectSteps: (projectId: string, steps: Step[]) => void;
  updateProjectName: (projectId: string, name: string) => void;
  createProject: () => void;
  deleteProject: (id: string) => void;
  exportProject: (id: string) => void;
  importProject: (projectData: { name: string; steps: Step[] }) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [
    {
      id: "1",
      name: "Getting Started Guide",
      steps: [
        {
          id: "1",
          fields: [
            {
              id: "f1",
              type: "title",
              content: "Welcome to Project Documentation",
            },
            {
              id: "f2",
              type: "text",
              content:
                "This guide will help you create detailed project documentation with step-by-step instructions.",
            },
            {
              id: "f3",
              type: "image",
              content:
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
              width: 800,
              height: 400,
            },
          ],
        },
        {
          id: "2",
          fields: [
            {
              id: "f4",
              type: "title",
              content: "Creating Your First Slide",
            },
            {
              id: "f5",
              type: "text",
              content:
                "Click the 'Add Slide' button to create a new slide. Each slide can include text and images.",
            },
          ],
        },
        {
          id: "3",
          fields: [
            {
              id: "f6",
              type: "title",
              content: "Organizing Slides",
            },
            {
              id: "f7",
              type: "text",
              content:
                "Drag and drop slides to reorder them. Use the grip handle on the left to move slides around.",
            },
          ],
        },
        {
          id: "4",
          fields: [
            {
              id: "f8",
              type: "title",
              content: "Adding Media",
            },
            {
              id: "f9",
              type: "text",
              content:
                "Enhance your documentation by adding images to each slide using the 'Add Image' button.",
            },
          ],
        },
        {
          id: "5",
          fields: [
            {
              id: "f10",
              type: "title",
              content: "Previewing and Exporting",
            },
            {
              id: "f11",
              type: "text",
              content:
                "Use the 'Preview' button to see how your documentation will look, and export it when you're ready.",
            },
          ],
        },
      ],
    },
  ],
  selectedProjectId: "1",
  setSelectedProject: (id) => set({ selectedProjectId: id }),
  updateProjectSteps: (projectId, steps) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId ? { ...project, steps } : project,
      ),
    })),
  updateProjectName: (projectId, name) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId ? { ...project, name } : project,
      ),
    })),
  createProject: () =>
    set((state) => {
      const newProject = {
        id: Date.now().toString(),
        name: "New Project",
        steps: [
          {
            id: "1",
            fields: [
              {
                id: "f12",
                type: "title",
                content: "Getting Started",
              },
              {
                id: "f13",
                type: "text",
                content: "Begin documenting your project...",
              },
            ],
          },
        ],
      };
      return {
        projects: [...state.projects, newProject],
        selectedProjectId: newProject.id,
      };
    }),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      selectedProjectId:
        state.selectedProjectId === id
          ? state.projects[0]?.id || ""
          : state.selectedProjectId,
    })),

  exportProject: (id) =>
    set((state) => {
      const project = state.projects.find((p) => p.id === id);
      if (!project) return state;

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

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>${project.name}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { margin: 0; padding: 20px; font-family: system-ui, sans-serif; }
              .prose { max-width: 8.5in; margin: auto; }
              img, video { max-width: 100%; height: auto; border-radius: 0.5rem; }
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
                  (step, index) => `
                <div class="mb-8">
                  ${step.fields
                    .map((field) => {
                      if (field.type === "title") {
                        return `<h2 class="text-xl font-semibold mb-4">${field.content}</h2>`;
                      } else if (field.type === "text") {
                        return `<p class="mb-4 whitespace-pre-wrap">${field.content}</p>`;
                      } else if (field.type === "image") {
                        return `<img src="${field.content}" alt="Step ${index + 1}" class="rounded-lg mb-4" style="max-width: 100%; width: ${field.width}px; height: ${field.height}px; object-fit: cover;">`;
                      } else if (field.type === "video") {
                        if (field.embedUrl) {
                          return `<iframe src="${field.embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="rounded-lg mb-4" style="max-width: 100%; width: ${field.width || 800}px; height: ${field.height || 450}px;"></iframe>`;
                        } else {
                          return `<video src="${field.content}" controls class="rounded-lg mb-4" style="max-width: 100%; width: ${field.width || 800}px; height: ${field.height || 450}px;"></video>`;
                        }
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
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return state;
    }),

  importProject: (projectData) =>
    set((state) => {
      const newProject = {
        id: Date.now().toString(),
        name: projectData.name,
        steps: projectData.steps,
      };
      return {
        projects: [...state.projects, newProject],
        selectedProjectId: newProject.id,
      };
    }),
}));
