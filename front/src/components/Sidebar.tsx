import type { ReactNode } from 'react';
import type { FilterStatus } from '../types';
import { SunIcon, MoonIcon } from './Icons';

const CheckSquareIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const LayersIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const NAV_ITEMS: { filter: FilterStatus; label: string; icon: ReactNode }[] = [
  { filter: 'all',        label: 'Todas as tarefas', icon: <LayersIcon /> },
  { filter: 'Pending',    label: 'Pendentes',         icon: <ClockIcon /> },
  { filter: 'InProgress', label: 'Em andamento',      icon: <CheckSquareIcon /> },
  { filter: 'Completed',  label: 'Concluídas',        icon: <CheckSquareIcon /> },
];

interface Props {
  filter: FilterStatus;
  onFilter: (f: FilterStatus) => void;
  dark: boolean;
  onToggleDark: () => void;
  taskCounts: Record<FilterStatus, number>;
}

export default function Sidebar({ filter, onFilter, dark, onToggleDark, taskCounts }: Props) {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen bg-[#1a1625] text-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="w-7 h-7 rounded-lg bg-violet-500 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <span className="font-bold text-base tracking-tight">ToDo Notes</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const active = filter === item.filter;
          return (
            <button
              key={item.filter}
              onClick={() => onFilter(item.filter)}
              className={`
                w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-colors text-left
                ${active
                  ? 'bg-violet-600 text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }
              `}
            >
              <span className="flex items-center gap-3">
                <span className={active ? 'text-white' : 'text-white/40'}>{item.icon}</span>
                {item.label}
              </span>
              <span className={`text-xs tabular-nums ${active ? 'text-white/80' : 'text-white/30'}`}>
                {taskCounts[item.filter]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-xs text-white/40 font-medium">
          {dark ? 'Modo escuro' : 'Modo claro'}
        </span>
        <button
          onClick={onToggleDark}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </aside>
  );
}
