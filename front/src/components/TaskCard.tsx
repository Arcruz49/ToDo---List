import type { Task, TaskStatus } from '../types';
import { TrashIcon, PencilIcon, ClockIcon } from './Icons';
import { resolveCardColor } from '../colors';

const TEXT_DARK = 'text-gray-800';

const PIN_COLORS = [
  '#ef4444',
  '#a855f7',
  '#3b82f6',
  '#22c55e',
  '#f97316',
  '#ec4899',
];

const ROTATIONS = [
  'note-rotate-1',
  'note-rotate-2',
  'note-rotate-3',
  'note-rotate-4',
  'note-rotate-5',
  'note-rotate-6',
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

type DueDateStatus =
  | { type: 'overdue'; days: number }
  | { type: 'today' }
  | { type: 'soon'; days: number }
  | { type: 'future'; formatted: string };

function getDueDateStatus(dueDate: string | null, status: TaskStatus): DueDateStatus | null {
  if (!dueDate || status === 'Completed') return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0) return { type: 'overdue', days: Math.abs(diffDays) };
  if (diffDays === 0) return { type: 'today' };
  if (diffDays <= 3) return { type: 'soon', days: diffDays };
  return { type: 'future', formatted: formatDate(dueDate) };
}

interface Props {
  task: Task;
  index: number;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, index, onView, onEdit, onDelete }: Props) {
  const color    = resolveCardColor(task.color, index);
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const pinColor = PIN_COLORS[index % PIN_COLORS.length];
  const dueStatus = getDueDateStatus(task.dueDate, task.status);
  const isOverdue = dueStatus?.type === 'overdue';

  return (
    <div
      className={`
        relative flex flex-col gap-3 px-5 pt-7 pb-3 rounded-sm cursor-pointer
        shadow-md hover:shadow-xl hover:scale-[1.03]
        transition-all duration-200 animate-fadeIn min-h-[210px]
        ${color} ${rotation}
        ${isOverdue ? 'ring-2 ring-red-500/40' : ''}
      `}
      onClick={() => onView(task)}
    >
      {/* Pin */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-md"
        style={{
          backgroundColor: pinColor,
          boxShadow: `0 2px 4px rgba(0,0,0,0.3), inset -1px -1px 2px rgba(0,0,0,0.2), inset 1px 1px 2px rgba(255,255,255,0.4)`,
        }}
      />

      {/* Overdue stamp */}
      {isOverdue && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-sm flex items-center justify-center">
          <div className="-rotate-[18deg] border-[3px] border-red-600 rounded px-3 py-0.5 opacity-25">
            <span className="text-red-600 text-lg font-black tracking-[0.25em] uppercase font-sans select-none">
              Vencida
            </span>
          </div>
        </div>
      )}

      <h3
        className={`font-handwritten text-2xl leading-tight line-clamp-2 ${TEXT_DARK} ${
          task.status === 'Completed' ? 'line-through opacity-50' : ''
        }`}
      >
        {task.title}
      </h3>

      {task.description && (
        <div
          className={`card-desc-preview font-handwritten text-lg leading-snug opacity-80 ${TEXT_DARK}`}
          dangerouslySetInnerHTML={{ __html: task.description }}
        />
      )}

      <div className="mt-auto pt-2 flex items-center justify-between border-t border-black/10">
        <span className={`flex items-center gap-1.5 text-xs ${TEXT_DARK} opacity-70`}>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8"  y1="2" x2="8"  y2="6" />
            <line x1="3"  y1="10" x2="21" y2="10" />
          </svg>
          {formatDate(task.createdAt)}
        </span>

        <div className="flex items-center gap-1">
          {dueStatus && (
            <span
              className={`flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded ${
                dueStatus.type === 'overdue'
                  ? 'text-red-700 bg-red-100/80'
                  : dueStatus.type === 'today'
                  ? 'text-orange-700 bg-orange-100/80 animate-pulse'
                  : dueStatus.type === 'soon'
                  ? 'text-orange-600 bg-orange-50/80'
                  : `${TEXT_DARK} opacity-60`
              }`}
            >
              <ClockIcon className="w-3 h-3 shrink-0" />
              {dueStatus.type === 'overdue'
                ? `${dueStatus.days}d atrasada`
                : dueStatus.type === 'today'
                ? 'Vence hoje!'
                : dueStatus.type === 'soon'
                ? `${dueStatus.days}d`
                : dueStatus.formatted}
            </span>
          )}

          <button
            onClick={e => { e.stopPropagation(); onEdit(task); }}
            className="w-7 h-7 rounded-md hover:bg-black/10 flex items-center justify-center transition-colors"
            title="Editar"
          >
            <PencilIcon className={`w-3.5 h-3.5 ${TEXT_DARK}`} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(task.id); }}
            className="w-7 h-7 rounded-md hover:bg-red-200 flex items-center justify-center transition-colors"
            title="Excluir"
          >
            <TrashIcon className={`w-3.5 h-3.5 ${TEXT_DARK}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
