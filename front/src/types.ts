export type TaskStatus = 'Pending' | 'InProgress' | 'Completed';
export type FilterStatus = 'all' | 'Pending' | 'InProgress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  concludedAt: string | null;
  status: TaskStatus;
  color: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  color: string;
}

export interface UpdateTaskPayload {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  color: string;
}
