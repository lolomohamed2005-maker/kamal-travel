const photo = (id: string, width = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`

export const siteImages = [
  { key: 'hero_image', label: 'Homepage hero', fallback: photo('1695415683093-ae5f213ea898', 2000) },
  { key: 'kind_trip_image', label: 'Card: Student trips', fallback: photo('1623621534850-d325a1980c7e') },
  { key: 'kind_study_image', label: 'Card: Study and university', fallback: photo('1790098979193-1ab0a7e53f63') },
  { key: 'kind_summer_image', label: 'Card: Summer programs', fallback: photo('1582588677647-1a38fd18fd21') },
  { key: 'cta_image', label: 'Bottom banner', fallback: photo('1636537511494-c3e558e0702b', 2000) },
]

export function resolveSiteImage(settings: Record<string, string>, key: string) {
  const custom = settings[key]
  if (custom) return custom
  return siteImages.find((item) => item.key === key)?.fallback ?? ''
}
