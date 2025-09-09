import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import ProjectHeader from "@/components/layout/project-header";
import RightSidebar from "@/components/layout/right-sidebar";
import TabNavigation from "@/components/tabs/tab-navigation";
import BasicInfoTab from "@/components/tabs/basic-info-tab";
import WhatWeNeedTab from "@/components/tabs/what-we-need-tab";
import DataFieldsTab from "@/components/tabs/data-fields-tab";
import FeaturesTab from "@/components/tabs/features-tab";
import SuccessCriteriaTab from "@/components/tabs/success-criteria-tab";
import DownloadTab from "@/components/tabs/download-tab";
import type { Project } from "@shared/schema";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);
  
  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['/api/projects', id],
    enabled: !!id && id !== 'new',
  });

  if (id === 'new') {
    // Handle new project creation
    return <div>Create New Project Form</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Project Not Found</h1>
          <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { component: <BasicInfoTab projectId={project.id} />, title: "Basic Info" },
    { component: <WhatWeNeedTab projectId={project.id} />, title: "What We Need" },
    { component: <DataFieldsTab projectId={project.id} />, title: "Data Fields" },
    { component: <FeaturesTab projectId={project.id} />, title: "Features" },
    { component: <SuccessCriteriaTab projectId={project.id} />, title: "Success Criteria" },
    { component: <DownloadTab projectId={project.id} />, title: "Download" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ProjectHeader project={project} />
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          tabs={[
            { icon: "info-circle", title: "Basic Info", hasChanges: false },
            { icon: "bullseye", title: "What We Need", hasChanges: true },
            { icon: "database", title: "Data Fields", hasChanges: true },
            { icon: "cog", title: "Features", hasChanges: false },
            { icon: "trophy", title: "Success Criteria", hasChanges: false },
            { icon: "download", title: "Download", hasChanges: false },
          ]}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {tabs[activeTab]?.component}
          </main>
          <RightSidebar projectId={project.id} />
        </div>
      </div>
    </div>
  );
}
