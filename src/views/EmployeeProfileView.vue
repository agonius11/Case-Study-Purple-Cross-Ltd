<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeesStore } from '@/stores/employees'
import { useSnackbar } from '@/composables/useSnackbar'
import { formatDate } from '@/utils/date'
import EmploymentStatusChip from '@/components/EmploymentStatusChip.vue'
import EmployeeForm from '@/components/EmployeeForm.vue'

const props = defineProps<{ code: string }>()

const route = useRoute()
const router = useRouter()
const store = useEmployeesStore()
const snackbar = useSnackbar()

const employee = computed(() => store.byCode(props.code))
const isEditing = computed(() => route.query.edit === '1')

function backToList() {
  router.push({ name: 'employee-list' })
}

function editEmployee() {
  router.replace({ query: { edit: '1' } })
}

function exitEdit() {
  router.replace({ query: {} })
}

// Deletion is immediate for now; a confirmation dialog is added in a later phase.
function deleteEmployee() {
  if (!employee.value) return
  const code = employee.value.code
  store.remove(code)
  snackbar.success(`Employee ${code} deleted`)
  backToList()
}
</script>

<template>
  <v-card v-if="employee">
    <v-card-item>
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <div>
          <v-card-title class="text-h6 px-0">
            {{ isEditing ? 'Edit employee' : employee.fullName }}
          </v-card-title>
          <v-card-subtitle class="px-0">{{ employee.code }}</v-card-subtitle>
        </div>
        <div class="d-flex flex-wrap ga-2">
          <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="backToList">Back</v-btn>
          <template v-if="!isEditing">
            <v-btn variant="tonal" prepend-icon="mdi-pencil-outline" @click="editEmployee">
              Edit
            </v-btn>
            <v-btn
              variant="tonal"
              color="error"
              prepend-icon="mdi-delete-outline"
              @click="deleteEmployee"
            >
              Delete
            </v-btn>
          </template>
        </div>
      </div>
    </v-card-item>

    <v-divider />

    <v-card-text v-if="isEditing">
      <EmployeeForm mode="edit" :initial="employee" @saved="exitEdit" @cancel="exitEdit" />
    </v-card-text>

    <v-card-text v-else>
      <v-row>
        <v-col cols="12" md="6">
          <div class="text-overline text-medium-emphasis mb-2">Identity</div>
          <dl class="profile-grid">
            <dt>Code</dt>
            <dd>{{ employee.code }}</dd>
            <dt>Full Name</dt>
            <dd>{{ employee.fullName }}</dd>
          </dl>
        </v-col>

        <v-col cols="12" md="6">
          <div class="text-overline text-medium-emphasis mb-2">Employment</div>
          <dl class="profile-grid">
            <dt>Occupation</dt>
            <dd>{{ employee.occupation }}</dd>
            <dt>Department</dt>
            <dd>{{ employee.department }}</dd>
            <dt>Date of Employment</dt>
            <dd class="d-flex align-center flex-wrap ga-2">
              <EmploymentStatusChip :date="employee.dateOfEmployment" kind="employment" />
              <span v-if="employee.dateOfEmployment" class="text-medium-emphasis">
                {{ formatDate(employee.dateOfEmployment) }}
              </span>
            </dd>
            <dt>Termination Date</dt>
            <dd class="d-flex align-center flex-wrap ga-2">
              <EmploymentStatusChip :date="employee.terminationDate" kind="termination" />
              <span v-if="employee.terminationDate" class="text-medium-emphasis">
                {{ formatDate(employee.terminationDate) }}
              </span>
            </dd>
          </dl>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card v-else class="text-center pa-10">
    <v-icon icon="mdi-account-question-outline" size="56" color="primary" class="mb-4" />
    <div class="text-h6">Employee not found</div>
    <div class="text-body-2 text-medium-emphasis mt-1">
      No employee with code <strong>{{ code }}</strong> exists.
    </div>
    <v-btn class="mt-6" color="primary" prepend-icon="mdi-arrow-left" @click="backToList">
      Back to employees
    </v-btn>
  </v-card>
</template>

<style scoped>
.profile-grid {
  display: grid;
  grid-template-columns: minmax(120px, max-content) 1fr;
  row-gap: 12px;
  column-gap: 24px;
  margin: 0;
}
.profile-grid dt {
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 0.8125rem;
  align-self: center;
}
.profile-grid dd {
  margin: 0;
}
</style>
