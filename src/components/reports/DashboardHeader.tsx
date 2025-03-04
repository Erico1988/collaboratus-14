
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, BarChart3 } from "lucide-react";

interface DashboardHeaderProps {
  activeTab: "dashboard" | "generator";
  onTabChange: (tab: "dashboard" | "generator") => void;
}

export const DashboardHeader = ({ activeTab, onTabChange }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Rapports et Analyses</h1>
        <p className="text-muted-foreground mt-1">
          Visualisez vos données et générez des rapports personnalisés
        </p>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => onTabChange(value as "dashboard" | "generator")}
        className="w-full sm:w-auto"
      >
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>Tableau de bord</span>
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Générateur</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
