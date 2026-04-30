import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import type { Task, TaskStatus } from '../types';
import KanbanCard, { KanbanCardOverlay } from './KanbanCard';

const COLUMNS: { status: TaskStatus; label: string; dot: string; ring: string }[] = [
  { status: 'Pending',    label: 'Pendente',     dot: 'bg-amber-400',   ring: 'border-amber-400'   },
  { status: 'InProgress', label: 'Em andamento', dot: 'bg-blue-500',    ring: 'border-blue-500'    },
  { status: 'Completed',  label: 'Concluída',    dot: 'bg-emerald-500', ring: 'border-emerald-500' },
];

interface ColumnProps {
  status: TaskStatus;
  label: string;
  dot: string;
  ring: string;
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function KanbanColumn({ status, label, dot, ring, tasks, onView, onEdit, onDelete }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col min-w-[260px] w-72 flex-shrink-0">
      {/* Column header */}
      <div className={`flex items-center gap-2 px-1 mb-3 pb-3 border-b-2 ${ring}`}>
        <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
        <span className="ml-auto text-xs font-medium text-gray-400 dark:text-gray-500 tabular-nums bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 flex flex-col gap-2 rounded-xl min-h-[120px] p-2 transition-colors
          ${isOver
            ? 'bg-gray-100/80 dark:bg-gray-800/60 ring-2 ring-inset ring-gray-300 dark:ring-gray-600'
            : 'bg-gray-100/30 dark:bg-gray-800/20'
          }
        `}
      >
        {tasks.map(task => (
          <KanbanCard
            key={task.id}
            task={task}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}

        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-gray-400 dark:text-gray-600 italic">Solte aqui</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
}

export default function KanbanBoard({ tasks, onView, onEdit, onDelete, onStatusChange }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 6 } }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find(t => t.id === active.id) ?? null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    if (!over) return;
    const task = tasks.find(t => t.id === active.id);
    if (!task) return;
    const newStatus = over.id as TaskStatus;
    if (task.status !== newStatus) {
      onStatusChange(task.id, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto overflow-y-hidden pb-1">
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.status}
            {...col}
            tasks={tasks.filter(t => t.status === col.status)}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask && (
          <KanbanCardOverlay task={activeTask} onEdit={onEdit} onDelete={onDelete} />
        )}
      </DragOverlay>
    </DndContext>
  );
}
