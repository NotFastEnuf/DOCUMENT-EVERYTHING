import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  GripVertical,
  Trash2,
  Upload,
  Type,
  Globe,
  X,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Textarea } from "./ui/textarea";
import { StepField } from "@/lib/types";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import LinkPreview from "./LinkPreview";

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
  onAddField?: (
    type: StepField["type"],
    content?: string,
    options?: { width?: number; height?: number },
  ) => void;
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
                          className="w-full h-full rounded-lg"
                        />
                      </div>
                    </div>
                  </ResizableBox>
                )}

                {(field.type === "iframe" || field.type === "link-preview") && (
                  <ResizableBox
                    width={field.width || containerWidth}
                    height={
                      field.height ||
                      (field.type === "link-preview" ? 200 : 450)
                    }
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
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 left-2 z-10 bg-white/80 hover:bg-white/90 transition-colors rounded-full w-8 h-8"
                        onClick={() => {
                          const updatedFields = [...fields];
                          updatedFields[index] = {
                            ...field,
                            type:
                              field.type === "iframe"
                                ? "link-preview"
                                : "iframe",
                            height: field.type === "iframe" ? 200 : 450,
                          };
                          onFieldsChange(updatedFields);
                        }}
                        title={
                          field.type === "iframe"
                            ? "Switch to link preview"
                            : "Switch to iframe"
                        }
                      >
                        {field.type === "iframe" ? (
                          <ToggleLeft className="h-4 w-4" />
                        ) : (
                          <ToggleRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="absolute inset-0">
                        {field.type === "iframe" ? (
                          field.content.startsWith("data:application/pdf") ? (
                            <object
                              data={field.content}
                              type="application/pdf"
                              className="w-full h-full rounded-lg"
                            >
                              <p>PDF cannot be displayed</p>
                            </object>
                          ) : field.content.startsWith("data:audio/") ? (
                            <audio
                              controls
                              src={field.content}
                              className="w-full rounded-lg"
                            />
                          ) : (
                            <iframe
                              src={field.content}
                              className="w-full h-full rounded-lg"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; serial"
                              allowFullScreen
                            />
                          )
                        ) : (
                          <LinkPreview
                            url={field.content}
                            width={field.width}
                            height={field.height}
                          />
                        )}
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
                  accept="image/*,video/*,audio/*,application/pdf"
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
                          onAddField("iframe", result, {
                            width: 400, // Default width for audio player
                            height: 50, // Default height for audio player
                          });
                        } else if (file.type === "application/pdf") {
                          onAddField("iframe", result, {
                            width: 800, // Default width for PDF viewer
                            height: 600, // Default height for PDF viewer
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

                      // For other URLs, try to detect content type and check iframe compatibility
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
                            onAddField("iframe", url, {
                              width: 400,
                              height: 50,
                            });
                          } else if (contentType === "application/pdf") {
                            onAddField("iframe", url, {
                              width: 800,
                              height: 600,
                            });
                          } else {
                            // Try to check if URL can be embedded in iframe
                            try {
                              const canEmbed = await fetch(url)
                                .then((res) => {
                                  const xFrameOptions =
                                    res.headers.get("X-Frame-Options");
                                  return (
                                    !xFrameOptions ||
                                    (!xFrameOptions.includes("DENY") &&
                                      !xFrameOptions.includes("SAMEORIGIN"))
                                  );
                                })
                                .catch(() => false);

                              if (canEmbed) {
                                onAddField("iframe", url);
                              } else {
                                // Use link preview instead
                                onAddField("link-preview", url, {
                                  width: 800,
                                  height: 200,
                                });
                              }
                            } catch (error) {
                              // Default to link preview if iframe check fails
                              onAddField("link-preview", url, {
                                width: 800,
                                height: 200,
                              });
                            }
                          }
                        } else {
                          // If no content type, try link preview
                          onAddField("link-preview", url, {
                            width: 800,
                            height: 200,
                          });
                        }
                      } catch (error) {
                        console.error("Error checking content type:", error);
                        // If request fails, use link preview
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
