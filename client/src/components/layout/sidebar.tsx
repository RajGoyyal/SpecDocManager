import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Search, Plus, Settings } from "lucide-react";
import type { Project } from "@shared/schema";

export default function Sidebar() {
  const [location] = useLocation();
  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-secondary text-secondary-foreground';
      case 'completed': return 'bg-primary text-primary-foreground';
      case 'review': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const isActiveProject = (projectId: string) => {
    return location.includes(`/project/${projectId}`);
  };

  return (
    <aside className="w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <Link href="/">
          <h1 className="text-xl font-semibold text-foreground cursor-pointer hover:text-primary transition-colors" data-testid="link-home">
            <FileText className="text-primary mr-2 inline h-5 w-5" />
            FRS Manager
          </h1>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">Requirements Management System</p>
      </div>

      {/* Project Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm" />
          <Input 
            type="text" 
            placeholder="Search projects..." 
            className="pl-10"
            data-testid="input-search-sidebar"
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Recent Projects</h3>
            <Link href="/project/new">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" data-testid="button-add-project">
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-2">
            {projects?.map((project) => (
              <Link key={project.id} href={`/project/${project.id}`}>
                <div 
                  className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                    isActiveProject(project.id) 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'border-transparent hover:bg-muted/50 hover:border-border'
                  }`}
                  data-testid={`link-project-${project.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground text-sm" data-testid={`text-sidebar-project-title-${project.id}`}>
                      {project.title}
                    </h4>
                    <Badge className={`text-xs ${getStatusColor(project.status)}`} data-testid={`badge-sidebar-status-${project.id}`}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Last modified: {new Date(project.updatedAt || 0).toLocaleDateString()}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <span className="mr-4" data-testid={`text-sidebar-version-${project.id}`}>{project.version}</span>
                    <span className="mr-4">45 requirements</span>
                    <span>12 high priority</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground">73%</span>
                    </div>
                    <Progress value={73} className="h-1.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40" 
            alt="User avatar" 
            className="w-8 h-8 rounded-full"
            data-testid="img-user-avatar"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground" data-testid="text-user-name">John Smith</p>
            <p className="text-xs text-muted-foreground" data-testid="text-user-role">Product Manager</p>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" data-testid="button-settings">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
