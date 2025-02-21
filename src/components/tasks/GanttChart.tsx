
import { useState, useRef, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer
} from 'recharts';
import { Task } from '@/types/task';
import { format, addDays, differenceInDays, parseISO, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';

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
}

const COLORS = {
  todo: '#e11d48',
  in_progress: '#f59e0b',
  review: '#3b82f6',
  done: '#22c55e',
};

export const GanttChart = ({ tasks }: GanttChartProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [startDate, setStartDate] = useState<Date>(() => {
    const dates = tasks.map(task => parseISO(task.dueDate));
    return dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date();
  });

  const processedTasks = tasks.map((task, index) => {
    const dueDate = parseISO(task.dueDate);
    const start = differenceInDays(dueDate, startDate) - 7; // Estimation de 7 jours de travail
    return {
      id: task.id,
      name: task.title,
      start,
      duration: 7,
      dependencies: task.dependsOn || [],
      y: index,
      status: task.status,
    };
  });

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 shadow-lg rounded border">
        <p className="font-semibold">{data.name}</p>
        <p>Début: {format(addDays(startDate, data.start), 'PP', { locale: fr })}</p>
        <p>Durée: {data.duration} jours</p>
        <p>Statut: {data.status}</p>
      </div>
    );
  };

  const calculateCriticalPath = () => {
    const taskMap = new Map(processedTasks.map(task => [task.id, task]));
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

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedTasks}
            layout="vertical"
            barSize={20}
            margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
          >
            <XAxis
              type="number"
              domain={[
                Math.min(...processedTasks.map(t => t.start)),
                Math.max(...processedTasks.map(t => t.start + t.duration))
              ]}
              tickFormatter={(value) => format(addDays(startDate, value), 'P', { locale: fr })}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="duration"
              fill="#8884d8"
              background={{ fill: '#eee' }}
              shape={(props: any) => {
                const { x, y, width, height, payload } = props;
                const color = COLORS[payload.status as keyof typeof COLORS];
                const isCritical = criticalPathDurations.get(payload.id) === Math.max(...Array.from(criticalPathDurations.values()));
                
                return (
                  <g>
                    <rect
                      x={x + (payload.start * width * zoomLevel)}
                      y={y}
                      width={width * payload.duration * zoomLevel}
                      height={height}
                      fill={color}
                      strokeWidth={isCritical ? 2 : 0}
                      stroke={isCritical ? '#ef4444' : 'none'}
                    />
                    {payload.dependencies.map((depId: string) => {
                      const source = processedTasks.find(t => t.id === depId);
                      if (!source) return null;
                      
                      const sourceX = x + ((source.start + source.duration) * width * zoomLevel);
                      const sourceY = y + (height / 2) + (source.y - payload.y) * height;
                      const targetX = x + (payload.start * width * zoomLevel);
                      const targetY = y + height / 2;

                      return (
                        <path
                          key={`${depId}-${payload.id}`}
                          d={`M${sourceX},${sourceY} C${(sourceX + targetX) / 2},${sourceY} ${(sourceX + targetX) / 2},${targetY} ${targetX},${targetY}`}
                          stroke="#94a3b8"
                          strokeWidth="1"
                          fill="none"
                          strokeDasharray="4"
                        />
                      );
                    })}
                  </g>
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
