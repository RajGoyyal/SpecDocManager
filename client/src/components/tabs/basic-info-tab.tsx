import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAutoSave } from "@/hooks/use-auto-save";
import { apiRequest } from "@/lib/queryClient";
import { ChartGantt, Users, Calendar, Plus, X, Flag, ChevronLeft, ChevronRight } from "lucide-react";
import StakeholderForm from "@/components/forms/stakeholder-form";
import { insertProjectSchema } from "@shared/schema";
import type { Project, Stakeholder, Milestone } from "@shared/schema";
import { useEffect } from "react";

interface BasicInfoTabProps {
  projectId: string;
}

export default function BasicInfoTab({ projectId }: BasicInfoTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  const { data: stakeholders } = useQuery<Stakeholder[]>({
    queryKey: ['/api/projects', projectId, 'stakeholders'],
  });

  const { data: milestones } = useQuery<Milestone[]>({
    queryKey: ['/api/projects', projectId, 'milestones'],
  });

  const form = useForm({
    resolver: zodResolver(insertProjectSchema.partial()),
    defaultValues: {
      title: project?.title || "",
      version: project?.version || "",
      description: project?.description || "",
      author: project?.author || "",
      startDate: project?.startDate || "",
      expectedCompletion: project?.expectedCompletion || "",
    },
  });

  // Update form when project data loads
  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title || "",
        version: project.version || "",
        description: project.description || "",
        author: project.author || "",
        startDate: project.startDate || "",
        expectedCompletion: project.expectedCompletion || "",
      });
    }
  }, [project, form]);

  useAutoSave(form.watch, async (data) => {
    if (Object.keys(data).length > 0) {
      await updateProject.mutateAsync(data);
    }
  });

  const updateProject = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('PATCH', `/api/projects/${projectId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId] });
    },
  });

  const deleteStakeholder = useMutation({
    mutationFn: async (stakeholderId: string) => {
      return apiRequest('DELETE', `/api/stakeholders/${stakeholderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'stakeholders'] });
      toast({ title: "Stakeholder removed successfully" });
    },
  });

  const getStakeholderTypeColor = (type: string) => {
    switch (type) {
      case 'primary': return 'bg-primary text-primary-foreground';
      case 'secondary': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-secondary text-secondary-foreground';
      case 'in-progress': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getMilestoneIcon = (status: string) => {
    return <Flag className={status === 'completed' ? 'text-secondary' : status === 'in-progress' ? 'text-accent' : 'text-muted-foreground'} />;
  };

  return (
    <div className="p-8 max-w-4xl">
      
      {/* Tab Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">Basic Information</h2>
        <p className="text-muted-foreground">Essential project details and stakeholder information.</p>
      </div>

      <Form {...form}>
        <form className="space-y-8">
          
          {/* Project Overview */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <ChartGantt className="text-primary mr-2 h-5 w-5" />
                Project Overview
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-project-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-project-version" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-start-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-project-author" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={4} 
                          placeholder="Describe the project's purpose, goals, and key objectives..."
                          {...field}
                          data-testid="textarea-project-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Stakeholders Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <Users className="text-primary mr-2 h-5 w-5" />
                Stakeholders
              </h3>
              
              <div className="space-y-4">
                {stakeholders?.map((stakeholder) => (
                  <div key={stakeholder.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg" data-testid={`stakeholder-${stakeholder.id}`}>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={stakeholder.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"} 
                        alt="Stakeholder avatar" 
                        className="w-8 h-8 rounded-full"
                        data-testid={`img-stakeholder-avatar-${stakeholder.id}`}
                      />
                      <div>
                        <p className="font-medium text-foreground" data-testid={`text-stakeholder-name-${stakeholder.id}`}>{stakeholder.name}</p>
                        <p className="text-sm text-muted-foreground" data-testid={`text-stakeholder-role-${stakeholder.id}`}>{stakeholder.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStakeholderTypeColor(stakeholder.type)} data-testid={`badge-stakeholder-type-${stakeholder.id}`}>
                        {stakeholder.type}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-accent"
                        onClick={() => deleteStakeholder.mutate(stakeholder.id)}
                        data-testid={`button-delete-stakeholder-${stakeholder.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <StakeholderForm projectId={projectId} />
            </CardContent>
          </Card>

          {/* Project Timeline */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <Calendar className="text-primary mr-2 h-5 w-5" />
                Timeline & Milestones
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-timeline-start-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expectedCompletion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Completion</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-expected-completion" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel>Key Milestones</FormLabel>
                <div className="space-y-3 mt-2">
                  {milestones?.map((milestone) => (
                    <div key={milestone.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg" data-testid={`milestone-${milestone.id}`}>
                      {getMilestoneIcon(milestone.status)}
                      <div className="flex-1">
                        <p className="font-medium text-foreground" data-testid={`text-milestone-title-${milestone.id}`}>{milestone.title}</p>
                        <p className="text-sm text-muted-foreground" data-testid={`text-milestone-date-${milestone.id}`}>{milestone.date}</p>
                      </div>
                      <Badge className={getMilestoneStatusColor(milestone.status)} data-testid={`badge-milestone-status-${milestone.id}`}>
                        {milestone.status}
                      </Badge>
                    </div>
                  ))}
                  
                  {!milestones?.length && (
                    <div className="text-sm text-muted-foreground">No milestones defined</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

        </form>
      </Form>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t border-border">
        <Button disabled variant="outline" className="cursor-not-allowed" data-testid="button-previous-tab">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <div className="text-sm text-muted-foreground" data-testid="text-tab-indicator">
          Tab 1 of 6: Basic Info
        </div>
        
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-next-tab">
          Next: What We Need
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
    </div>
  );
}
