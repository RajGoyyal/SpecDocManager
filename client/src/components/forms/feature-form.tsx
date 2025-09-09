import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertFeatureSchema } from "@shared/schema";
import type { Feature } from "@shared/schema";

interface FeatureFormProps {
  projectId: string;
  editingFeature?: Feature | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function FeatureForm({ projectId, editingFeature, onCancel, onSuccess }: FeatureFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertFeatureSchema.omit({ projectId: true })),
    defaultValues: {
      title: editingFeature?.title || "",
      description: editingFeature?.description || "",
      priority: editingFeature?.priority || "medium",
      type: editingFeature?.type || "functional",
      specifications: editingFeature?.specifications || "",
    },
  });

  const createFeature = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = editingFeature 
        ? `/api/features/${editingFeature.id}`
        : `/api/projects/${projectId}/features`;
      const method = editingFeature ? 'PATCH' : 'POST';
      
      return apiRequest(method, endpoint, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'features'] });
      toast({ 
        title: editingFeature ? "Feature updated successfully" : "Feature created successfully" 
      });
      onSuccess();
    },
    onError: () => {
      toast({ 
        title: editingFeature ? "Failed to update feature" : "Failed to create feature", 
        description: "Please try again.",
        variant: "destructive" 
      });
    },
  });

  const onSubmit = (data: any) => {
    createFeature.mutate(data);
  };

  return (
    <div>
      <h4 className="font-medium text-foreground mb-4">
        {editingFeature ? "Edit Feature" : "Create New Feature"}
      </h4>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Feature Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feature Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter feature title..." {...field} data-testid="input-feature-title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Feature Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={4}
                    placeholder="Describe the feature requirements, user stories, and functionality..."
                    {...field} 
                    data-testid="textarea-feature-description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Priority and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-feature-priority">
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirement Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-feature-type">
                        <SelectValue placeholder="Select requirement type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="functional">Functional</SelectItem>
                      <SelectItem value="non-functional">Non-Functional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Detailed Specifications */}
          <FormField
            control={form.control}
            name="specifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detailed Specifications</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={6}
                    placeholder="Provide detailed technical specifications, acceptance criteria, edge cases, and implementation notes..."
                    {...field} 
                    data-testid="textarea-feature-specifications"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t border-border">
            <Button 
              type="submit" 
              disabled={createFeature.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-save-feature"
            >
              {createFeature.isPending ? "Saving..." : (editingFeature ? "Update Feature" : "Create Feature")}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
              data-testid="button-cancel-feature"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
