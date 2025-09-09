import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Search, Plus, Clock, AlertCircle, CheckCircle, Eye } from "lucide-react";
import type { Project } from "@shared/schema";

export default function Dashboard() {
  const { data: projects, isLoading } = useQuery<Project[]>({
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'review': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground flex items-center">
              <FileText className="text-primary mr-3 h-8 w-8" />
              FRS Manager
            </h1>
            <p className="text-muted-foreground mt-1">Requirements Management System</p>
          </div>
          <Link href="/project/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-create-project">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search projects..." 
                className="pl-10" 
                data-testid="input-search-projects"
              />
            </div>
          </div>

          {/* Projects Grid */}
          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow" data-testid={`card-project-${project.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground text-lg" data-testid={`text-project-title-${project.id}`}>
                        {project.title}
                      </h3>
                      <Badge className={`${getStatusColor(project.status)} flex items-center gap-1`} data-testid={`badge-status-${project.id}`}>
                        {getStatusIcon(project.status)}
                        {project.status}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2" data-testid={`text-project-description-${project.id}`}>
                      {project.description || "No description available"}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Version</span>
                        <span className="font-medium text-foreground" data-testid={`text-version-${project.id}`}>{project.version}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Author</span>
                        <span className="font-medium text-foreground" data-testid={`text-author-${project.id}`}>{project.author}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Modified</span>
                        <span className="font-medium text-foreground" data-testid={`text-modified-${project.id}`}>
                          {new Date(project.updatedAt || 0).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Mock progress - in real app, calculate based on requirements completion */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">73%</span>
                        </div>
                        <Progress value={73} className="h-2" />
                      </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                      <Link href={`/project/${project.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" data-testid={`button-edit-${project.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="icon"
                        data-testid={`button-generate-frs-${project.id}`}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">Get started by creating your first requirements project.</p>
              <Link href="/project/new">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-create-first-project">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Project
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
