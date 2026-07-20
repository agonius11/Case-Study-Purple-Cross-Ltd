export function formatDate(isoDate: string | null): string {
  if (!isoDate) return '—'
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}
