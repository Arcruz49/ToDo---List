import { useDraggable } from '@dnd-kit/core';
import type { Task } from '../types';
import { PencilIcon, TrashIcon } from './Icons';
import { resolveCardColor } from '../colors';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

const CalIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8"  y1="2" x2="8"  y2="6" />
    <line x1="3"  y1="10" x2="21" y2="10" />
  </svg>
);

interface CardContentProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  elevated?: boolean;
}

function CardContent({ task, onEdit, onDelete, elevated = false }: CardContentProps) {
  const color = resolveCardColor(task.color, 0);
  return (
    <div className={`
      ${color} rounded-xl p-3 select-none
      ${elevated ? 'shadow-2xl rotate-2 scale-105' : 'shadow-sm'}
    `}>
      <h3 className={`font-handwritten text-xl leading-tight line-clamp-2 text-gray-800 ${task.status === 'Completed' ? 'line-through opacity-50' : ''}`}>
        {task.title}
      </h3>

      {task.description && (
        <div
          className="card-desc-preview font-handwritten text-base leading-snug opacity-75 text-gray-800 mt-1.5"
          dangerouslySetInnerHTML={{ __html: task.description }}
        />
      )}

      <div className="mt-2 pt-2 border-t border-black/10 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-gray-700 opacity-60">
          <CalIcon />
          {formatDate(task.createdAt)}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onEdit(task); }}
            className="w-6 h-6 rounded hover:bg-black/10 flex items-center justify-center transition-colors"
            title="Editar"
          >
            <PencilIcon className="w-3 h-3 text-gray-700" />
          </button>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onDelete(task.id); }}
            className="w-6 h-6 rounded hover:bg-red-200 flex items-center justify-center transition-colors"
            title="Excluir"
          >
            <TrashIcon className="w-3 h-3 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function KanbanCard({ task, onView, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => { if (!isDragging) onView(task); }}
      className={`cursor-grab active:cursor-grabbing transition-all duration-150 ${isDragging ? '' : 'hover:-translate-y-0.5 hover:shadow-md'}`}
    >
      {isDragging
        ? <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white/30 dark:bg-white/5 h-16" />
        : <CardContent task={task} onEdit={onEdit} onDelete={onDelete} />
      }
    </div>
  );
}

/* Used inside DragOverlay — no hook needed */
export function KanbanCardOverlay({ task, onEdit, onDelete }: Omit<Props, 'onView'>) {
  return (
    <div className="cursor-grabbing">
      <CardContent task={task} onEdit={onEdit} onDelete={onDelete} elevated />
    </div>
  );
}
