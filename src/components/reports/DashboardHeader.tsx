
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PieChartIcon, FileTextIcon, HelpCircleIcon, DownloadIcon, MailIcon, BookmarkIcon, SettingsIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExportMenu } from "./report-actions/ExportMenu";
import { ScheduleDialog } from "./report-actions/ScheduleDialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  activeTab: "dashboard" | "generator";
  onTabChange: (tab: "dashboard" | "generator") => void;
}

export const DashboardHeader = ({ activeTab, onTabChange }: DashboardHeaderProps) => {
  const { toast } = useToast();

  const handleSaveConfig = () => {
    toast({
      title: "Configuration sauvegardée",
      description: "Vos préférences de tableau de bord ont été sauvegardées.",
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Rapports</h1>
          <p className="text-muted-foreground">
            Analysez les performances et générez des rapports détaillés
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <ExportMenu />
          
          <ScheduleDialog 
            trigger={
              <Button variant="outline" className="flex items-center gap-2">
                <MailIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Planifier</span>
              </Button>
            }
          />
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleSaveConfig}
          >
            <BookmarkIcon className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon">
            <SettingsIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => onTabChange(value as "dashboard" | "generator")}
          className="w-full sm:w-auto"
        >
          <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span>Tableau de bord</span>
              <Badge className="ml-1 bg-primary/20 text-primary hover:bg-primary/30">Live</Badge>
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4" />
              <span>Générateur</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          variant="link" 
          className="text-muted-foreground pl-0 flex items-center gap-1"
          onClick={() => toast({
            title: "Aide sur les rapports",
            description: "Un guide d'utilisation détaillé est en cours de préparation.",
          })}
        >
          <HelpCircleIcon className="h-4 w-4" />
          <span>Guide des rapports</span>
        </Button>
      </div>
      
      <Separator className="my-4" />
    </div>
  );
};
