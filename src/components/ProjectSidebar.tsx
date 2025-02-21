import React, { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import {
  Plus,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FileText,
  Settings,
  MoreVertical,
  Trash2,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Project, Step } from "@/lib/types";
import { useProjectStore } from "@/lib/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface ProjectSidebarProps {
  projects?: Project[];
  selectedProjectId?: string;
  onProjectSelect?: (id: string) => void;
  onNewProject?: () => void;
  onImport?: (data: { name: string; steps: Step[] }) => void;
  onSlideClick?: (slideId: string) => void;
  onDeleteProject?: (id: string) => void;
  onExportProject?: (id: string) => void;
}

const ProjectSidebar = ({
  projects = [],
  selectedProjectId = "1",
  onProjectSelect = () => {},
  onNewProject = () => {},
  onImport = () => {},
  onSlideClick = () => {},
  onDeleteProject = () => {},
  onExportProject = () => {},
}: ProjectSidebarProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProjects, setExpandedProjects] = useState<string[]>(["1"]);
  const [projectToDelete, setProjectToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleImport = async (file: File) => {
    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const scriptTag = doc.getElementById("tempo-project-data");
    if (scriptTag) {
      try {
        const projectData = JSON.parse(scriptTag.textContent || "{}");
        if (projectData.metadata?.name && projectData.content?.steps) {
          onImport({
            name: projectData.metadata.name,
            steps: projectData.content.steps,
          });
        }
      } catch (e) {
        console.error("Failed to parse project data:", e);
      }
    }
  };

  const toggleProjectExpand = (id: string) => {
    setExpandedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  return (
    <div className="w-80 h-full border-r bg-background flex flex-col flex-nowrap">
      <div className="p-4 space-y-4">
        <div className="flex flex-col space-y-2">
          <Button onClick={onNewProject} className="w-full justify-start gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".html"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
            }}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full justify-start gap-2"
          >
            <FolderOpen className="h-4 w-4" />
            Import Project
          </Button>
        </div>

        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {projects
            .filter((project) =>
              project.name.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .map((project) => (
              <Card
                key={project.id}
                className={`p-3 cursor-pointer transition-colors hover:bg-accent w-full overflow-hidden ${project.id === selectedProjectId ? "bg-accent" : ""}`}
                onClick={() => onProjectSelect(project.id)}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleProjectExpand(project.id);
                    }}
                    className="p-1 hover:bg-accent rounded flex-shrink-0"
                  >
                    {expandedProjects.includes(project.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-sm font-medium block truncate"
                      title={project.name}
                    >
                      {project.name || "Untitled Project"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {project.steps.length} slides
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onExportProject(project.id);
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjectToDelete({
                              id: project.id,
                              name: project.name,
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {expandedProjects.includes(project.id) && (
                  <div className="mt-2 ml-6">
                    <ScrollArea
                      className="w-full pr-4"
                      style={{
                        height: Math.min(300, project.steps.length * 32 + 16),
                      }}
                    >
                      <div className="space-y-1 w-full">
                        {project.steps.map((step, index) => (
                          <div
                            key={step.id}
                            className="flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground hover:text-foreground rounded hover:bg-accent/50 cursor-pointer w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSlideClick(step.id);
                            }}
                          >
                            <div className="w-4 h-4 flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                            <span className="truncate flex-1">
                              {step.fields.find((f) => f.type === "title")
                                ?.content || "Untitled Step"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </Card>
            ))}
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Application</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset the application to its default state. All your
                projects and changes will be lost. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={() => {
                  useProjectStore.getState().resetToDefault();
                  window.location.reload();
                }}
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={() => setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project "{projectToDelete?.name}
              ". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (projectToDelete) {
                  onDeleteProject(projectToDelete.id);
                  setProjectToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectSidebar;
