import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye } from "lucide-react";
import type { ActivityLog, ProjectVersion } from "@shared/schema";

interface RightSidebarProps {
  projectId: string;
}

export default function RightSidebar({ projectId }: RightSidebarProps) {
  const { data: activities } = useQuery<ActivityLog[]>({
    queryKey: ['/api/projects', projectId, 'activity'],
  });

  const { data: versions } = useQuery<ProjectVersion[]>({
    queryKey: ['/api/projects', projectId, 'versions'],
  });

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'project_created':
      case 'project_updated':
        return 'bg-primary';
      case 'stakeholder_added':
      case 'data_field_added':
      case 'feature_added':
        return 'bg-secondary';
      case 'requirements_updated':
        return 'bg-accent';
      default:
        return 'bg-muted-foreground';
    }
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <aside className="w-80 bg-card border-l border-border overflow-y-auto">
      
      {/* Project Summary */}
      <div className="p-6 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-4">Project Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Requirements</span>
            <span className="font-medium text-foreground" data-testid="text-total-requirements">45</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">High Priority</span>
            <span className="font-medium text-accent" data-testid="text-high-priority">12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Functional</span>
            <span className="font-medium text-foreground" data-testid="text-functional">32</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Non-Functional</span>
            <span className="font-medium text-foreground" data-testid="text-non-functional">13</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium text-foreground" data-testid="text-completion-percentage">73%</span>
          </div>
          <Progress value={73} className="h-2" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div key={activity.id} className="flex space-x-3" data-testid={`activity-${activity.id}`}>
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getActivityColor(activity.action)}`} />
              <div>
                <p className="text-sm text-foreground" data-testid={`text-activity-description-${activity.id}`}>
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground" data-testid={`text-activity-time-${activity.id}`}>
                  {formatTimeAgo(activity.createdAt || new Date())}
                </p>
              </div>
            </div>
          ))}
          
          {!activities?.length && (
            <div className="text-sm text-muted-foreground">No recent activity</div>
          )}
        </div>
      </div>

      {/* Version History */}
      <div className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Version History</h3>
        <div className="space-y-4">
          {versions?.slice(0, 3).map((version, index) => (
            <div 
              key={version.id} 
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                index === 0 ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/30'
              }`}
              data-testid={`version-${version.id}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {version.version}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground" data-testid={`text-version-label-${version.id}`}>
                  {index === 0 ? 'Current Version' : 'Version'}
                </p>
                <p className="text-xs text-muted-foreground" data-testid={`text-version-date-${version.id}`}>
                  {new Date(version.createdAt || 0).toLocaleDateString()} - {new Date(version.createdAt || 0).toLocaleTimeString()}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80" data-testid={`button-view-version-${version.id}`}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {!versions?.length && (
            <div className="text-sm text-muted-foreground">No version history</div>
          )}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 text-primary hover:text-primary/80 border-primary/20 hover:bg-primary/5"
          data-testid="button-view-all-versions"
        >
          View All Versions
        </Button>
      </div>

    </aside>
  );
}
