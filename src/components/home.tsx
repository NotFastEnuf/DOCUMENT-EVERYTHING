import React, { useState } from "react";
import { useInitializeProjects } from "@/lib/hooks";
import ProjectSidebar from "./ProjectSidebar";
import StepEditor from "./StepEditor";
import { useProjectStore } from "@/lib/store";
import Banner from "./Banner";

const Home = () => {
  useInitializeProjects();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    projects,
    selectedProjectId,
    setSelectedProject,
    updateProjectSteps,
    createProject,
    updateProjectName,
    importProject,
    deleteProject,
    exportProject,
  } = useProjectStore();

  // Set first project as selected if we have projects but no selection
  React.useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProject(projects[0].id);
    }
  }, [projects, selectedProjectId, setSelectedProject]);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleSlideClick = (slideId: string) => {
    const element = document.getElementById(`slide-${slideId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <Banner onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex h-screen overflow-hidden">
        <div
          className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-30 xl:hidden transition-opacity ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => setIsSidebarOpen(false)}
        />
        <div
          className={`fixed xl:static inset-y-0 left-0 z-40 w-80 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}`}
        >
          <ProjectSidebar
            projects={projects}
            selectedProjectId={selectedProjectId}
            onProjectSelect={(id) => {
              setSelectedProject(id);
              setIsSidebarOpen(false);
            }}
            onNewProject={createProject}
            onImport={importProject}
            onSlideClick={handleSlideClick}
            onDeleteProject={deleteProject}
            onExportProject={exportProject}
          />
        </div>
        <div className="flex-1 overflow-hidden w-full">
          {selectedProject ? (
            <StepEditor
              steps={selectedProject.steps}
              projectName={selectedProject.name}
              onStepsChange={(steps) =>
                updateProjectSteps(selectedProjectId, steps)
              }
              onSlideClick={handleSlideClick}
              onProjectNameChange={(name) =>
                updateProjectName(selectedProjectId, name)
              }
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center px-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No project to display
                </h2>
                <p className="text-gray-600">
                  Please add a new project to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
