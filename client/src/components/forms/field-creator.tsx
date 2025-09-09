import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertDataFieldSchema } from "@shared/schema";
import type { DataField } from "@shared/schema";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface FieldCreatorProps {
  projectId: string;
  editingField?: DataField | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function FieldCreator({ projectId, editingField, onCancel, onSuccess }: FieldCreatorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [validationRules, setValidationRules] = useState<string[]>(editingField?.validationRules || []);
  const [newValidationRule, setNewValidationRule] = useState("");

  const form = useForm({
    resolver: zodResolver(insertDataFieldSchema.omit({ projectId: true })),
    defaultValues: {
      name: editingField?.name || "",
      displayLabel: editingField?.displayLabel || "",
      uiControlType: editingField?.uiControlType || "input",
      dataType: editingField?.dataType || "string",
      placeholder: editingField?.placeholder || "",
      defaultValue: editingField?.defaultValue || "",
      maxLength: editingField?.maxLength || undefined,
      required: editingField?.required || false,
      validationRules: editingField?.validationRules || [],
    },
  });

  const createField = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = editingField 
        ? `/api/data-fields/${editingField.id}`
        : `/api/projects/${projectId}/data-fields`;
      const method = editingField ? 'PATCH' : 'POST';
      
      return apiRequest(method, endpoint, { ...data, validationRules });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'data-fields'] });
      toast({ 
        title: editingField ? "Field updated successfully" : "Field created successfully" 
      });
      onSuccess();
    },
    onError: () => {
      toast({ 
        title: editingField ? "Failed to update field" : "Failed to create field", 
        description: "Please try again.",
        variant: "destructive" 
      });
    },
  });

  const addValidationRule = () => {
    if (newValidationRule.trim() && !validationRules.includes(newValidationRule.trim())) {
      setValidationRules([...validationRules, newValidationRule.trim()]);
      setNewValidationRule("");
    }
  };

  const removeValidationRule = (index: number) => {
    setValidationRules(validationRules.filter((_, i) => i !== index));
  };

  const onSubmit = (data: any) => {
    createField.mutate({ ...data, validationRules });
  };

  return (
    <div>
      <h4 className="font-medium text-foreground mb-4">
        {editingField ? "Edit Data Field" : "Create New Data Field"}
      </h4>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="fieldName (camelCase)" {...field} data-testid="input-field-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="displayLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Label *</FormLabel>
                  <FormControl>
                    <Input placeholder="Field Label" {...field} data-testid="input-field-label" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Control and Data Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="uiControlType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UI Control Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-control-type">
                        <SelectValue placeholder="Select control type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="input">Text Input</SelectItem>
                      <SelectItem value="textarea">Textarea</SelectItem>
                      <SelectItem value="select">Select Dropdown</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="radio">Radio Button</SelectItem>
                      <SelectItem value="date">Date Picker</SelectItem>
                      <SelectItem value="number">Number Input</SelectItem>
                      <SelectItem value="email">Email Input</SelectItem>
                      <SelectItem value="password">Password Input</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dataType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-data-type">
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placeholder Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter placeholder text..." {...field} data-testid="input-field-placeholder" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="defaultValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Value</FormLabel>
                  <FormControl>
                    <Input placeholder="Default value..." {...field} data-testid="input-field-default" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Constraints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="maxLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Length</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Maximum character length" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      data-testid="input-field-max-length"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 pt-2">
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                      data-testid="switch-field-required"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium">Required Field</FormLabel>
                </FormItem>
              )}
            />
          </div>
          
          {/* Validation Rules */}
          <div>
            <FormLabel>Validation Rules</FormLabel>
            <div className="space-y-2 mt-2">
              {validationRules.map((rule, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-muted/30 rounded" data-testid={`validation-rule-${index}`}>
                  <span className="flex-1 text-sm text-foreground">{rule}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-accent"
                    onClick={() => removeValidationRule(index)}
                    data-testid={`remove-validation-rule-${index}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2 mt-2">
              <Input
                value={newValidationRule}
                onChange={(e) => setNewValidationRule(e.target.value)}
                placeholder="Add validation rule (e.g., min:5, pattern:^[A-Z])"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addValidationRule();
                  }
                }}
                data-testid="input-new-validation-rule"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addValidationRule}
                data-testid="button-add-validation-rule"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t border-border">
            <Button 
              type="submit" 
              disabled={createField.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-save-field"
            >
              {createField.isPending ? "Saving..." : (editingField ? "Update Field" : "Create Field")}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
              data-testid="button-cancel-field"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
