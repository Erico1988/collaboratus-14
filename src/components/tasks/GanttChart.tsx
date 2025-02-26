
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from "sonner";
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { GanttToolbar } from './gantt/GanttToolbar';
import { configureGantt, configureTemplates, convertTasksToGanttFormat, getGanttStyles } from './gantt/utils';
import { GanttChartProps, ZoomLevel, ExportType } from './gantt/types';
import { MarketFilter } from './filters/MarketFilter';

export const GanttChart = ({ tasks }: GanttChartProps) => {
  const ganttContainer = useRef<HTMLDivElement>(null);
  const [currentZoom, setCurrentZoom] = useState<ZoomLevel>('days');
  const [showResources, setShowResources] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  const [showCriticalPath, setShowCriticalPath] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMarketId, setSelectedMarketId] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const isFirstRender = useRef(true);

  const filteredTasks = selectedMarketId 
    ? tasks.filter(task => task.marketId === selectedMarketId)
    : tasks;

  useEffect(() => {
    if (!ganttContainer.current || !filteredTasks.length) return;

    const initGantt = async () => {
      try {
        if (!isFirstRender.current) {
          gantt.destructor();
        }
        isFirstRender.current = false;

        configureGantt();
        configureTemplates();

        gantt.init(ganttContainer.current);
        
        const { data, links } = convertTasksToGanttFormat(filteredTasks);
        
        gantt.clearAll();
        gantt.parse({ data, links });

        if (data.length > 0) {
          const firstTask = data[0];
          setTimeout(() => {
            try {
              gantt.showDate(firstTask.start_date);
              setCurrentDate(firstTask.start_date);
            } catch (error) {
              console.error("Error showing date:", error);
            }
          }, 100);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing gantt chart:", error);
        toast.error("Erreur lors de l'initialisation du diagramme");
      }
    };

    initGantt();

    return () => {
      if (gantt.destructor && !isFirstRender.current) {
        try {
          gantt.clearAll();
          gantt.destructor();
        } catch (error) {
          console.error("Error cleaning up gantt chart:", error);
        }
      }
      setIsInitialized(false);
    };
  }, [filteredTasks]);

  const handleZoomChange = (level: ZoomLevel) => {
    setCurrentZoom(level);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
    gantt.showDate(newDate);
  };

  const handleExport = (type: ExportType) => {
    if (!isInitialized) return;

    try {
      const filename = `gantt-export-${new Date().toISOString().split('T')[0]}`;
      
      switch (type) {
        case 'pdf':
          gantt.exportToPDF({ filename: `${filename}.pdf` });
          break;
        case 'excel':
          gantt.exportToExcel({ filename: `${filename}.xlsx` });
          break;
        case 'png':
          gantt.exportToPNG({ filename: `${filename}.png` });
          break;
      }
    } catch (error) {
      console.error("Error exporting gantt:", error);
      toast.error("Erreur lors de l'export");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <GanttToolbar
          currentDate={currentDate}
          isInitialized={isInitialized}
          showResources={showResources}
          showProgress={showProgress}
          showCriticalPath={showCriticalPath}
          onZoomChange={handleZoomChange}
          onNavigate={handleNavigate}
          onResourcesToggle={setShowResources}
          onProgressToggle={setShowProgress}
          onCriticalPathToggle={setShowCriticalPath}
          onExport={handleExport}
        />
        <MarketFilter
          selectedMarketId={selectedMarketId}
          onMarketChange={setSelectedMarketId}
        />
      </div>

      <Card className="p-4">
        <ScrollArea className="h-[600px] relative">
          <div
            ref={ganttContainer}
            className="absolute inset-0"
            style={{ width: '100%', height: '100%' }}
          />
        </ScrollArea>
      </Card>

      <style>{getGanttStyles()}</style>
    </div>
  );
};
