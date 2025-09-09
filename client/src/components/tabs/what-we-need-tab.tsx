import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAutoSave } from "@/hooks/use-auto-save";
import { apiRequest } from "@/lib/queryClient";
import { Target, Telescope, AlertTriangle, Link, Database, Globe, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { insertProjectRequirementsSchema } from "@shared/schema";
import type { ProjectRequirements } from "@shared/schema";
import { z } from "zod";
import { useState } from "react";

interface WhatWeNeedTabProps {
  projectId: string;
}

const formSchema = insertProjectRequirementsSchema.extend({
  scopeIncluded: z.array(z.string()).optional(),
  scopeExcluded: z.array(z.string()).optional(),
  assumptions: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  externalServices: z.array(z.string()).optional(),
});

export default function WhatWeNeedTab({ projectId }: WhatWeNeedTabProps) {
  const queryClient = useQueryClient();
  const [newScopeIncluded, setNewScopeIncluded] = useState("");
  const [newScopeExcluded, setNewScopeExcluded] = useState("");
  const [newAssumption, setNewAssumption] = useState("");
  const [newDependency, setNewDependency] = useState("");
  const [newExternalService, setNewExternalService] = useState("");

  const { data: requirements } = useQuery<ProjectRequirements>({
    queryKey: ['/api/projects', projectId, 'requirements'],
  });

  const form = useForm({
    resolver: zodResolver(formSchema.partial()),
    defaultValues: {
      userExperienceGoals: requirements?.userExperienceGoals || "",
      scopeIncluded: requirements?.scopeIncluded || [],
      scopeExcluded: requirements?.scopeExcluded || [],
      assumptions: requirements?.assumptions || [],
      dependencies: requirements?.dependencies || [],
      dataIntegrationNeeds: requirements?.dataIntegrationNeeds || "",
      externalServices: requirements?.externalServices || [],
    },
  });

  const watchedValues = form.watch();

  useAutoSave(form.watch, async (data) => {
    if (Object.keys(data).length > 0) {
      await updateRequirements.mutateAsync(data);
    }
  });

  const updateRequirements = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', `/api/projects/${projectId}/requirements`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'requirements'] });
    },
  });

  const addToArray = (field: keyof typeof watchedValues, newValue: string, setter: (value: string) => void) => {
    if (newValue.trim()) {
      const currentArray = (watchedValues[field] as string[]) || [];
      form.setValue(field, [...currentArray, newValue.trim()]);
      setter("");
    }
  };

  const removeFromArray = (field: keyof typeof watchedValues, index: number) => {
    const currentArray = (watchedValues[field] as string[]) || [];
    form.setValue(field, currentArray.filter((_, i) => i !== index));
  };

  const ArrayInput = ({ 
    field, 
    label, 
    placeholder, 
    newValue, 
    setNewValue, 
    icon: Icon,
    testId 
  }: {
    field: keyof typeof watchedValues;
    label: string;
    placeholder: string;
    newValue: string;
    setNewValue: (value: string) => void;
    icon: any;
    testId: string;
  }) => (
    <div>
      <FormLabel className="flex items-center mb-2">
        <Icon className="text-primary mr-2 h-4 w-4" />
        {label}
      </FormLabel>
      
      <div className="space-y-2">
        {((watchedValues[field] as string[]) || []).map((item, index) => (
          <div key={index} className="flex items-center space-x-2 p-2 bg-muted/30 rounded" data-testid={`${testId}-item-${index}`}>
            <span className="flex-1 text-sm text-foreground">{item}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-accent"
              onClick={() => removeFromArray(field, index)}
              data-testid={`${testId}-remove-${index}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex space-x-2 mt-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addToArray(field, newValue, setNewValue);
            }
          }}
          data-testid={`${testId}-input`}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => addToArray(field, newValue, setNewValue)}
          data-testid={`${testId}-add`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl">
      
      {/* Tab Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">What We Need</h2>
        <p className="text-muted-foreground">Define user experience goals, project scope, and key requirements.</p>
      </div>

      <Form {...form}>
        <form className="space-y-8">
          
          {/* User Experience Goals */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <Target className="text-primary mr-2 h-5 w-5" />
                User Experience Goals
              </h3>
              
              <FormField
                control={form.control}
                name="userExperienceGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What experience do we want to create for users?</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={4} 
                        placeholder="Describe the desired user experience, key user journeys, and success metrics..."
                        {...field}
                        data-testid="textarea-user-experience-goals"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Project Telescope */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <Telescope className="text-primary mr-2 h-5 w-5" />
                Project Telescope
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ArrayInput
                  field="scopeIncluded"
                  label="What's Included"
                  placeholder="Add a feature or requirement that's included..."
                  newValue={newScopeIncluded}
                  setNewValue={setNewScopeIncluded}
                  icon={Target}
                  testId="scope-included"
                />
                
                <ArrayInput
                  field="scopeExcluded"
                  label="What's Excluded"
                  placeholder="Add a feature or requirement that's excluded..."
                  newValue={newScopeExcluded}
                  setNewValue={setNewScopeExcluded}
                  icon={X}
                  testId="scope-excluded"
                />
              </div>
            </CardContent>
          </Card>

          {/* Assumptions & Dependencies */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <AlertTriangle className="text-primary mr-2 h-5 w-5" />
                Assumptions & Dependencies
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ArrayInput
                  field="assumptions"
                  label="Project Assumptions"
                  placeholder="Add an assumption about the project..."
                  newValue={newAssumption}
                  setNewValue={setNewAssumption}
                  icon={AlertTriangle}
                  testId="assumptions"
                />
                
                <ArrayInput
                  field="dependencies"
                  label="External Dependencies"
                  placeholder="Add a dependency on external systems or teams..."
                  newValue={newDependency}
                  setNewValue={setNewDependency}
                  icon={Link}
                  testId="dependencies"
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Integration */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <Database className="text-primary mr-2 h-5 w-5" />
                Data Integration
              </h3>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="dataIntegrationNeeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Integration Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={4} 
                          placeholder="Describe data sources, migration needs, synchronization requirements..."
                          {...field}
                          data-testid="textarea-data-integration"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ArrayInput
                  field="externalServices"
                  label="External Services & APIs"
                  placeholder="Add an external service or API integration..."
                  newValue={newExternalService}
                  setNewValue={setNewExternalService}
                  icon={Globe}
                  testId="external-services"
                />
              </div>
            </CardContent>
          </Card>

        </form>
      </Form>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t border-border">
        <Button variant="outline" className="text-foreground border-border hover:bg-muted" data-testid="button-previous-tab">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous: Basic Info
        </Button>
        
        <div className="text-sm text-muted-foreground" data-testid="text-tab-indicator">
          Tab 2 of 6: What We Need
        </div>
        
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-next-tab">
          Next: Data Fields
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
    </div>
  );
}
