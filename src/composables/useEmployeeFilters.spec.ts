import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useEmployeeFilters } from './useEmployeeFilters'
import type { Employee } from '@/types/employee'

function isoOffsetDays(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const employees: Employee[] = [
  {
    code: 'EMP001',
    fullName: 'Alice Adams',
    occupation: 'Chemist',
    department: 'Research',
    dateOfEmployment: isoOffsetDays(-400),
    terminationDate: null,
  },
  {
    code: 'EMP002',
    fullName: 'Bob Brown',
    occupation: 'IT Support',
    department: 'IT',
    dateOfEmployment: isoOffsetDays(-400),
    terminationDate: isoOffsetDays(400),
  },
]

describe('useEmployeeFilters', () => {
  it('returns everything when no filter is active', () => {
    const { filtered, hasActiveFilter } = useEmployeeFilters(ref(employees))
    expect(filtered.value).toHaveLength(2)
    expect(hasActiveFilter.value).toBe(false)
  })

  it('searches across name, code and occupation', () => {
    const { search, filtered } = useEmployeeFilters(ref(employees))
    search.value = 'chemist'
    expect(filtered.value.map((e) => e.code)).toEqual(['EMP001'])
  })

  it('filters by department', () => {
    const { department, filtered, hasActiveFilter } = useEmployeeFilters(ref(employees))
    department.value = 'IT'
    expect(filtered.value.map((e) => e.code)).toEqual(['EMP002'])
    expect(hasActiveFilter.value).toBe(true)
  })

  it('filters by derived status', () => {
    const { status, filtered } = useEmployeeFilters(ref(employees))
    status.value = 'To be terminated'
    expect(filtered.value.map((e) => e.code)).toEqual(['EMP002'])
  })

  it('clears all filters', () => {
    const { search, department, clear, hasActiveFilter } = useEmployeeFilters(ref(employees))
    search.value = 'x'
    department.value = 'IT'
    clear()
    expect(hasActiveFilter.value).toBe(false)
  })
})
