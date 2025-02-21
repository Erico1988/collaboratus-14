
import { useState, useRef, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Task } from '@/types/task';
import { 
  format, 
  addDays, 
  differenceInDays, 
  parseISO, 
  isAfter, 
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isWeekend,
  addWeeks
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface GanttChartProps {
  tasks: Task[];
}

interface GanttTask {
  id: string;
  name: string;
  start: number;
  duration: number;
  dependencies: string[];
  y: number;
  status: string;
  completion: number;
  assigneeName?: string;
  priority: string;
}

const COLORS = {
  todo: '#e11d48',
  in_progress: '#f59e0b',
  review: '#3b82f6',
  done: '#22c55e',
};

const PRIORITY_PATTERNS = {
  low: '',
  medium: '2,2',
  high: '4,2',
  urgent: '8,2',
};

export const GanttChart = ({ tasks }: GanttChartProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [startDate, setStartDate] = useState<Date>(() => {
    const dates = tasks.map(task => parseISO(task.dueDate));
    return dates.length > 0 ? 
      startOfWeek(new Date(Math.min(...dates.map(d => d.getTime()))), { locale: fr }) : 
      startOfWeek(new Date(), { locale: fr });
  });
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const calculateTaskProgress = (task: Task): number => {
    switch (task.status) {
      case 'done': return 100;
      case 'review': return 75;
      case 'in_progress': return 30;
      default: return 0;
    }
  };

  const processedTasks = tasks.map((task, index) => {
    const dueDate = parseISO(task.dueDate);
    const estimatedStartDate = addDays(dueDate, -7);
    const start = differenceInDays(estimatedStartDate, startDate);
    return {
      id: task.id,
      name: task.title,
      start,
      duration: 7,
      dependencies: task.dependsOn || [],
      y: index,
      status: task.status,
      completion: calculateTaskProgress(task),
      assigneeName: task.assigneeName,
      priority: task.priority,
    };
  });

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
  };

  const handlePreviousWeek = () => {
    setStartDate(prev => addWeeks(prev, -1));
  };

  const handleNextWeek = () => {
    setStartDate(prev => addWeeks(prev, 1));
  };

  const calculateCriticalPath = () => {
    const taskMap = new Map(processedTasks.map(task => [task.id, { ...task }]));
    const visited = new Set<string>();
    const memo = new Map<string, number>();

    const dfs = (taskId: string): number => {
      if (visited.has(taskId)) return memo.get(taskId) || 0;
      visited.add(taskId);

      const task = taskMap.get(taskId);
      if (!task) return 0;

      let maxDependencyDuration = 0;
      for (const depId of task.dependencies) {
        maxDependencyDuration = Math.max(maxDependencyDuration, dfs(depId));
      }

      const totalDuration = task.duration + maxDependencyDuration;
      memo.set(taskId, totalDuration);
      return totalDuration;
    };

    processedTasks.forEach(task => {
      if (!visited.has(task.id)) {
        dfs(task.id);
      }
    });

    return memo;
  };

  const criticalPathDurations = calculateCriticalPath();
  const maxCriticalDuration = Math.max(...Array.from(criticalPathDurations.values()));

  // Génération des lignes de référence pour les week-ends
  const weekendLines = eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, 30)
  })
  .filter(date => isWeekend(date))
  .map(date => differenceInDays(date, startDate));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload as GanttTask;
    const startDateStr = format(addDays(startDate, data.start), 'PP', { locale: fr });
    const endDateStr = format(addDays(startDate, data.start + data.duration), 'PP', { locale: fr });

    return (
      <Card className="p-3 shadow-lg border-2">
        <div className="space-y-2">
          <div>
            <h4 className="font-semibold">{data.name}</h4>
            {data.assigneeName && (
              <p className="text-sm text-muted-foreground">
                Assigné à: {data.assigneeName}
              </p>
            )}
          </div>
          <div className="text-sm space-y-1">
            <p>Début: {startDateStr}</p>
            <p>Fin: {endDateStr}</p>
            <p>Durée: {data.duration} jours</p>
            <p>Avancement: {data.completion}%</p>
            <p>Priorité: {data.priority}</p>
          </div>
          {data.dependencies.length > 0 && (
            <div className="text-sm">
              <p>Dépendances:</p>
              <ul className="list-disc list-inside">
                {data.dependencies.map(depId => {
                  const depTask = processedTasks.find(t => t.id === depId);
                  return depTask && <li key={depId}>{depTask.name}</li>;
                })}
              </ul>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(startDate, 'MMMM yyyy', { locale: fr })}
          </span>
          <Button variant="outline" size="sm" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <ScrollArea className="h-[600px]">
          <ResponsiveContainer width="100%" height={Math.max(400, processedTasks.length * 50)}>
            <BarChart
              data={processedTasks}
              layout="vertical"
              barSize={20}
              margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
            >
              {weekendLines.map(day => (
                <ReferenceArea
                  key={day}
                  x1={day}
                  x2={day + 1}
                  fill="#f1f5f9"
                  fillOpacity={0.5}
                />
              ))}
              <XAxis
                type="number"
                domain={[
                  Math.min(...processedTasks.map(t => t.start)) - 1,
                  Math.max(...processedTasks.map(t => t.start + t.duration)) + 1
                ]}
                tickFormatter={(value) => format(addDays(startDate, value), 'dd/MM', { locale: fr })}
                interval={0}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={140}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={-3}
                      y={0}
                      dy={4}
                      textAnchor="end"
                      fill="#374151"
                      fontSize={12}
                      className="font-medium"
                    >
                      {payload.value}
                    </text>
                  </g>
                )}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="duration"
                background={{ fill: '#f1f5f9' }}
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  const color = COLORS[payload.status as keyof typeof COLORS];
                  const isCritical = criticalPathDurations.get(payload.id) === maxCriticalDuration;
                  const isHovered = hoveredTask === payload.id;
                  const taskWidth = width * payload.duration * zoomLevel;
                  const taskX = x + (payload.start * width * zoomLevel);

                  return (
                    <g
                      onMouseEnter={() => setHoveredTask(payload.id)}
                      onMouseLeave={() => setHoveredTask(null)}
                    >
                      {/* Barre principale */}
                      <rect
                        x={taskX}
                        y={y}
                        width={taskWidth}
                        height={height}
                        fill={color}
                        opacity={0.2}
                        strokeWidth={isCritical ? 2 : 1}
                        stroke={isCritical ? '#ef4444' : color}
                        className={cn(
                          "transition-all duration-200",
                          isHovered && "filter drop-shadow-lg"
                        )}
                      />
                      {/* Barre de progression */}
                      <rect
                        x={taskX}
                        y={y}
                        width={taskWidth * (payload.completion / 100)}
                        height={height}
                        fill={color}
                        className={cn(
                          "transition-all duration-200",
                          isHovered && "filter drop-shadow-lg"
                        )}
                      />
                      {/* Motif de priorité */}
                      {PRIORITY_PATTERNS[payload.priority as keyof typeof PRIORITY_PATTERNS] && (
                        <path
                          d={`M${taskX},${y} l${taskWidth},0`}
                          strokeWidth={2}
                          stroke={color}
                          strokeDasharray={PRIORITY_PATTERNS[payload.priority as keyof typeof PRIORITY_PATTERNS]}
                          strokeLinecap="round"
                        />
                      )}
                      {/* Flèches de dépendance */}
                      {payload.dependencies.map((depId: string) => {
                        const source = processedTasks.find(t => t.id === depId);
                        if (!source) return null;
                        
                        const sourceX = x + ((source.start + source.duration) * width * zoomLevel);
                        const sourceY = y + (height / 2) + (source.y - payload.y) * height;
                        const targetX = taskX;
                        const targetY = y + height / 2;
                        
                        return (
                          <g key={`${depId}-${payload.id}`}>
                            <path
                              d={`M${sourceX},${sourceY} C${(sourceX + targetX) / 2},${sourceY} ${(sourceX + targetX) / 2},${targetY} ${targetX},${targetY}`}
                              stroke={isHovered ? '#64748b' : '#94a3b8'}
                              strokeWidth={isHovered ? 2 : 1}
                              fill="none"
                              strokeDasharray="4"
                              className="transition-all duration-200"
                            />
                            {/* Flèche */}
                            <path
                              d={`M${targetX},${targetY} l-5,-3 l0,6 z`}
                              fill={isHovered ? '#64748b' : '#94a3b8'}
                              className="transition-all duration-200"
                            />
                          </g>
                        );
                      })}
                    </g>
                  );
                }}
              />
              {/* Ligne du jour actuel */}
              <ReferenceLine
                x={differenceInDays(new Date(), startDate)}
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="3 3"
              />
            </BarChart>
          </ResponsiveContainer>
        </ScrollArea>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#e11d48]" />
            <span>À faire</span>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#f59e0b]" />
            <span>En cours</span>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#3b82f6]" />
            <span>En révision</span>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#22c55e]" />
            <span>Terminé</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
