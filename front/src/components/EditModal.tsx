import { useState } from 'react';
import { XIcon, CalendarIcon } from './Icons';
import ColorPicker from './ColorPicker';
import RichTextEditor from './RichTextEditor';
import { DEFAULT_COLOR } from '../colors';
import type { Task, TaskStatus, UpdateTaskPayload } from '../types';

const STATUS_OPTIONS: { value: TaskStatus; label: string; dot: string }[] = [
  { value: 'Pending',    label: 'Pendente',     dot: 'bg-amber-400'   },
  { value: 'InProgress', label: 'Em andamento', dot: 'bg-blue-500'    },
  { value: 'Completed',  label: 'Concluída',    dot: 'bg-emerald-500' },
];

const TODAY = new Date().toISOString().split('T')[0];

interface Props {
  task: Task | null;
  onClose: () => void;
  onSave: (payload: UpdateTaskPayload) => Promise<void>;
}

export default function EditModal({ task, onClose, onSave }: Props) {
  const [title,   setTitle]   = useState(task?.title ?? '');
  const [desc,    setDesc]    = useState(task?.description ?? '');
  const [status,  setStatus]  = useState<TaskStatus>(task?.status ?? 'Pending');
  const [color,   setColor]   = useState(task?.color || DEFAULT_COLOR.id);
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split('T')[0] : '');
  const [saving,  setSaving]  = useState(false);

  if (!task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setSaving(true);
      await onSave({
        id: task.id,
        title: title.trim(),
        description: desc,
        status,
        color,
        dueDate: dueDate || null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="animate-scaleIn w-full sm:max-w-2xl bg-white dark:bg-gray-950 rounded-t-2xl sm:rounded-2xl border-0 sm:border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Editar tarefa</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 py-4 flex flex-col gap-4 overflow-y-auto flex-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Título</label>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={120}
                className="
                  w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                  bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm
                  focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                  transition-shadow
                "
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Descrição</label>
              <RichTextEditor
                value={desc}
                onChange={setDesc}
                placeholder="Descrição (opcional)"
              />
            </div>

            <ColorPicker value={color} onChange={setColor} />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Data de vencimento
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={dueDate}
                  min={TODAY}
                  onChange={e => setDueDate(e.target.value)}
                  className="
                    w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                    bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm
                    focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                    transition-shadow
                  "
                />
              </div>
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setDueDate('')}
                  className="self-start text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  Remover vencimento
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Status</label>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`
                      flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold border transition-all
                      ${status === opt.value
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex gap-2 justify-end shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim() || saving}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
