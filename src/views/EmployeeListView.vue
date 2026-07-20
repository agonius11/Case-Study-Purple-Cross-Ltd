<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useEmployeesStore } from '@/stores/employees'
import { useSnackbar } from '@/composables/useSnackbar'
import { useEmployeeFilters, STATUS_OPTIONS } from '@/composables/useEmployeeFilters'
import { formatDate } from '@/utils/date'
import EmploymentStatusChip from '@/components/EmploymentStatusChip.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import type { Employee } from '@/types/employee'

const router = useRouter()
const store = useEmployeesStore()
const { employees, departments, occupations, count } = storeToRefs(store)
const snackbar = useSnackbar()

const { search, department, occupation, status, filtered, hasActiveFilter, clear } =
  useEmployeeFilters(employees)

const matchCount = computed(() => filtered.value.length)

const headers = [
  { title: 'Code', key: 'code', width: 110 },
  { title: 'Full Name', key: 'fullName' },
  { title: 'Occupation', key: 'occupation' },
  { title: 'Department', key: 'department' },
  { title: 'Date of Employment', key: 'dateOfEmployment' },
  { title: 'Termination Date', key: 'terminationDate' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const, width: 140 },
]

function createEmployee() {
  router.push({ name: 'employee-create' })
}

function viewEmployee(code: string) {
  router.push({ name: 'employee-profile', params: { code } })
}

function editEmployee(code: string) {
  router.push({ name: 'employee-profile', params: { code }, query: { edit: '1' } })
}

const deleteTarget = ref<Employee | null>(null)
const confirmOpen = ref(false)

function askDelete(employee: Employee) {
  deleteTarget.value = employee
  confirmOpen.value = true
}

function confirmDelete() {
  const target = deleteTarget.value
  if (!target) return
  store.remove(target.code)
  snackbar.success(`Employee ${target.code} deleted`)
  deleteTarget.value = null
}
</script>

<template>
  <v-card>
    <v-card-item>
      <v-card-title class="text-h6">Employees</v-card-title>
      <v-card-subtitle>
        <template v-if="hasActiveFilter">{{ matchCount }} of {{ count }} shown</template>
        <template v-else>{{ count }} {{ count === 1 ? 'record' : 'records' }} on file</template>
      </v-card-subtitle>
    </v-card-item>

    <v-divider />

    <div class="pa-4">
      <v-row dense align="center">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            placeholder="Search name, code, occupation"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="4" md="3">
          <v-select
            v-model="department"
            :items="departments"
            label="Department"
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="4" md="3">
          <v-select
            v-model="occupation"
            :items="occupations"
            label="Occupation"
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="4" md="2">
          <v-select
            v-model="status"
            :items="STATUS_OPTIONS"
            label="Status"
            clearable
            hide-details
          />
        </v-col>
      </v-row>
      <div v-if="hasActiveFilter" class="d-flex justify-end mt-2">
        <v-btn
          variant="text"
          size="small"
          prepend-icon="mdi-filter-remove-outline"
          @click="clear"
        >
          Clear filters
        </v-btn>
      </div>
    </div>

    <v-divider />

    <v-data-table
      :headers="headers"
      :items="filtered"
      item-value="code"
      :items-per-page="10"
      :items-per-page-options="[10, 25, 50, 100]"
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
            @click="askDelete(item)"
          />
        </div>
      </template>

      <template #no-data>
        <div class="text-center text-medium-emphasis py-8">
          <v-icon icon="mdi-account-search-outline" size="40" class="mb-2" />
          <div class="text-body-2">
            <template v-if="hasActiveFilter">No employees match the current filters.</template>
            <template v-else>No employees yet.</template>
          </div>
          <v-btn
            v-if="hasActiveFilter"
            class="mt-3"
            variant="text"
            size="small"
            prepend-icon="mdi-filter-remove-outline"
            @click="clear"
          >
            Clear filters
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>

  <ConfirmDialog
    v-model="confirmOpen"
    title="Delete employee?"
    confirm-text="Delete"
    confirm-color="error"
    @confirm="confirmDelete"
  >
    <template v-if="deleteTarget">
      This will permanently remove <strong>{{ deleteTarget.fullName }}</strong>
      ({{ deleteTarget.code }}) from the directory. This action cannot be undone.
    </template>
  </ConfirmDialog>

  <v-btn
    class="create-fab"
    color="primary"
    size="large"
    elevation="6"
    prepend-icon="mdi-plus"
    @click="createEmployee"
  >
    Create employee
  </v-btn>
</template>

<style scoped>
.create-fab {
  position: fixed;
  right: max(24px, env(safe-area-inset-right));
  bottom: calc(24px + env(safe-area-inset-bottom));
  z-index: 100;
  border-radius: 999px;
}
</style>
