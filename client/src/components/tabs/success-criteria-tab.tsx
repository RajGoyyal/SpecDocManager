import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAutoSave } from "@/hooks/use-auto-save";
import { apiRequest } from "@/lib/queryClient";
import { Trophy, Target, Users, Database, Zap, Shield, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { insertProjectRequirementsSchema } from "@shared/schema";
import type { ProjectRequirements } from "@shared/schema";
import { z } from "zod";
import { useState } from "react";

interface SuccessCriteriaTabProps {
  projectId: string;
}

const formSchema = insertProjectRequirementsSchema.extend({
  successMetrics: z.array(z.string()).optional(),
  dataQualityRules: z.array(z.string()).optional(),
  performanceRequirements: z.array(z.string()).optional(),
  securityRequirements: z.array(z.string()).optional(),
});

export default function SuccessCriteriaTab({ projectId }: SuccessCriteriaTabProps) {
  const queryClient = useQueryClient();
  const [newSuccessMetric, setNewSuccessMetric] = useState("");
  const [newDataQualityRule, setNewDataQualityRule] = useState("");
  const [newPerformanceRequirement, setNewPerformanceRequirement] = useState("");
  const [newSecurityRequirement, setNewSecurityRequirement] = useState("");

  const { data: requirements } = useQuery<ProjectRequirements>({
    queryKey: ['/api/projects', projectId, 'requirements'],
  });

  const form = useForm({
    resolver: zodResolver(formSchema.partial()),
    defaultValues: {
      successMetrics: requirements?.successMetrics || [],
      userTestingPlans: requirements?.userTestingPlans || "",
      dataQualityRules: requirements?.dataQualityRules || [],
      performanceRequirements: requirements?.performanceRequirements || [],
      securityRequirements: requirements?.securityRequirements || [],
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
        <h2 className="text-xl font-semibold text-foreground mb-2">Success Criteria</h2>
        <p className="text-muted-foreground">Define success metrics, testing plans, and quality requirements.</p>
      </div>

      <Form {...form}>
        <form className="space-y-8">
          
          {/* Success Metrics */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <Trophy className="text-primary mr-2 h-5 w-5" />
                Success Metrics
              </h3>
              
              <ArrayInput
                field="successMetrics"
                label="Key Performance Indicators"
                placeholder="Add a success metric (e.g., 95% user satisfaction, <2s page load time)..."
                newValue={newSuccessMetric}
                setNewValue={setNewSuccessMetric}
                icon={Target}
                testId="success-metrics"
              />
            </CardContent>
          </Card>

          {/* User Testing Plans */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <Users className="text-primary mr-2 h-5 w-5" />
                User Testing & Validation
              </h3>
              
              <FormField
                control={form.control}
                name="userTestingPlans"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Testing Strategy & User Validation Plans</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={6} 
                        placeholder="Describe user testing approach, usability testing plans, A/B testing strategy, user feedback collection methods, acceptance criteria validation..."
                        {...field}
                        data-testid="textarea-user-testing-plans"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Data Quality Rules */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <Database className="text-primary mr-2 h-5 w-5" />
                Data Quality Standards
              </h3>
              
              <ArrayInput
                field="dataQualityRules"
                label="Data Quality Requirements"
                placeholder="Add a data quality rule (e.g., 99.9% data accuracy, no duplicate records)..."
                newValue={newDataQualityRule}
                setNewValue={setNewDataQualityRule}
                icon={Database}
                testId="data-quality-rules"
              />
            </CardContent>
          </Card>

          {/* Performance Requirements */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <Zap className="text-primary mr-2 h-5 w-5" />
                Performance Standards
              </h3>
              
              <ArrayInput
                field="performanceRequirements"
                label="Performance Benchmarks"
                placeholder="Add a performance requirement (e.g., API response <500ms, 99.9% uptime)..."
                newValue={newPerformanceRequirement}
                setNewValue={setNewPerformanceRequirement}
                icon={Zap}
                testId="performance-requirements"
              />
            </CardContent>
          </Card>

          {/* Security Requirements */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <Shield className="text-primary mr-2 h-5 w-5" />
                Security & Compliance
              </h3>
              
              <ArrayInput
                field="securityRequirements"
                label="Security Standards"
                placeholder="Add a security requirement (e.g., GDPR compliance, SSL encryption, 2FA)..."
                newValue={newSecurityRequirement}
                setNewValue={setNewSecurityRequirement}
                icon={Shield}
                testId="security-requirements"
              />
            </CardContent>
          </Card>

        </form>
      </Form>

      {/* Requirements Summary */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-sm font-medium text-foreground mb-4">Requirements Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary" data-testid="stat-success-metrics">
                {(watchedValues.successMetrics as string[])?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Success Metrics</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary" data-testid="stat-data-rules">
                {(watchedValues.dataQualityRules as string[])?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Data Quality Rules</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-chart-2" data-testid="stat-performance-reqs">
                {(watchedValues.performanceRequirements as string[])?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Performance Reqs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent" data-testid="stat-security-reqs">
                {(watchedValues.securityRequirements as string[])?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Security Reqs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t border-border">
        <Button variant="outline" className="text-foreground border-border hover:bg-muted" data-testid="button-previous-tab">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous: Features
        </Button>
        
        <div className="text-sm text-muted-foreground" data-testid="text-tab-indicator">
          Tab 5 of 6: Success Criteria
        </div>
        
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-next-tab">
          Next: Download
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
    </div>
  );
}
