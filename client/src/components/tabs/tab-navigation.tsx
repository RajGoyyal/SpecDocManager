import { Button } from "@/components/ui/button";
import { Info, Target, Database, Cog, Trophy, Download } from "lucide-react";

interface TabInfo {
  icon: string;
  title: string;
  hasChanges: boolean;
}

interface TabNavigationProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  tabs: TabInfo[];
}

const iconMap = {
  "info-circle": Info,
  "bullseye": Target,
  "database": Database,
  "cog": Cog,
  "trophy": Trophy,
  "download": Download,
};

export default function TabNavigation({ activeTab, onTabChange, tabs }: TabNavigationProps) {
  return (
    <div className="bg-card border-b border-border px-8">
      <nav className="flex space-x-8">
        {tabs.map((tab, index) => {
          const IconComponent = iconMap[tab.icon as keyof typeof iconMap];
          const isActive = activeTab === index;
          
          return (
            <Button
              key={index}
              variant="ghost"
              className={`py-4 px-1 border-b-2 font-medium text-sm relative h-auto rounded-none ${
                isActive 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => onTabChange(index)}
              data-testid={`tab-${tab.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center space-x-2">
                <IconComponent className="h-4 w-4" />
                <span>{tab.title}</span>
                {tab.hasChanges && (
                  <div className="absolute -top-1 -right-2 w-2 h-2 bg-secondary rounded-full" />
                )}
              </div>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
