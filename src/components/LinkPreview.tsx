import React from "react";
import { Globe } from "lucide-react";

const LinkPreview = ({ url, width = 800, height = 200 }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-lg border bg-card hover:bg-accent/50 transition-colors"
      style={{ width, height }}
    >
      <div className="flex items-center gap-3 p-4 h-full">
        <Globe className="h-6 w-6 flex-shrink-0 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{url}</div>
          <div className="text-sm text-muted-foreground truncate">
            Click to open link
          </div>
        </div>
      </div>
    </a>
  );
};

export default LinkPreview;
