
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'pending' | 'rejected' | 'assigned';

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  defaultPriority: TaskPriority;
  defaultStatus: TaskStatus;
  subtasks?: TaskTemplate[];
  attachments?: string[];
  automations?: TaskAutomation[];
}

export interface TaskAutomation {
  id: string;
  trigger: 'status_change' | 'document_missing' | 'deadline_approaching';
  condition?: string;
  action: 'change_status' | 'send_notification' | 'assign_user';
  parameters: Record<string, any>;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  content: string;
  mentions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  action: 'created' | 'updated' | 'status_changed' | 'commented' | 'attachment_added';
  details: Record<string, any>;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigneeId?: string;
  assigneeName?: string;
  dependsOn?: string[];
  isBlocked?: boolean;
  createdAt: string;
  updatedAt: string;
  subtasks?: Task[];
  templateId?: string;
  comments?: TaskComment[];
  history?: TaskHistory[];
  attachments?: string[];
  automations?: TaskAutomation[];
  sla?: {
    deadline: string;
    priority: TaskPriority;
    escalationRules?: Record<string, any>;
  };
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  roleAccess?: string[];
  automations?: TaskAutomation[];
}

export interface TaskNotification {
  id: string;
  taskId: string;
  userId: string;
  type: 'mention' | 'assignment' | 'deadline' | 'status_change';
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignee?: string[];
  dueDate?: { start?: string; end?: string };
  search?: string;
}

