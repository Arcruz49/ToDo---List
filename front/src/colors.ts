export interface NoteColor {
  id: string;
  label: string;
  card: string;       // Tailwind bg class for the card
  swatch: string;     // inline bg color for the picker circle
}

export const NOTE_COLORS: NoteColor[] = [
  { id: 'yellow', label: 'Amarelo', card: 'bg-yellow-200 dark:bg-yellow-300', swatch: '#fde68a' },
  { id: 'green',  label: 'Verde',   card: 'bg-green-200  dark:bg-green-300',  swatch: '#bbf7d0' },
  { id: 'pink',   label: 'Rosa',    card: 'bg-pink-200   dark:bg-pink-300',   swatch: '#fbcfe8' },
  { id: 'blue',   label: 'Azul',    card: 'bg-blue-200   dark:bg-blue-300',   swatch: '#bfdbfe' },
  { id: 'violet', label: 'Roxo',    card: 'bg-violet-200 dark:bg-violet-300', swatch: '#ddd6fe' },
  { id: 'orange', label: 'Laranja', card: 'bg-orange-200 dark:bg-orange-300', swatch: '#fed7aa' },
];

export const DEFAULT_COLOR = NOTE_COLORS[0];

export function resolveCardColor(colorId: string, fallbackIndex = 0): string {
  const found = NOTE_COLORS.find(c => c.id === colorId);
  if (found) return found.card;
  // graceful fallback if API returns unknown value
  return NOTE_COLORS[fallbackIndex % NOTE_COLORS.length].card;
}
