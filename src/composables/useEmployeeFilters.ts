import { computed, ref, type Ref } from 'vue'
import { employmentStatus, terminationStatus } from '@/utils/employeeStatus'
import type { Employee, EmployeeStatus } from '@/types/employee'

export const STATUS_OPTIONS: EmployeeStatus[] = [
  'Currently employed',
  'Employed soon',
  'To be terminated',
  'Terminated',
]

export function useEmployeeFilters(employees: Ref<Employee[]>) {
  const search = ref('')
  const department = ref<string | null>(null)
  const occupation = ref<string | null>(null)
  const status = ref<EmployeeStatus | null>(null)

  function matchesStatus(employee: Employee, target: EmployeeStatus): boolean {
    return (
      employmentStatus(employee.dateOfEmployment) === target ||
      terminationStatus(employee.terminationDate) === target
    )
  }

  const filtered = computed(() => {
    const term = search.value.trim().toLowerCase()
    return employees.value.filter((employee) => {
      if (term) {
        const haystack =
          `${employee.code} ${employee.fullName} ${employee.occupation}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      if (department.value && employee.department !== department.value) return false
      if (occupation.value && employee.occupation !== occupation.value) return false
      if (status.value && !matchesStatus(employee, status.value)) return false
      return true
    })
  })

  const hasActiveFilter = computed(
    () =>
      search.value.trim() !== '' ||
      department.value !== null ||
      occupation.value !== null ||
      status.value !== null,
  )

  function clear() {
    search.value = ''
    department.value = null
    occupation.value = null
    status.value = null
  }

  return { search, department, occupation, status, filtered, hasActiveFilter, clear }
}
