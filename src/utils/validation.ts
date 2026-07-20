// Pure validators returning an error message, or null when the value is valid.
// The form adapts these into Vuetify rules; keeping them pure makes them easy
// to unit test.

const CODE_PATTERN = /^EMP\d{3,}$/

export function required(value: string | null | undefined, label = 'This field'): string | null {
  return value && value.trim().length > 0 ? null : `${label} is required`
}

export function validateCode(value: string | null | undefined): string | null {
  const missing = required(value, 'Code')
  if (missing) return missing
  return CODE_PATTERN.test((value as string).trim())
    ? null
    : 'Use the format EMP followed by at least 3 digits (e.g. EMP051)'
}

export function isCodeUnique(value: string, existingCodes: string[]): boolean {
  const normalized = value.trim().toLowerCase()
  return !existingCodes.some((code) => code.toLowerCase() === normalized)
}

export function validateFullName(value: string | null | undefined): string | null {
  const missing = required(value, 'Full name')
  if (missing) return missing
  const trimmed = (value as string).trim()
  if (trimmed.length < 2) return 'Full name must be at least 2 characters'
  return /^[A-Za-z .'-]+$/.test(trimmed)
    ? null
    : 'Use letters, spaces, periods, apostrophes, or hyphens only'
}

export function validateDate(value: string | null | undefined): string | null {
  if (!value) return null
  return Number.isNaN(new Date(value).getTime()) ? 'Enter a valid date' : null
}

export function validateTerminationOrder(
  dateOfEmployment: string | null | undefined,
  terminationDate: string | null | undefined,
): string | null {
  if (!terminationDate || !dateOfEmployment) return null
  const start = new Date(dateOfEmployment).getTime()
  const end = new Date(terminationDate).getTime()
  if (Number.isNaN(start) || Number.isNaN(end)) return null
  return end >= start ? null : 'Termination date must be on or after the employment date'
}
