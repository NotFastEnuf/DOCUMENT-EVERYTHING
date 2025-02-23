import { useEffect } from "react";
import { dbHelpers } from "./db";
import { useProjectStore } from "./store";

export const useInitializeProjects = () => {
  useEffect(() => {
    const loadProjects = async () => {
      const projects = await dbHelpers.getAllProjects();
      if (projects.length === 0) {
        // Initialize with default project if no projects exist
        const defaultProject = useProjectStore.getState().projects[0];
        if (defaultProject) {
          await dbHelpers.saveProject(defaultProject);
          useProjectStore.setState({
            projects: [defaultProject],
            selectedProjectId: defaultProject.id,
          });
        }
      } else {
        // If we have projects, set them and select the first one
        useProjectStore.setState({
          projects,
          selectedProjectId: projects[0].id,
        });
      }
    };

    loadProjects();
  }, []);
};
