import type { Employee } from '@/types/employee'

export interface ParseResult {
  valid: Employee[]
  invalidCount: number
}

export interface MergePreview {
  added: number
  updated: number
}

const CODE_PATTERN = /^EMP\d{3,}$/

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isNullableString(value: unknown): value is string | null | undefined {
  return value === null || value === undefined || typeof value === 'string'
}

function toEmployee(input: unknown): Employee | null {
  if (!input || typeof input !== 'object') return null
  const obj = input as Record<string, unknown>
  if (!isNonEmptyString(obj.code) || !CODE_PATTERN.test(obj.code.trim())) return null
  if (!isNonEmptyString(obj.fullName)) return null
  if (!isNonEmptyString(obj.occupation)) return null
  if (!isNonEmptyString(obj.department)) return null
  if (!isNullableString(obj.dateOfEmployment) || !isNullableString(obj.terminationDate)) return null
  return {
    code: obj.code.trim(),
    fullName: obj.fullName.trim(),
    occupation: obj.occupation.trim(),
    department: obj.department.trim(),
    dateOfEmployment: obj.dateOfEmployment ? String(obj.dateOfEmployment) : null,
    terminationDate: obj.terminationDate ? String(obj.terminationDate) : null,
  }
}

export function parseEmployeesJson(text: string): ParseResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('The file is not valid JSON.')
  }
  if (!Array.isArray(parsed)) {
    throw new Error('Expected a JSON array of employees.')
  }
  const valid: Employee[] = []
  let invalidCount = 0
  for (const entry of parsed) {
    const employee = toEmployee(entry)
    if (employee) valid.push(employee)
    else invalidCount++
  }
  return { valid, invalidCount }
}

export function previewMerge(current: Employee[], incoming: Employee[]): MergePreview {
  const codes = new Set(current.map((e) => e.code))
  let added = 0
  let updated = 0
  for (const employee of incoming) {
    if (codes.has(employee.code)) updated++
    else added++
  }
  return { added, updated }
}

export function mergeByCode(current: Employee[], incoming: Employee[]): Employee[] {
  const map = new Map(current.map((e) => [e.code, e]))
  for (const employee of incoming) map.set(employee.code, employee)
  return [...map.values()]
}

const CSV_COLUMNS: (keyof Employee)[] = [
  'code',
  'fullName',
  'occupation',
  'department',
  'dateOfEmployment',
  'terminationDate',
]

function csvCell(value: string | null): string {
  const text = value ?? ''
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function toCsv(employees: Employee[]): string {
  const header = CSV_COLUMNS.join(',')
  const rows = employees.map((e) => CSV_COLUMNS.map((col) => csvCell(e[col])).join(','))
  return [header, ...rows].join('\n')
}

export function toJson(employees: Employee[]): string {
  return JSON.stringify(employees, null, 2)
}

export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
