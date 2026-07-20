<script setup lang="ts">
import { computed } from 'vue'
import { employmentStatus, terminationStatus } from '@/utils/employeeStatus'
import type { EmployeeStatus } from '@/types/employee'

const props = defineProps<{
  date: string | null
  kind: 'employment' | 'termination'
}>()

const status = computed<EmployeeStatus | null>(() =>
  props.kind === 'employment' ? employmentStatus(props.date) : terminationStatus(props.date),
)

// An employee with no termination date is still active; an employee with no
// employment date simply has nothing to show.
const isActive = computed(() => props.kind === 'termination' && props.date === null)

const color = computed(() => {
  switch (status.value) {
    case 'Currently employed':
      return 'success'
    case 'Employed soon':
      return 'info'
    case 'To be terminated':
      return 'warning'
    case 'Terminated':
      return 'secondary'
    default:
      return isActive.value ? 'success' : undefined
  }
})
</script>

<template>
  <v-chip v-if="status" :color="color" size="small" variant="tonal" label>
    {{ status }}
  </v-chip>
  <v-chip v-else-if="isActive" color="success" size="small" variant="tonal" label>
    Active
  </v-chip>
  <span v-else class="text-medium-emphasis">—</span>
</template>
