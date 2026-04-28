import type { ReactNode } from 'react';
import type { FilterStatus } from '../types';

const HomeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

interface Props {
  filter: FilterStatus;
  onFilter: (f: FilterStatus) => void;
  onNew: () => void;
}

const TABS: { filter: FilterStatus; label: string; icon: ReactNode }[] = [
  { filter: 'all',      label: 'Todas',    icon: <HomeIcon /> },
  { filter: 'Pending',  label: 'Pendentes',icon: <ClockIcon /> },
  { filter: 'Completed',label: 'Concluídas',icon: <CheckIcon /> },
];

export default function BottomNav({ filter, onFilter, onNew }: Props) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around px-2 h-16 safe-area-inset-bottom">
      {TABS.slice(0, 2).map(tab => (
        <button
          key={tab.filter}
          onClick={() => onFilter(tab.filter)}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg text-[10px] font-medium transition-colors ${
            filter === tab.filter
              ? 'text-violet-600 dark:text-violet-400'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}

      {/* Center add button */}
      <button
        onClick={onNew}
        className="w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-700 flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-violet-900 transition-colors -mt-5"
      >
        <PlusIcon />
      </button>

      {TABS.slice(2).map(tab => (
        <button
          key={tab.filter}
          onClick={() => onFilter(tab.filter)}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg text-[10px] font-medium transition-colors ${
            filter === tab.filter
              ? 'text-violet-600 dark:text-violet-400'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}

      {/* InProgress placeholder to keep spacing */}
      <button
        onClick={() => onFilter('InProgress')}
        className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg text-[10px] font-medium transition-colors ${
          filter === 'InProgress'
            ? 'text-violet-600 dark:text-violet-400'
            : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        Andamento
      </button>
    </nav>
  );
}
