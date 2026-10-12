import type { Kind } from '../types/database'

export const kinds: { value: Kind; label: string; short: string; note: string }[] = [
  { value: 'trip', label: 'Student trips', short: 'Trips', note: 'Istanbul, Cappadocia, Antalya' },
  { value: 'study', label: 'Study and university', short: 'Study', note: 'Campus visits and admission help' },
  { value: 'summer', label: 'Summer programs', short: 'Summer', note: 'Language courses and long stays' },
]

export const kindLabel = Object.fromEntries(kinds.map((item) => [item.value, item.label])) as Record<Kind, string>
