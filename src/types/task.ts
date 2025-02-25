
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'pending' | 'rejected' | 'assigned';

export interface Market {
  id: string;
  title: string;
  reference: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'published' | 'in_progress' | 'awarded' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  defaultPriority: TaskPriority;
  defaultStatus: TaskStatus;
  marketId?: string; // ID du marché associé
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
  marketId: string; // ID du marché associé (obligatoire)
  marketTitle?: string; // Titre du marché pour l'affichage
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
  wip?: {
    min?: number;
    max?: number;
  };
  policies?: {
    requireApproval?: boolean;
    autoAssignTo?: string[];
    restrictedTo?: string[];
  };
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
  marketId?: string; // Filtre par marché
  dueDate?: { start?: string; end?: string };
  search?: string;
}

export interface WorkflowAutomation {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'status_change' | 'deadline_approaching' | 'document_missing';
    conditions: Record<string, any>[];
  };
  actions: {
    type: 'change_status' | 'send_notification' | 'assign_user';
    parameters: Record<string, any>;
  }[];
  enabled: boolean;
}
