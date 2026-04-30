import { useState, useMemo, useCallback, useEffect } from 'react';
import { useToast } from './hooks/useToast';
import { useTasks } from './hooks/useTasks';
import type { Task, FilterStatus } from './types';

import Sidebar        from './components/Sidebar';
import BottomNav      from './components/BottomNav';
import SearchBar      from './components/SearchBar';
import TaskForm       from './components/TaskForm';
import TaskList       from './components/TaskList';
import EditModal      from './components/EditModal';
import TaskViewModal  from './components/TaskViewModal';
import ToastContainer from './components/ToastContainer';
import { PlusIcon }   from './components/Icons';

const FILTER_LABELS: Record<FilterStatus, string> = {
  all:        'Todas as tarefas',
  Pending:    'Pendentes',
  InProgress: 'Em andamento',
  Completed:  'Concluídas',
};

export default function App() {
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const { toasts, toast, dismiss } = useToast();
  const onError = useCallback((msg: string) => toast(msg, 'error'), [toast]);

  const { tasks, loading, create, update, remove } = useTasks(onError);
  const [query,       setQuery]       = useState('');
  const [filter,      setFilter]      = useState<FilterStatus>('all');
  const [creating,    setCreating]    = useState(false);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filtered = useMemo(() => {
    let list = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [tasks, filter, query]);

  const taskCounts = useMemo(() => ({
    all:        tasks.length,
    Pending:    tasks.filter(t => t.status === 'Pending').length,
    InProgress: tasks.filter(t => t.status === 'InProgress').length,
    Completed:  tasks.filter(t => t.status === 'Completed').length,
  }), [tasks]);

  const handleCreate = async (payload: Parameters<typeof create>[0]) => {
    try {
      await create(payload);
      toast('Tarefa criada com sucesso!', 'success');
    } catch {
      toast('Erro ao criar tarefa.', 'error');
      throw new Error();
    }
  };

  const handleSave = async (payload: Parameters<typeof update>[0]) => {
    try {
      await update(payload);
      toast('Tarefa atualizada!', 'success');
    } catch {
      toast('Erro ao atualizar tarefa.', 'error');
      throw new Error();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast('Tarefa excluída.', 'info');
    } catch {
      toast('Erro ao excluir tarefa.', 'error');
    }
  };

  const handleOpenEdit = (task: Task) => {
    setViewingTask(null);
    setEditingTask(task);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar
        filter={filter}
        onFilter={setFilter}
        dark={dark}
        onToggleDark={() => setDark(d => !d)}
        taskCounts={taskCounts}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="shrink-0 flex items-center gap-3 px-5 md:px-8 py-4 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <span className="md:hidden font-bold text-gray-900 dark:text-white text-base mr-auto">
            ToDo Notes
          </span>
          <h1 className="hidden md:block text-base font-bold text-gray-900 dark:text-white mr-auto">
            {FILTER_LABELS[filter]}
            <span className="ml-2 text-xs font-normal text-gray-400 dark:text-gray-500 tabular-nums">
              {filtered.length}
            </span>
          </h1>

          <SearchBar value={query} onChange={setQuery} />

          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors shrink-0"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Nova tarefa</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-5 md:px-8 py-6 pb-24 md:pb-6">
          <TaskList
            tasks={filtered}
            loading={loading}
            query={query}
            onView={setViewingTask}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        </main>
      </div>

      <BottomNav filter={filter} onFilter={setFilter} onNew={() => setCreating(true)} />

      {creating && (
        <TaskForm onSubmit={handleCreate} onClose={() => setCreating(false)} />
      )}

      {viewingTask && (
        <TaskViewModal
          key={viewingTask.id}
          task={viewingTask}
          onClose={() => setViewingTask(null)}
          onEdit={handleOpenEdit}
        />
      )}

      <EditModal
        key={editingTask?.id ?? 'closed'}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSave}
      />

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
