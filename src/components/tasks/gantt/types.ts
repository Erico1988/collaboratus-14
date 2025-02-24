
import { Task } from '@/types/task';
import { ZOOM_LEVELS } from './constants';

export interface GanttChartProps {
  tasks: Task[];
}

export type ZoomLevel = keyof typeof ZOOM_LEVELS;
export type ExportType = 'pdf' | 'excel' | 'png';

export interface GanttTask {
  id: string;
  text: string;
  start_date: Date;
  end_date: Date;
  progress: number;
  priority?: string;
  status?: string;
  assignee?: string;
}

export interface GanttLink {
  id: string;
  source: string;
  target: string;
  type: string;
}
