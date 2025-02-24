
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task } from '@/types/task';
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Layers
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface GanttChartProps {
  tasks: Task[];
}

const ZOOM_LEVELS = {
  hours: {
    scales: [
      { unit: 'day', format: '%d %M' },
      { unit: 'hour', format: '%H:00' }
    ]
  },
  days: {
    scales: [
      { unit: 'month', format: '%F %Y' },
      { unit: 'day', format: '%j %D' }
    ]
  },
  weeks: {
    scales: [
      { unit: 'year', format: '%Y' },
      { unit: 'week', format: 'Semaine %W' }
    ]
  },
  months: {
    scales: [
      { unit: 'year', format: '%Y' },
      { unit: 'month', format: '%F' }
    ]
  }
};

const PRIORITY_COLORS = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#3b82f6',
  urgent: '#e11d48'
};

export const GanttChart = ({ tasks }: GanttChartProps) => {
  const ganttContainer = useRef<HTMLDivElement>(null);
  const [currentZoom, setCurrentZoom] = useState<keyof typeof ZOOM_LEVELS>('days');
  const [showResources, setShowResources] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  const [showCriticalPath, setShowCriticalPath] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!ganttContainer.current || !tasks.length) return;

    // Configuration initiale
    gantt.config.date_format = "%Y-%m-%d";
    gantt.config.drag_links = true;
    gantt.config.drag_progress = true;
    gantt.config.drag_resize = true;
    gantt.config.duration_unit = 'day';
    gantt.config.row_height = 40;
    gantt.config.layout = {
      css: "gantt_container",
      rows: [
        {
          cols: [
            { view: "grid", width: 300 },
            { resizer: true, width: 1 },
            { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" }
          ]
        },
        { view: "scrollVer" },
        {
          cols: [{ view: "scrollHor" }]
        }
      ]
    };

    // Configuration des colonnes
    gantt.config.columns = [
      { name: "text", label: "Tâche", tree: true, width: 200 },
      { name: "assignee", label: "Assigné à", align: "center", width: 100 },
      { name: "progress", label: "Progression", align: "center", width: 80, template: (task) => {
        return Math.round(task.progress * 100) + "%";
      }}
    ];

    // Style personnalisé pour les tâches
    gantt.templates.task_class = (start, end, task) => {
      const classes = ['custom-task'];
      if (task.priority) classes.push(`priority-${task.priority}`);
      if (task.status === 'done') classes.push('task-completed');
      return classes.join(' ');
    };

    // Style personnalisé pour les barres de progression
    gantt.templates.progress_text = (start, end, task) => {
      return `<div class="gantt-progress-label">${Math.round(task.progress * 100)}%</div>`;
    };

    // Formattage des dates
    gantt.templates.date_scale = (date) => {
      return format(date, 'PP', { locale: fr });
    };

    // Gestion des événements
    gantt.attachEvent("onTaskDrag", (id, mode, task, original) => {
      return true; // Autoriser le drag & drop
    });

    gantt.attachEvent("onAfterTaskUpdate", (id, task) => {
      toast.success(`Tâche "${task.text}" mise à jour`);
      return true;
    });

    gantt.attachEvent("onLinkCreated", (link) => {
      toast.success("Nouvelle dépendance ajoutée");
      return true;
    });

    // Initialisation
    gantt.init(ganttContainer.current);

    // Chargement des données
    const ganttTasks = tasks.map(task => ({
      id: task.id,
      text: task.title,
      start_date: parseISO(task.createdAt),
      end_date: parseISO(task.dueDate),
      progress: task.status === 'done' ? 1 : task.status === 'in_progress' ? 0.5 : 0,
      priority: task.priority,
      status: task.status,
      assignee: task.assigneeName
    }));

    const ganttLinks = tasks
      .filter(task => task.dependsOn)
      .flatMap(task => 
        task.dependsOn!.map(depId => ({
          id: `${depId}-${task.id}`,
          source: depId,
          target: task.id,
          type: "0"
        }))
      );

    gantt.parse({
      data: ganttTasks,
      links: ganttLinks
    });

    // Récupérer la date de début du projet après l'initialisation
    if (gantt.getState()?.min_date) {
      setCurrentDate(gantt.getState().min_date);
    }

    // Marquer comme initialisé
    setIsInitialized(true);

    // Nettoyage
    return () => {
      gantt.clearAll();
      setIsInitialized(false);
    };
  }, [tasks]);

  // Gestion du zoom
  const setZoom = (level: keyof typeof ZOOM_LEVELS) => {
    if (!isInitialized) return;
    setCurrentZoom(level);
    gantt.config.scales = ZOOM_LEVELS[level].scales as any;
    gantt.render();
  };

  // Navigation temporelle
  const scrollToDate = (date: Date) => {
    if (!isInitialized) return;
    gantt.scrollTo(date.getTime());
  };

  // Export des données
  const exportData = (format: 'pdf' | 'excel' | 'png') => {
    if (!isInitialized) return;
    
    const now = new Date();
    const dateStr = format(now, 'yyyy-MM-dd');
    const filename = `procuretrack-planning-${dateStr}`;
    
    switch (format) {
      case 'pdf':
        gantt.exportToPDF({ name: `${filename}.pdf` });
        break;
      case 'excel':
        gantt.exportToExcel({ name: `${filename}.xlsx` });
        break;
      case 'png':
        gantt.exportToPNG({ name: `${filename}.png` });
        break;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => scrollToDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
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
            onClick={() => scrollToDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
            disabled={!isInitialized}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          {/* Contrôles de zoom */}
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => setZoom('hours')} disabled={!isInitialized}>Heures</Button>
            <Button variant="outline" size="sm" onClick={() => setZoom('days')} disabled={!isInitialized}>Jours</Button>
            <Button variant="outline" size="sm" onClick={() => setZoom('weeks')} disabled={!isInitialized}>Semaines</Button>
            <Button variant="outline" size="sm" onClick={() => setZoom('months')} disabled={!isInitialized}>Mois</Button>
          </div>

          {/* Options d'affichage */}
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
                onCheckedChange={setShowResources}
              >
                Ressources
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showProgress}
                onCheckedChange={setShowProgress}
              >
                Progression
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showCriticalPath}
                onCheckedChange={setShowCriticalPath}
              >
                Chemin critique
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export */}
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
              <DropdownMenuCheckboxItem onClick={() => exportData('pdf')}>
                PDF
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem onClick={() => exportData('excel')}>
                Excel
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem onClick={() => exportData('png')}>
                Image PNG
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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

      <style>{`
        .gantt_task_line {
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .gantt_task_line:hover {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .gantt_link_arrow {
          border-color: #94a3b8;
        }

        .gantt_task_link {
          stroke: #94a3b8;
          stroke-dasharray: 4;
        }

        .priority-urgent .gantt_task_line {
          background-color: ${PRIORITY_COLORS.urgent};
        }

        .priority-high .gantt_task_line {
          background-color: ${PRIORITY_COLORS.high};
        }

        .priority-medium .gantt_task_line {
          background-color: ${PRIORITY_COLORS.medium};
        }

        .priority-low .gantt_task_line {
          background-color: ${PRIORITY_COLORS.low};
        }

        .task-completed .gantt_task_line {
          border: 2px solid currentColor;
        }

        .gantt_grid_head_cell {
          font-weight: 600;
          color: #374151;
        }

        .gantt_grid_data {
          color: #4b5563;
        }

        .gantt-progress-label {
          color: white;
          font-size: 12px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};
