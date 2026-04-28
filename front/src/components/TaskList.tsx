import type { Task } from '../types';
import TaskCard from './TaskCard';

interface Props {
  tasks: Task[];
  loading: boolean;
  query: string;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function Skeleton() {
  return (
    <div className="rounded-2xl bg-yellow-100 dark:bg-gray-800 animate-pulse flex flex-col gap-3 p-4 h-44">
      <div className="h-4 w-3/4 rounded-lg bg-yellow-200/60 dark:bg-gray-700" />
      <div className="h-3 w-full rounded-lg bg-yellow-200/60 dark:bg-gray-700" />
      <div className="h-3 w-2/3 rounded-lg bg-yellow-200/60 dark:bg-gray-700" />
      <div className="mt-auto h-6 w-20 rounded-full bg-yellow-200/80 dark:bg-gray-700" />
    </div>
  );
}

export default function TaskList({ tasks, loading, query, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg className="w-7 h-7 text-gray-300 dark:text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {query ? 'Nenhum resultado encontrado' : 'Nenhuma tarefa aqui ainda'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
            {query ? `Sem correspondência para "${query}"` : 'Crie uma nova tarefa para começar'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tasks.map((task, i) => (
        <TaskCard key={task.id} task={task} index={i} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
