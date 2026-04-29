import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types';

export function useTasks(onError: (msg: string) => void) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.list()
      .then(data => { if (!cancelled) { setTasks(data); setLoading(false); } })
      .catch(() => { if (!cancelled) { onError('Erro ao carregar tarefas.'); setLoading(false); } });
    return () => { cancelled = true; };
  }, [onError]);

  const create = useCallback(async (payload: CreateTaskPayload) => {
    const task = await api.create(payload);
    setTasks(prev => [task, ...prev]);
    return task;
  }, []);

  const update = useCallback(async (payload: UpdateTaskPayload) => {
    const task = await api.update(payload);
    setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    return task;
  }, []);

  const remove = useCallback(async (id: string) => {
    await api.remove(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  return { tasks, loading, create, update, remove };
}
