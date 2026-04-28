import type { ReactNode } from 'react';
import { CheckIcon, XIcon } from './Icons';
import type { Toast } from '../hooks/useToast';

const CONFIG: Record<string, { bar: string; icon: ReactNode }> = {
  success: {
    bar: 'bg-emerald-500',
    icon: <CheckIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
  },
  error: {
    bar: 'bg-red-500',
    icon: <XIcon className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />,
  },
  info: {
    bar: 'bg-blue-500',
    icon: (
      <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
};

interface Props {
  toasts: Toast[];
  dismiss: (id: number) => void;
}

export default function ToastContainer({ toasts, dismiss }: Props) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => {
        const cfg = CONFIG[t.type];
        return (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={`
              relative flex items-center gap-3 pl-4 pr-5 py-3 rounded-lg
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-700
              shadow-lg pointer-events-auto cursor-pointer
              overflow-hidden min-w-[220px] max-w-xs
              ${t.leaving ? 'toast-out' : 'toast-in'}
            `}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.bar}`} />
            <span className="shrink-0">{cfg.icon}</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
