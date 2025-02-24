import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { GripVertical, Trash2, Upload, Type, Globe, X } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { StepField } from "@/lib/types";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

interface StepContainerProps {
  id: string;
  fields: StepField[];
  onDelete?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onFieldsChange?: (fields: StepField[]) => void;
  onFieldDelete?: (fieldId: string) => void;
  onAddField?: (type: StepField["type"], content?: string) => void;
}

const StepContainer = React.forwardRef<HTMLDivElement, StepContainerProps>(
  (
    {
      id,
      fields = [],
      onFieldsChange = () => {},
      onFieldDelete = () => {},
      onAddField = () => {},
      onDelete = () => {},
      onDragStart = () => {},
      onDragEnd = () => {},
      onDrop = () => {},
      onDragOver = () => {},
    },
    ref,
  ) => {
    const [containerWidth, setContainerWidth] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const updateWidth = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth - 32); // Subtract padding
        }
      };

      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }, []);

    return (
      <Card
        ref={(el) => {
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
          containerRef.current = el;
        }}
        className="w-full max-w-full p-4 mb-4 bg-white border shadow-sm scroll-mt-24 overflow-hidden"
        onDrop={onDrop}
        onDragOver={onDragOver}
        id={`slide-${id}`}
      >
        <div className="flex items-start gap-4">
          <div
            className="cursor-move"
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <GripVertical className="h-6 w-6 text-gray-400" />
          </div>

          <div className="flex-1 min-w-0">
            {fields.map((field, index) => (
              <div key={field.id} className="relative mb-4 group">
                {field.type === "title" && (
                  <Textarea
                    placeholder="Slide Title"
                    className="text-xl font-semibold bg-transparent border-none hover:bg-gray-50 transition-colors w-full"
                    value={field.content}
                    onChange={(e) => {
                      const updatedFields = [...fields];
                      updatedFields[index] = {
                        ...field,
                        content: e.target.value,
                      };
                      onFieldsChange(updatedFields);
                    }}
                  />
                )}

                {field.type === "text" && (
                  <Textarea
                    placeholder="Enter text..."
                    className="w-full min-h-[100px] bg-transparent border-none hover:bg-gray-50 transition-colors"
                    value={field.content}
                    onChange={(e) => {
                      const updatedFields = [...fields];
                      updatedFields[index] = {
                        ...field,
                        content: e.target.value,
                      };
                      onFieldsChange(updatedFields);
                    }}
                  />
                )}

                {field.type === "image" && (
                  <ResizableBox
                    width={field.width || containerWidth}
                    height={field.height || 400}
                    maxConstraints={[containerWidth, 1200]}
                    onResize={(e, { size }) => {
                      const updatedFields = [...fields];
                      updatedFields[index] = {
                        ...field,
                        width: Math.min(size.width, containerWidth),
                        height: size.height,
                      };
                      onFieldsChange(updatedFields);
                    }}
                    resizeHandles={["se"]}
                  >
                    <img
                      src={field.content}
                      alt="Step illustration"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </ResizableBox>
                )}

                {field.type === "video" && (
                  <ResizableBox
                    width={field.width || containerWidth}
                    height={field.height || 450}
                    maxConstraints={[containerWidth, 1200]}
                    onResize={(e, { size }) => {
                      const updatedFields = [...fields];
                      updatedFields[index] = {
                        ...field,
                        width: Math.min(size.width, containerWidth),
                        height: size.height,
                      };
                      onFieldsChange(updatedFields);
                    }}
                    resizeHandles={["se"]}
                  >
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0">
                        <video
                          src={field.content}
                          controls
                          className="w-full h-full rounded-lg pointer-events-none"
                        />
                      </div>
                    </div>
                  </ResizableBox>
                )}

                {field.type === "iframe" && (
                  <ResizableBox
                    width={field.width || containerWidth}
                    height={field.height || 450}
                    maxConstraints={[containerWidth, 1200]}
                    onResize={(e, { size }) => {
                      const updatedFields = [...fields];
                      updatedFields[index] = {
                        ...field,
                        width: Math.min(size.width, containerWidth),
                        height: size.height,
                      };
                      onFieldsChange(updatedFields);
                    }}
                    resizeHandles={["se"]}
                  >
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0">
                        <iframe
                          src={field.content}
                          className="w-full h-full rounded-lg pointer-events-none"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; serial"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </ResizableBox>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onFieldDelete(field.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => onAddField("text")}
                >
                  <Type className="h-4 w-4" />
                  Add Text
                </Button>
                <input
                  type="file"
                  accept="image/*,video/*,audio/*"
                  className="hidden"
                  id={`media-upload-${id}`}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const result = event.target?.result as string;
                        if (file.type.startsWith("image/")) {
                          onAddField("image", result);
                        } else if (file.type.startsWith("video/")) {
                          onAddField("video", result);
                        } else if (file.type.startsWith("audio/")) {
                          // Create an audio element wrapped in a div
                          onAddField("iframe", result, {
                            width: 400, // Default width for audio player
                            height: 50, // Default height for audio player
                          });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() =>
                    document.getElementById(`media-upload-${id}`)?.click()
                  }
                >
                  <Upload className="h-4 w-4" />
                  Encode Media
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={async () => {
                    const url = prompt(
                      "Enter link URL (YouTube, direct link, etc):",
                    );
                    if (url) {
                      let embedUrl = url;

                      // Handle known video platforms first
                      if (url.includes("youtube.com/watch?v=")) {
                        const videoId = url.split("v=")[1].split("&")[0];
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                        onAddField("iframe", embedUrl);
                        return;
                      } else if (url.includes("youtu.be/")) {
                        const videoId = url.split("youtu.be/")[1].split("?")[0];
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                        onAddField("iframe", embedUrl);
                        return;
                      } else if (url.includes("vimeo.com/")) {
                        const videoId = url
                          .split("vimeo.com/")[1]
                          .split("?")[0];
                        embedUrl = `https://player.vimeo.com/video/${videoId}`;
                        onAddField("iframe", embedUrl);
                        return;
                      }

                      // For other URLs, try to detect content type
                      try {
                        const response = await fetch(url, { method: "HEAD" });
                        const contentType =
                          response.headers.get("Content-Type");

                        if (contentType) {
                          if (contentType.startsWith("image/")) {
                            onAddField("image", url);
                          } else if (contentType.startsWith("video/")) {
                            onAddField("video", url);
                          } else if (contentType.startsWith("audio/")) {
                            // Create an audio element wrapped in a div
                            const audioHtml = `<div class="w-full flex justify-center"><audio controls src="${url}"></audio></div>`;
                            onAddField("iframe", url);
                          } else {
                            // Default to iframe for other content types
                            onAddField("iframe", url);
                          }
                        } else {
                          // If no content type, default to iframe
                          onAddField("iframe", url);
                        }
                      } catch (error) {
                        console.error("Error checking content type:", error);
                        // If request fails, default to iframe
                        onAddField("iframe", url);
                      }
                    }
                  }}
                >
                  <Globe className="h-4 w-4" />
                  Embed Media
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  },
);

StepContainer.displayName = "StepContainer";

export default StepContainer;
