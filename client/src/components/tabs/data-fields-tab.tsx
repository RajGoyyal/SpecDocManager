import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Plus, Edit, Trash2, ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import FieldCreator from "@/components/forms/field-creator";
import type { DataField } from "@shared/schema";
import { useState } from "react";

interface DataFieldsTabProps {
  projectId: string;
}

export default function DataFieldsTab({ projectId }: DataFieldsTabProps) {
  const [showFieldCreator, setShowFieldCreator] = useState(false);
  const [editingField, setEditingField] = useState<DataField | null>(null);

  const { data: dataFields } = useQuery<DataField[]>({
    queryKey: ['/api/projects', projectId, 'data-fields'],
  });

  const getControlTypeColor = (type: string) => {
    switch (type) {
      case 'input': return 'bg-primary/10 text-primary';
      case 'textarea': return 'bg-secondary/10 text-secondary';
      case 'select': return 'bg-accent/10 text-accent';
      case 'checkbox': return 'bg-chart-2/10 text-chart-2';
      case 'radio': return 'bg-chart-3/10 text-chart-3';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDataTypeIcon = (type: string) => {
    switch (type) {
      case 'string': return 'Aa';
      case 'number': return '123';
      case 'boolean': return 'T/F';
      case 'date': return '📅';
      default: return '?';
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      
      {/* Tab Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">Data Fields</h2>
        <p className="text-muted-foreground">Define the data structure and field specifications for your project.</p>
      </div>

      {/* Field Creator */}
      {(showFieldCreator || editingField) && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <FieldCreator
              projectId={projectId}
              editingField={editingField}
              onCancel={() => {
                setShowFieldCreator(false);
                setEditingField(null);
              }}
              onSuccess={() => {
                setShowFieldCreator(false);
                setEditingField(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Data Fields List */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-foreground flex items-center">
              <Database className="text-primary mr-2 h-5 w-5" />
              Field Specifications
            </h3>
            
            {!showFieldCreator && !editingField && (
              <Button 
                onClick={() => setShowFieldCreator(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-add-field"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Field
              </Button>
            )}
          </div>
          
          {dataFields && dataFields.length > 0 ? (
            <div className="space-y-4">
              {dataFields.map((field, index) => (
                <div 
                  key={field.id} 
                  className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                  data-testid={`field-${field.id}`}
                >
                  <div className="cursor-move text-muted-foreground" data-testid={`field-drag-handle-${field.id}`}>
                    <GripVertical className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="font-medium text-foreground" data-testid={`field-name-${field.id}`}>{field.name}</p>
                      <p className="text-sm text-muted-foreground" data-testid={`field-label-${field.id}`}>{field.displayLabel}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getControlTypeColor(field.uiControlType)} data-testid={`field-control-type-${field.id}`}>
                        {field.uiControlType}
                      </Badge>
                      <span className="text-xs font-mono bg-muted px-2 py-1 rounded" data-testid={`field-data-type-${field.id}`}>
                        {getDataTypeIcon(field.dataType)} {field.dataType}
                      </span>
                    </div>
                    
                    <div>
                      {field.required && (
                        <Badge variant="outline" className="text-accent border-accent" data-testid={`field-required-${field.id}`}>
                          Required
                        </Badge>
                      )}
                      {field.maxLength && (
                        <span className="text-xs text-muted-foreground ml-2" data-testid={`field-max-length-${field.id}`}>
                          Max: {field.maxLength}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => setEditingField(field)}
                        data-testid={`button-edit-field-${field.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-accent"
                        data-testid={`button-delete-field-${field.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">No Data Fields</h4>
              <p className="text-muted-foreground mb-4">Start by adding your first data field specification.</p>
              {!showFieldCreator && (
                <Button 
                  onClick={() => setShowFieldCreator(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-add-first-field"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Field
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Field Statistics */}
      {dataFields && dataFields.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h4 className="text-sm font-medium text-foreground mb-4">Field Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary" data-testid="stat-total-fields">{dataFields.length}</p>
                <p className="text-sm text-muted-foreground">Total Fields</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent" data-testid="stat-required-fields">
                  {dataFields.filter(f => f.required).length}
                </p>
                <p className="text-sm text-muted-foreground">Required</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary" data-testid="stat-optional-fields">
                  {dataFields.filter(f => !f.required).length}
                </p>
                <p className="text-sm text-muted-foreground">Optional</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-chart-2" data-testid="stat-validation-rules">
                  {dataFields.filter(f => f.validationRules && f.validationRules.length > 0).length}
                </p>
                <p className="text-sm text-muted-foreground">With Validation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t border-border">
        <Button variant="outline" className="text-foreground border-border hover:bg-muted" data-testid="button-previous-tab">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous: What We Need
        </Button>
        
        <div className="text-sm text-muted-foreground" data-testid="text-tab-indicator">
          Tab 3 of 6: Data Fields
        </div>
        
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-next-tab">
          Next: Features
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
    </div>
  );
}
