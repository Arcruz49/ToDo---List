import { SearchIcon, XIcon } from './Icons';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <SearchIcon className="w-3.5 h-3.5" />
      </span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Buscar..."
        className="
          w-full sm:w-52 pl-8 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
          transition-shadow
        "
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <XIcon className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
