import { NOTE_COLORS } from '../colors';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export default function ColorPicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Cor do card</label>
      <div className="flex gap-2 flex-wrap">
        {NOTE_COLORS.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            title={c.label}
            className={`
              w-7 h-7 rounded-full border-2 transition-all
              ${value === c.id
                ? 'border-gray-800 dark:border-white scale-110 shadow-md'
                : 'border-transparent hover:scale-105'
              }
            `}
            style={{ backgroundColor: c.swatch }}
          />
        ))}
      </div>
    </div>
  );
}
