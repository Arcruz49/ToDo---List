import axios from 'axios';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from './types';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/tasks',
});

export const api = {
  list: () => http.get<Task[]>('').then(r => r.data),
  get:  (id: string) => http.get<Task>(`/${id}`).then(r => r.data),
  create: (payload: CreateTaskPayload) => http.post<Task>('', payload).then(r => r.data),
  update: (payload: UpdateTaskPayload) => http.put<Task>('', payload).then(r => r.data),
  remove: (id: string) => http.delete(`/${id}`),
};
