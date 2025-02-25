import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Plus, Eye } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import StepContainer from "./StepContainer";
import PreviewPanel from "./PreviewPanel";
import { Step } from "@/lib/types";

interface StepEditorProps {
  steps?: Step[];
  projectName?: string;
  onStepsChange?: (steps: Step[]) => void;
  onSlideClick?: (slideId: string) => void;
  onProjectNameChange?: (name: string) => void;
}

const StepEditor = ({
  steps: initialSteps = [
    {
      id: "1",
      fields: [
        {
          id: "f1",
          type: "title",
          content: "Getting Started",
        },
        {
          id: "f2",
          type: "text",
          content:
            "Create and maintain detailed project documentation, step-by-step instructions, or interactive slide shows as HTML.",
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
  ],
  projectName = "",
  onStepsChange = () => {},
  onSlideClick = () => {},
  onProjectNameChange = () => {},
}: StepEditorProps) => {
  const steps = initialSteps;
  const [showPreview, setShowPreview] = useState(false);
  const [draggedStep, setDraggedStep] = useState<number | null>(null);
  const stepRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const addStep = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      fields: [
        {
          id: `f${Date.now()}-1`,
          type: "title" as const,
          content: "",
        },
        {
          id: `f${Date.now()}-2`,
          type: "text" as const,
          content: "",
        },
      ],
    };
    const updatedSteps = [...steps, newStep];
    onStepsChange(updatedSteps);

    // Scroll to the new step and the add button
    setTimeout(() => {
      const newStepEl = stepRefs.current[newStep.id];
      if (newStepEl) {
        newStepEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const deleteStep = (index: number) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    onStepsChange(updatedSteps);
  };

  const handleDragStart = (index: number) => {
    setDraggedStep(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedStep === null) return;

    const updatedSteps = [...steps];
    const [draggedItem] = updatedSteps.splice(draggedStep, 1);
    updatedSteps.splice(dropIndex, 0, draggedItem);

    onStepsChange(updatedSteps);
    setDraggedStep(null);
  };

  const generatePreviewHtml = () => {
    const projectData = {
      version: "1.0",
      metadata: {
        name: projectName || "Untitled Project",
        updatedAt: new Date().toISOString(),
      },
      content: {
        steps,
      },
    };

    const contentHtml = `
      <div class="max-w-[8.5in] mx-auto">
        <h1 class="text-3xl font-bold mb-8">${projectName || "Untitled Project"}</h1>
        ${steps
          .map(
            (step, index) => `
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
                      `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">${url}</a>`,
                  );
                  return `<p class="mb-4 whitespace-pre-wrap">${contentWithLinks}</p>`;
                } else if (field.type === "image") {
                  return `<img src="${field.content}" alt="Step ${index + 1}" class="rounded-lg mb-4" style="max-width: 100%; width: ${field.width}px; height: ${field.height}px; object-fit: cover;">`;
                } else if (field.type === "video") {
                  return `<video src="${field.content}" controls class="rounded-lg mb-4" style="max-width: 100%; width: ${field.width || 800}px; height: ${field.height || 450}px;"></video>`;
                } else if (field.type === "iframe") {
                  return `<iframe src="${field.content}" frameborder="0" allow="serial; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="rounded-lg mb-4" style="max-width: 100%; width: ${field.width || 800}px; height: ${field.height || 450}px;"></iframe>`;
                } else if (field.type === "link-preview") {
                  return `<a href="${field.content}" target="_blank" rel="noopener noreferrer" class="block w-full rounded-lg border bg-white hover:bg-gray-50 transition-colors mb-4" style="width: ${field.width}px; height: ${field.height}px; text-decoration: none;">
                    <div class="flex items-center gap-3 p-4 h-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                      <div class="flex-1 min-w-0">
                        <div class="font-medium text-gray-900 truncate">${field.content}</div>
                        <div class="text-sm text-gray-500 truncate">Click to open link</div>
                      </div>
                    </div>
                  </a>`;
                }
                return "";
              })
              .join("")}
          </div>
        `,
          )
          .join("")}
      </div>
    `;
    const projectDataHtml = `<!-- TEMPO_PROJECT_DATA -->${JSON.stringify(projectData)}<!-- END_TEMPO_PROJECT_DATA -->`;
    return contentHtml + projectDataHtml;
  };

  return (
    <div className="h-full bg-gray-50">
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
            <div className="flex justify-between items-center mb-6">
              <textarea
                value={projectName}
                onChange={(e) => onProjectNameChange(e.target.value)}
                className="text-2xl font-bold bg-transparent border-none hover:bg-gray-50 transition-colors px-2 py-1 rounded w-[calc(100%-120px)] resize-none overflow-hidden"
                placeholder="Untitled Project"
                rows={1}
                style={{
                  height: "auto",
                  minHeight: "2.5rem",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <StepContainer
                  key={step.id}
                  ref={(el) => (stepRefs.current[step.id] = el)}
                  id={step.id}
                  fields={step.fields}
                  onFieldsChange={(fields) => {
                    const updatedSteps = [...steps];
                    updatedSteps[index] = { ...step, fields };
                    onStepsChange(updatedSteps);
                  }}
                  onFieldDelete={(fieldId) => {
                    const updatedSteps = [...steps];
                    updatedSteps[index] = {
                      ...step,
                      fields: step.fields.filter((f) => f.id !== fieldId),
                    };
                    onStepsChange(updatedSteps);
                  }}
                  onAddField={(type, content, options = {}) => {
                    const updatedSteps = [...steps];
                    updatedSteps[index] = {
                      ...step,
                      fields: [
                        ...step.fields,
                        {
                          id: `f${Date.now()}`,
                          type,
                          content: content || "",
                          width:
                            type === "iframe"
                              ? 800
                              : type === "video"
                                ? 800
                                : type === "image"
                                  ? 800
                                  : undefined,
                          height:
                            type === "iframe"
                              ? 450
                              : type === "video"
                                ? 450
                                : type === "image"
                                  ? 400
                                  : undefined,
                          ...options,
                        },
                      ],
                    };
                    onStepsChange(updatedSteps);
                  }}
                  onDelete={() => deleteStep(index)}
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={() => setDraggedStep(null)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                />
              ))}
              <Button className="flex items-center gap-2" onClick={addStep}>
                <Plus className="h-4 w-4" />
                Add Slide
              </Button>
            </div>

            {showPreview && (
              <PreviewPanel
                html={generatePreviewHtml()}
                onClose={() => setShowPreview(false)}
              />
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default StepEditor;
