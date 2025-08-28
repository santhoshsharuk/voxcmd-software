
export type AgentStatus = 'active' | 'inactive' | 'error';
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';
export type View = 'home' | 'timeline' | 'agents' | 'settings';
export type NotificationType = 'success' | 'error' | 'info';

export interface Agent {
  name: string;
  description: string;
  status: AgentStatus;
  capabilities: string[];
}

export interface Task {
  id: string;
  goal: string;
  status: TaskStatus;
  agent: string;
  subTasks?: Task[];
  result?: string;
  createdAt: number;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  taskId: string;
}

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}
