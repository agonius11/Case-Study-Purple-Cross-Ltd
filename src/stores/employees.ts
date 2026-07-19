import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import seed from '@/data/employees.json'
import type { Employee } from '@/types/employee'

const STORAGE_KEY = 'pc.employees.v1'

function loadFromStorage(): Employee[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Employee[]) : null
  } catch {
    return null
  }
}

function saveToStorage(employees: Employee[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees))
  } catch {
    // Storage may be unavailable; in-memory state still works for the session.
  }
}

function sortedUnique(values: string[]): string[] {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  )
}

export const useEmployeesStore = defineStore('employees', () => {
  const employees = ref<Employee[]>(loadFromStorage() ?? (seed as Employee[]))

  // Persist on any change so edits survive a page refresh (no backend).
  watch(employees, (value) => saveToStorage(value), { deep: true })

  const departments = computed(() => sortedUnique(employees.value.map((e) => e.department)))
  const occupations = computed(() => sortedUnique(employees.value.map((e) => e.occupation)))
  const count = computed(() => employees.value.length)

  function byCode(code: string): Employee | undefined {
    return employees.value.find((e) => e.code === code)
  }

  function exists(code: string): boolean {
    return employees.value.some((e) => e.code === code)
  }

  function add(employee: Employee): void {
    employees.value.push(employee)
  }

  function update(code: string, patch: Partial<Omit<Employee, 'code'>>): void {
    const index = employees.value.findIndex((e) => e.code === code)
    if (index === -1) return
    employees.value[index] = { ...employees.value[index], ...patch } as Employee
  }

  function remove(code: string): void {
    employees.value = employees.value.filter((e) => e.code !== code)
  }

  function replaceAll(next: Employee[]): void {
    employees.value = [...next]
  }

  function resetToSeed(): void {
    employees.value = [...(seed as Employee[])]
  }

  return {
    employees,
    departments,
    occupations,
    count,
    byCode,
    exists,
    add,
    update,
    remove,
    replaceAll,
    resetToSeed,
  }
})
