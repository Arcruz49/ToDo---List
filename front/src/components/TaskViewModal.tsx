import type { Task } from '../types';
import { XIcon, PencilIcon } from './Icons';

const STATUS = {
  Pending:    { label: 'Pendente',     cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  InProgress: { label: 'Em andamento', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  Completed:  { label: 'Concluída',    cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
} as const;

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

interface Props {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

export default function TaskViewModal({ task, onClose, onEdit }: Props) {
  const status = STATUS[task.status] ?? STATUS.Pending;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="animate-scaleIn w-full sm:max-w-2xl bg-white dark:bg-gray-950 rounded-t-2xl sm:rounded-2xl border-0 sm:border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.cls}`}>
            {status.label}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onClose(); onEdit(task); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors"
            >
              <PencilIcon className="w-3 h-3" />
              Editar
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          <div className="px-6 py-5 flex flex-col gap-4">
            <h2 className={`font-handwritten text-3xl sm:text-4xl text-gray-900 dark:text-white leading-tight ${task.status === 'Completed' ? 'line-through opacity-50' : ''}`}>
              {task.title}
            </h2>

            {task.description ? (
              <div
                className="prose-view text-gray-700 dark:text-gray-300 text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: task.description }}
              />
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-600 italic">Sem descrição</p>
            )}

            <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
              <span>Criada em {fmtDate(task.createdAt)}</span>
              {task.concludedAt && (
                <span>Concluída em {fmtDate(task.concludedAt)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
