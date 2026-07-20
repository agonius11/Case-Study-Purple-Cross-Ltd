<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useEmployeesStore } from '@/stores/employees'
import { useSnackbar } from '@/composables/useSnackbar'
import { formatDate } from '@/utils/date'
import EmploymentStatusChip from '@/components/EmploymentStatusChip.vue'
import type { Employee } from '@/types/employee'

const router = useRouter()
const store = useEmployeesStore()
const { employees, count } = storeToRefs(store)
const snackbar = useSnackbar()

const headers = [
  { title: 'Code', key: 'code', width: 110 },
  { title: 'Full Name', key: 'fullName' },
  { title: 'Occupation', key: 'occupation' },
  { title: 'Department', key: 'department' },
  { title: 'Date of Employment', key: 'dateOfEmployment' },
  { title: 'Termination Date', key: 'terminationDate' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const, width: 140 },
]

function viewEmployee(code: string) {
  router.push({ name: 'employee-profile', params: { code } })
}

function editEmployee(code: string) {
  router.push({ name: 'employee-profile', params: { code }, query: { edit: '1' } })
}

// Deletion is immediate for now; a confirmation dialog is added in a later phase.
function deleteEmployee(employee: Employee) {
  store.remove(employee.code)
  snackbar.success(`Employee ${employee.code} deleted`)
}
</script>

<template>
  <v-card>
    <v-card-item>
      <v-card-title class="text-h6">Employees</v-card-title>
      <v-card-subtitle>{{ count }} {{ count === 1 ? 'record' : 'records' }} on file</v-card-subtitle>
    </v-card-item>

    <v-divider />

    <v-data-table
      :headers="headers"
      :items="employees"
      item-value="code"
      hover
      density="comfortable"
    >
      <template #[`item.dateOfEmployment`]="{ item }">
        <div class="d-flex align-center ga-2">
          <EmploymentStatusChip :date="item.dateOfEmployment" kind="employment" />
          <span v-if="item.dateOfEmployment" class="text-caption text-medium-emphasis">
            {{ formatDate(item.dateOfEmployment) }}
          </span>
        </div>
      </template>

      <template #[`item.terminationDate`]="{ item }">
        <div class="d-flex align-center ga-2">
          <EmploymentStatusChip :date="item.terminationDate" kind="termination" />
          <span v-if="item.terminationDate" class="text-caption text-medium-emphasis">
            {{ formatDate(item.terminationDate) }}
          </span>
        </div>
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="d-flex justify-end ga-1">
          <v-btn
            icon="mdi-eye-outline"
            size="small"
            variant="text"
            title="View profile"
            aria-label="View profile"
            @click="viewEmployee(item.code)"
          />
          <v-btn
            icon="mdi-pencil-outline"
            size="small"
            variant="text"
            title="Edit"
            aria-label="Edit"
            @click="editEmployee(item.code)"
          />
          <v-btn
            icon="mdi-delete-outline"
            size="small"
            variant="text"
            color="error"
            title="Delete"
            aria-label="Delete"
            @click="deleteEmployee(item)"
          />
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>
