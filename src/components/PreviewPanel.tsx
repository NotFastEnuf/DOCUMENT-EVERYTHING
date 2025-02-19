import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Eye, Download, X } from "lucide-react";

interface PreviewPanelProps {
  html?: string;
  onClose?: () => void;
}

const PreviewPanel = ({
  html = "<div><h1>Sample Project Documentation</h1><p>This is a preview of your documentation. Add steps to see them rendered here.</p></div>",
  onClose = () => {},
}: PreviewPanelProps) => {
  const [scale, setScale] = useState(1);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <Card className="w-full h-full max-w-6xl mx-auto my-4 p-4 bg-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Eye className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Documentation Preview</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
              >
                -
              </Button>
              <span className="min-w-[4rem] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale((prev) => Math.min(2, prev + 0.1))}
              >
                +
              </Button>
            </div>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                const htmlContent = `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="UTF-8">
                      <title>Project Documentation</title>
                      <script src="https://cdn.tailwindcss.com"></script>
                      <style>
                        /* Base styles */
                        body { margin: 0; padding: 20px; font-family: system-ui, sans-serif; }
                        .prose { max-width: 8.5in; margin: auto; }
                        img, video { max-width: 100%; height: auto; border-radius: 0.5rem; }
                      </style>
                      <script type="application/json" id="tempo-project-data">
                        ${html.includes("<!-- TEMPO_PROJECT_DATA -->") ? html.split("<!-- TEMPO_PROJECT_DATA -->")[1]?.split("<!-- END_TEMPO_PROJECT_DATA -->")[0] : "{}"}
                      </script>
                    </head>
                    <body>
                      <div class="prose">
                        ${html.includes("<!-- TEMPO_PROJECT_DATA -->") ? html.split("<!-- TEMPO_PROJECT_DATA -->")[0] : html}
                      </div>
                    </body>
                  </html>
                `;
                const blob = new Blob([htmlContent], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                const projectName = html.includes("<!-- TEMPO_PROJECT_DATA -->")
                  ? JSON.parse(
                      html
                        .split("<!-- TEMPO_PROJECT_DATA -->")[1]
                        ?.split("<!-- END_TEMPO_PROJECT_DATA -->")[0],
                    )?.metadata?.name || "untitled-project"
                  : "untitled-project";
                a.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="w-4 h-4" />
              Export HTML
            </Button>

            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)] w-full rounded-md border">
          <div
            className="min-h-full w-full p-8 bg-white"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <div
              className="prose max-w-[8.5in] mx-auto"
              dangerouslySetInnerHTML={{
                __html: html.includes("<!-- TEMPO_PROJECT_DATA -->")
                  ? html.split("<!-- TEMPO_PROJECT_DATA -->")[0]
                  : html,
              }}
            />
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default PreviewPanel;
