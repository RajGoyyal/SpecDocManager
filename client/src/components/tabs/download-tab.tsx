import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generateFRSDocument, generateWordDocument } from "@/lib/document-generator";
import { Download, FileText, File, Package, Eye, Clock, CheckCircle, ChevronLeft } from "lucide-react";
import type { Project, ProjectRequirements, DataField, Feature, Stakeholder, Milestone } from "@shared/schema";

interface DownloadTabProps {
  projectId: string;
}

export default function DownloadTab({ projectId }: DownloadTabProps) {
  const { toast } = useToast();

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  const { data: requirements } = useQuery<ProjectRequirements>({
    queryKey: ['/api/projects', projectId, 'requirements'],
  });

  const { data: dataFields } = useQuery<DataField[]>({
    queryKey: ['/api/projects', projectId, 'data-fields'],
  });

  const { data: features } = useQuery<Feature[]>({
    queryKey: ['/api/projects', projectId, 'features'],
  });

  const { data: stakeholders } = useQuery<Stakeholder[]>({
    queryKey: ['/api/projects', projectId, 'stakeholders'],
  });

  const { data: milestones } = useQuery<Milestone[]>({
    queryKey: ['/api/projects', projectId, 'milestones'],
  });

  const generateFRS = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/projects/${projectId}/generate-frs`);
    },
    onSuccess: () => {
      toast({
        title: "FRS Generated Successfully",
        description: "Your Functional Requirements Specification is ready for download.",
      });
    },
  });

  const handleDownloadPDF = async () => {
    if (!project) return;

    try {
      const documentData = {
        project,
        requirements,
        dataFields: dataFields || [],
        features: features || [],
        stakeholders: stakeholders || [],
        milestones: milestones || [],
      };

      await generateFRSDocument(documentData);
      toast({
        title: "PDF Downloaded",
        description: "FRS document has been downloaded as PDF.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF document.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadWord = async () => {
    if (!project) return;

    try {
      const documentData = {
        project,
        requirements,
        dataFields: dataFields || [],
        features: features || [],
        stakeholders: stakeholders || [],
        milestones: milestones || [],
      };

      await generateWordDocument(documentData);
      toast({
        title: "Word Document Downloaded",
        description: "FRS document has been downloaded as Word document.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate Word document.",
        variant: "destructive",
      });
    }
  };

  const getCompletionPercentage = () => {
    let totalSections = 6;
    let completedSections = 0;

    // Basic Info (always completed if project exists)
    if (project) completedSections++;

    // What We Need
    if (requirements?.userExperienceGoals || requirements?.scopeIncluded?.length) completedSections++;

    // Data Fields
    if (dataFields?.length) completedSections++;

    // Features
    if (features?.length) completedSections++;

    // Success Criteria
    if (requirements?.successMetrics?.length || requirements?.userTestingPlans) completedSections++;

    // Download (always available)
    completedSections++;

    return Math.round((completedSections / totalSections) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="p-8 max-w-4xl">
      
      {/* Tab Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">Download & Export</h2>
        <p className="text-muted-foreground">Generate and download your Functional Requirements Specification document.</p>
      </div>

      {/* Document Summary */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
            <FileText className="text-primary mr-2 h-5 w-5" />
            Document Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Project Title</span>
                <span className="font-medium text-foreground" data-testid="text-summary-title">
                  {project?.title || "Untitled Project"}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Version</span>
                <span className="font-medium text-foreground" data-testid="text-summary-version">
                  {project?.version || "1.0.0"}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Requirements</span>
                <span className="font-medium text-foreground" data-testid="text-summary-total-requirements">
                  {(dataFields?.length || 0) + (features?.length || 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">High Priority</span>
                <span className="font-medium text-accent" data-testid="text-summary-high-priority">
                  {features?.filter(f => f.priority === 'high').length || 0}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Functional</span>
                <span className="font-medium text-foreground" data-testid="text-summary-functional">
                  {features?.filter(f => f.type === 'functional').length || 0}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Non-Functional</span>
                <span className="font-medium text-foreground" data-testid="text-summary-non-functional">
                  {features?.filter(f => f.type === 'non-functional').length || 0}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Stakeholders</span>
                <span className="font-medium text-foreground" data-testid="text-summary-stakeholders">
                  {stakeholders?.length || 0}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Data Fields</span>
                <span className="font-medium text-foreground" data-testid="text-summary-data-fields">
                  {dataFields?.length || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Document Completion</span>
              <span className="font-medium text-foreground" data-testid="text-completion-status">
                {completionPercentage}% Complete
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            
            <div className="flex items-center mt-2 text-sm">
              {completionPercentage === 100 ? (
                <div className="flex items-center text-secondary">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Ready for export
                </div>
              ) : (
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  Complete all sections for best results
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        
        {/* PDF Export */}
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
            <h4 className="font-medium text-foreground mb-2">PDF Document</h4>
            <p className="text-sm text-muted-foreground mb-4">Professional PDF format suitable for sharing and printing</p>
            <Button 
              onClick={handleDownloadPDF}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-download-pdf"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </CardContent>
        </Card>

        {/* Word Export */}
        <Card>
          <CardContent className="p-6 text-center">
            <File className="mx-auto h-12 w-12 text-secondary mb-4" />
            <h4 className="font-medium text-foreground mb-2">Word Document</h4>
            <p className="text-sm text-muted-foreground mb-4">Editable Word format for collaboration and revisions</p>
            <Button 
              onClick={handleDownloadWord}
              variant="outline"
              className="w-full"
              data-testid="button-download-word"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Word
            </Button>
          </CardContent>
        </Card>

        {/* Complete Package */}
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="mx-auto h-12 w-12 text-accent mb-4" />
            <h4 className="font-medium text-foreground mb-2">Complete Package</h4>
            <p className="text-sm text-muted-foreground mb-4">ZIP file with all formats and supporting documents</p>
            <Button 
              variant="outline"
              className="w-full"
              data-testid="button-download-package"
            >
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Document Preview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground flex items-center">
              <Eye className="text-primary mr-2 h-5 w-5" />
              Document Preview
            </h3>
            <Button 
              onClick={() => generateFRS.mutate()}
              disabled={generateFRS.isPending}
              variant="outline"
              data-testid="button-generate-preview"
            >
              {generateFRS.isPending ? "Generating..." : "Generate Preview"}
            </Button>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-6 text-center">
            <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h4 className="font-medium text-foreground mb-2">Document Preview</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Click "Generate Preview" to see how your FRS document will look
            </p>
            
            {/* Document Structure Preview */}
            <div className="text-left max-w-md mx-auto space-y-2">
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 bg-secondary rounded-full mr-2" />
                <span className="text-foreground">1. Executive Summary</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 bg-secondary rounded-full mr-2" />
                <span className="text-foreground">2. Project Overview</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 bg-secondary rounded-full mr-2" />
                <span className="text-foreground">3. Stakeholders</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 bg-secondary rounded-full mr-2" />
                <span className="text-foreground">4. Requirements Specification</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 bg-secondary rounded-full mr-2" />
                <span className="text-foreground">5. Data Fields & Features</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 bg-secondary rounded-full mr-2" />
                <span className="text-foreground">6. Success Criteria</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t border-border">
        <Button variant="outline" className="text-foreground border-border hover:bg-muted" data-testid="button-previous-tab">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous: Success Criteria
        </Button>
        
        <div className="text-sm text-muted-foreground" data-testid="text-tab-indicator">
          Tab 6 of 6: Download
        </div>
        
        <div className="text-sm text-muted-foreground">
          Document ready for export
        </div>
      </div>
      
    </div>
  );
}
