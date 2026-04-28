import type { Task } from '../types';
import { TrashIcon, PencilIcon } from './Icons';
import { resolveCardColor } from '../colors';

const TEXT_DARK = 'text-gray-800';

const PIN_COLORS = [
  '#ef4444', // red
  '#a855f7', // purple
  '#3b82f6', // blue
  '#22c55e', // green
  '#f97316', // orange
  '#ec4899', // pink
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

interface Props {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, index, onEdit, onDelete }: Props) {
  const color    = resolveCardColor(task.color, index);
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const pinColor = PIN_COLORS[index % PIN_COLORS.length];

  return (
    <div
      className={`
        relative flex flex-col gap-3 px-5 pt-7 pb-3 rounded-sm cursor-pointer
        shadow-md hover:shadow-xl hover:scale-[1.03]
        transition-all duration-200 animate-fadeIn min-h-[210px]
        ${color} ${rotation}
      `}
      onClick={() => onEdit(task)}
    >
      {/* Pin no topo */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-md"
        style={{
          backgroundColor: pinColor,
          boxShadow: `0 2px 4px rgba(0,0,0,0.3), inset -1px -1px 2px rgba(0,0,0,0.2), inset 1px 1px 2px rgba(255,255,255,0.4)`,
        }}
      />

      {/* Título com fonte handwritten */}
      <h3
        className={`font-handwritten text-2xl leading-tight line-clamp-2 ${TEXT_DARK} ${
          task.status === 'Completed' ? 'line-through opacity-50' : ''
        }`}
      >
        {task.title}
      </h3>

      {/* Descrição */}
      {task.description && (
        <p className={`font-handwritten text-lg leading-snug line-clamp-3 opacity-80 ${TEXT_DARK}`}>
          {task.description}
        </p>
      )}

      {/* Rodapé: data + botões */}
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
