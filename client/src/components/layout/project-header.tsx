import { Button } from "@/components/ui/button";
import { History, Share, Download, Circle } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground" data-testid="text-project-header-title">
              {project.title}
            </h1>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-sm text-muted-foreground" data-testid="text-project-header-version">
                Version {project.version}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground" data-testid="text-project-header-saved">
                Last saved: 2 minutes ago
              </span>
              <div className="flex items-center text-sm text-secondary">
                <Circle className="text-xs mr-1 h-2 w-2 fill-current" />
                Auto-saved
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="text-foreground border-border hover:bg-muted"
            data-testid="button-version-history"
          >
            <History className="mr-2 h-4 w-4" />
            Version History
          </Button>
          <Button 
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            data-testid="button-share"
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-generate-frs"
          >
            <Download className="mr-2 h-4 w-4" />
            Generate FRS
          </Button>
        </div>
      </div>
    </header>
  );
}
