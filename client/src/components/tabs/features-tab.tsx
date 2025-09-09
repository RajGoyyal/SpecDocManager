import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cog, Plus, Edit, Trash2, ChevronLeft, ChevronRight, GripVertical, AlertCircle } from "lucide-react";
import FeatureForm from "@/components/forms/feature-form";
import type { Feature } from "@shared/schema";
import { useState } from "react";

interface FeaturesTabProps {
  projectId: string;
}

export default function FeaturesTab({ projectId }: FeaturesTabProps) {
  const [showFeatureForm, setShowFeatureForm] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

  const { data: features } = useQuery<Feature[]>({
    queryKey: ['/api/projects', projectId, 'features'],
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-accent text-accent-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'functional': return 'bg-primary/10 text-primary border-primary/20';
      case 'non-functional': return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      
      {/* Tab Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">Features</h2>
        <p className="text-muted-foreground">Define functional and non-functional requirements with priorities and specifications.</p>
      </div>

      {/* Feature Form */}
      {(showFeatureForm || editingFeature) && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <FeatureForm
              projectId={projectId}
              editingFeature={editingFeature}
              onCancel={() => {
                setShowFeatureForm(false);
                setEditingFeature(null);
              }}
              onSuccess={() => {
                setShowFeatureForm(false);
                setEditingFeature(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Features List */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-foreground flex items-center">
              <Cog className="text-primary mr-2 h-5 w-5" />
              Feature Requirements
            </h3>
            
            {!showFeatureForm && !editingFeature && (
              <Button 
                onClick={() => setShowFeatureForm(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-add-feature"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Feature
              </Button>
            )}
          </div>
          
          {features && features.length > 0 ? (
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={feature.id} 
                  className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                  data-testid={`feature-${feature.id}`}
                >
                  <div className="cursor-move text-muted-foreground mt-1" data-testid={`feature-drag-handle-${feature.id}`}>
                    <GripVertical className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1" data-testid={`feature-title-${feature.id}`}>
                          {feature.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`feature-description-${feature.id}`}>
                          {feature.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge 
                          className={`${getPriorityColor(feature.priority)} flex items-center gap-1`}
                          data-testid={`feature-priority-${feature.id}`}
                        >
                          {getPriorityIcon(feature.priority)}
                          {feature.priority}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={getTypeColor(feature.type)}
                          data-testid={`feature-type-${feature.id}`}
                        >
                          {feature.type}
                        </Badge>
                      </div>
                    </div>
                    
                    {feature.specifications && (
                      <div className="mt-3 p-3 bg-muted/50 rounded text-sm">
                        <p className="font-medium text-foreground mb-1">Specifications:</p>
                        <p className="text-muted-foreground" data-testid={`feature-specifications-${feature.id}`}>
                          {feature.specifications}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-1 mt-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => setEditingFeature(feature)}
                        data-testid={`button-edit-feature-${feature.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-accent"
                        data-testid={`button-delete-feature-${feature.id}`}
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
              <Cog className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">No Features</h4>
              <p className="text-muted-foreground mb-4">Start by adding your first feature requirement.</p>
              {!showFeatureForm && (
                <Button 
                  onClick={() => setShowFeatureForm(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-add-first-feature"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Feature
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature Statistics */}
      {features && features.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h4 className="text-sm font-medium text-foreground mb-4">Feature Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary" data-testid="stat-total-features">{features.length}</p>
                <p className="text-sm text-muted-foreground">Total Features</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent" data-testid="stat-high-priority">
                  {features.filter(f => f.priority === 'high').length}
                </p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary" data-testid="stat-medium-priority">
                  {features.filter(f => f.priority === 'medium').length}
                </p>
                <p className="text-sm text-muted-foreground">Medium Priority</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-chart-2" data-testid="stat-functional">
                  {features.filter(f => f.type === 'functional').length}
                </p>
                <p className="text-sm text-muted-foreground">Functional</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-chart-3" data-testid="stat-non-functional">
                  {features.filter(f => f.type === 'non-functional').length}
                </p>
                <p className="text-sm text-muted-foreground">Non-Functional</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t border-border">
        <Button variant="outline" className="text-foreground border-border hover:bg-muted" data-testid="button-previous-tab">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous: Data Fields
        </Button>
        
        <div className="text-sm text-muted-foreground" data-testid="text-tab-indicator">
          Tab 4 of 6: Features
        </div>
        
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-next-tab">
          Next: Success Criteria
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
    </div>
  );
}
