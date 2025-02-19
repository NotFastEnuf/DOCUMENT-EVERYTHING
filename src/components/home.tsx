import React from "react";
import ProjectSidebar from "./ProjectSidebar";
import StepEditor from "./StepEditor";
import { useProjectStore } from "@/lib/store";

const Home = () => {
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
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleSlideClick = (slideId: string) => {
    const element = document.getElementById(`slide-${slideId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <ProjectSidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onProjectSelect={setSelectedProject}
        onNewProject={createProject}
        onImport={importProject}
        onSlideClick={handleSlideClick}
        onDeleteProject={deleteProject}
        onExportProject={exportProject}
      />
      <div className="flex-1 overflow-hidden">
        <StepEditor
          steps={selectedProject?.steps}
          projectName={selectedProject?.name}
          onStepsChange={(steps) =>
            updateProjectSteps(selectedProjectId, steps)
          }
          onSlideClick={handleSlideClick}
          onProjectNameChange={(name) =>
            updateProjectName(selectedProjectId, name)
          }
        />
      </div>
    </div>
  );
};

export default Home;
