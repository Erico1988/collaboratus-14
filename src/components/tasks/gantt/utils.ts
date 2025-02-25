
import { gantt } from 'dhtmlx-gantt';
import { Task } from '@/types/task';
import { GanttTask, GanttLink } from './types';
import { parseISO } from 'date-fns';
import { STATUS_COLORS } from './constants';

export const configureGantt = () => {
  gantt.config.date_format = "%Y-%m-%d %H:%i";
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

  gantt.config.columns = [
    { name: "text", label: "Tâche", tree: true, width: 200 },
    { name: "assignee", label: "Assigné à", align: "center", width: 100 },
    { name: "progress", label: "Progression", align: "center", width: 80, template: (task) => {
      return Math.round(task.progress * 100) + "%";
    }}
  ];
};

export const configureTemplates = () => {
  gantt.templates.task_class = (start, end, task) => {
    const classes = ['custom-task'];
    if (task.priority) classes.push(`priority-${task.priority}`);
    if (task.status) classes.push(`status-${task.status}`);
    return classes.join(' ');
  };

  gantt.templates.progress_text = (start, end, task) => {
    return `<div class="gantt-progress-label">${Math.round(task.progress * 100)}%</div>`;
  };
};

export const convertTasksToGanttFormat = (tasks: Task[]): { data: GanttTask[], links: GanttLink[] } => {
  const ganttTasks = tasks.map(task => {
    // Ensure dates are properly formatted for the gantt chart
    const startDate = new Date(task.createdAt);
    const endDate = new Date(task.dueDate);
    
    // Add a minimum duration of 1 day if start and end dates are the same
    if (startDate.getTime() === endDate.getTime()) {
      endDate.setDate(endDate.getDate() + 1);
    }

    return {
      id: task.id,
      text: task.title,
      start_date: startDate,
      end_date: endDate,
      progress: task.status === 'done' ? 1 : task.status === 'in_progress' ? 0.5 : 0,
      priority: task.priority,
      status: task.status,
      assignee: task.assigneeName
    };
  });

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

  return { data: ganttTasks, links: ganttLinks };
};

export const getGanttStyles = () => `
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

  .gantt_progress_label {
    color: white;
    font-size: 12px;
    font-weight: 500;
  }

  ${Object.entries(STATUS_COLORS).map(([status, color]) => `
    .status-${status} .gantt_task_line {
      background-color: ${color};
    }
  `).join('\n')}
`;
