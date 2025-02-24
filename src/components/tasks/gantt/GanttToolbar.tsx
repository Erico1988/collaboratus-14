
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ZoomLevel, ExportType } from './types';

interface GanttToolbarProps {
  currentDate: Date;
  isInitialized: boolean;
  showResources: boolean;
  showProgress: boolean;
  showCriticalPath: boolean;
  onZoomChange: (level: ZoomLevel) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onResourcesToggle: (show: boolean) => void;
  onProgressToggle: (show: boolean) => void;
  onCriticalPathToggle: (show: boolean) => void;
  onExport: (type: ExportType) => void;
}

export const GanttToolbar = ({
  currentDate,
  isInitialized,
  showResources,
  showProgress,
  showCriticalPath,
  onZoomChange,
  onNavigate,
  onResourcesToggle,
  onProgressToggle,
  onCriticalPathToggle,
  onExport
}: GanttToolbarProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onNavigate('prev')}
          disabled={!isInitialized}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {format(currentDate, 'MMMM yyyy', { locale: fr })}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onNavigate('next')}
          disabled={!isInitialized}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex gap-2">
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => onZoomChange('hours')} disabled={!isInitialized}>Heures</Button>
          <Button variant="outline" size="sm" onClick={() => onZoomChange('days')} disabled={!isInitialized}>Jours</Button>
          <Button variant="outline" size="sm" onClick={() => onZoomChange('weeks')} disabled={!isInitialized}>Semaines</Button>
          <Button variant="outline" size="sm" onClick={() => onZoomChange('months')} disabled={!isInitialized}>Mois</Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={!isInitialized}>
              <Filter className="h-4 w-4 mr-1" />
              Options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Affichage</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showResources}
              onCheckedChange={onResourcesToggle}
            >
              Ressources
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showProgress}
              onCheckedChange={onProgressToggle}
            >
              Progression
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showCriticalPath}
              onCheckedChange={onCriticalPathToggle}
            >
              Chemin critique
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={!isInitialized}>
              <Download className="h-4 w-4 mr-1" />
              Exporter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Format</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem onClick={() => onExport('pdf')}>
              PDF
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => onExport('excel')}>
              Excel
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => onExport('png')}>
              PNG
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
