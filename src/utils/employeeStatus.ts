import type { EmploymentStatus, TerminationStatus } from '@/types/employee'

// Compare an ISO date against today at day resolution, ignoring the time of day.
// Returns null when the value is missing or unparseable.
function isInFuture(isoDate: string | null): boolean | null {
  if (!isoDate) return null
  const target = new Date(isoDate)
  if (Number.isNaN(target.getTime())) return null
  target.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return target.getTime() > today.getTime()
}

export function employmentStatus(dateOfEmployment: string | null): EmploymentStatus | null {
  const future = isInFuture(dateOfEmployment)
  if (future === null) return null
  return future ? 'Employed soon' : 'Currently employed'
}

export function terminationStatus(terminationDate: string | null): TerminationStatus | null {
  const future = isInFuture(terminationDate)
  if (future === null) return null
  return future ? 'To be terminated' : 'Terminated'
}
