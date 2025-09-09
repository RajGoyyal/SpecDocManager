import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertStakeholderSchema } from "@shared/schema";
import { Plus } from "lucide-react";
import { useState } from "react";

interface StakeholderFormProps {
  projectId: string;
}

export default function StakeholderForm({ projectId }: StakeholderFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertStakeholderSchema.omit({ projectId: true })),
    defaultValues: {
      name: "",
      role: "",
      type: "secondary",
      avatar: "",
    },
  });

  const createStakeholder = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', `/api/projects/${projectId}/stakeholders`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'stakeholders'] });
      toast({ title: "Stakeholder added successfully" });
      form.reset();
      setShowForm(false);
    },
    onError: () => {
      toast({ 
        title: "Failed to add stakeholder", 
        description: "Please try again.",
        variant: "destructive" 
      });
    },
  });

  const onSubmit = (data: any) => {
    createStakeholder.mutate(data);
  };

  if (!showForm) {
    return (
      <Button 
        type="button"
        variant="outline"
        className="w-full border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        onClick={() => setShowForm(true)}
        data-testid="button-show-stakeholder-form"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Stakeholder
      </Button>
    );
  }

  return (
    <div className="mt-4 p-4 border border-border rounded-lg bg-muted/20">
      <h4 className="font-medium text-foreground mb-4">Add New Stakeholder</h4>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter stakeholder name" {...field} data-testid="input-stakeholder-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter role/title" {...field} data-testid="input-stakeholder-role" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-stakeholder-type">
                        <SelectValue placeholder="Select stakeholder type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="reviewer">Reviewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} data-testid="input-stakeholder-avatar" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              type="submit" 
              disabled={createStakeholder.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-save-stakeholder"
            >
              {createStakeholder.isPending ? "Adding..." : "Add Stakeholder"}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                form.reset();
                setShowForm(false);
              }}
              data-testid="button-cancel-stakeholder"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
