<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEmployeesStore } from '@/stores/employees'
import { useSnackbar } from '@/composables/useSnackbar'
import {
  isCodeUnique,
  required,
  validateCode,
  validateDate,
  validateFullName,
  validateTerminationOrder,
} from '@/utils/validation'
import type { Employee } from '@/types/employee'

const props = defineProps<{
  mode: 'create' | 'edit'
  initial?: Employee | null
}>()

const emit = defineEmits<{
  saved: [employee: Employee]
  cancel: []
}>()

const store = useEmployeesStore()
const { employees, departments, occupations } = storeToRefs(store)
const snackbar = useSnackbar()

const isEdit = computed(() => props.mode === 'edit')

function suggestNextCode(): string {
  const numbers = employees.value
    .map((e) => Number(e.code.replace(/\D/g, '')))
    .filter((n) => !Number.isNaN(n))
  const next = (numbers.length ? Math.max(...numbers) : 0) + 1
  return `EMP${String(next).padStart(3, '0')}`
}

const draft = reactive<Employee>({
  code: props.initial?.code ?? suggestNextCode(),
  fullName: props.initial?.fullName ?? '',
  occupation: props.initial?.occupation ?? '',
  department: props.initial?.department ?? '',
  dateOfEmployment: props.initial?.dateOfEmployment ?? null,
  terminationDate: props.initial?.terminationDate ?? null,
})

const formRef = ref()

// Vuetify rules adapt the pure validators (which return a message or null).
const codeRules = [
  (v: string) => validateCode(v) ?? true,
  (v: string) =>
    isEdit.value ||
    isCodeUnique(v, employees.value.map((e) => e.code)) ||
    'This code already exists',
]
const fullNameRules = [(v: string) => validateFullName(v) ?? true]
const occupationRules = [(v: string) => required(v, 'Occupation') ?? true]
const departmentRules = [(v: string) => required(v, 'Department') ?? true]
const employmentRules = [(v: string) => validateDate(v) ?? true]
const terminationRules = [
  (v: string) => validateDate(v) ?? true,
  (v: string) => validateTerminationOrder(draft.dateOfEmployment, v) ?? true,
]

async function save() {
  const result = await formRef.value?.validate?.()
  if (result && result.valid === false) return

  const employee: Employee = {
    code: draft.code.trim(),
    fullName: draft.fullName.trim(),
    occupation: draft.occupation.trim(),
    department: draft.department.trim(),
    dateOfEmployment: draft.dateOfEmployment || null,
    terminationDate: draft.terminationDate || null,
  }

  if (isEdit.value) {
    store.update(employee.code, employee)
    snackbar.success(`Employee ${employee.code} updated`)
  } else {
    store.add(employee)
    snackbar.success(`Employee ${employee.code} created`)
  }
  emit('saved', employee)
}
</script>

<template>
  <v-form ref="formRef" validate-on="blur" @submit.prevent="save">
    <v-row dense>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="draft.code"
          :rules="codeRules"
          label="Code"
          placeholder="EMP051"
          :disabled="isEdit"
        />
      </v-col>
      <v-col cols="12" sm="8">
        <v-text-field v-model="draft.fullName" :rules="fullNameRules" label="Full Name" />
      </v-col>

      <v-col cols="12" sm="6">
        <v-combobox
          v-model="draft.occupation"
          :items="occupations"
          :rules="occupationRules"
          label="Occupation"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-combobox
          v-model="draft.department"
          :items="departments"
          :rules="departmentRules"
          label="Department"
        />
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          v-model="draft.dateOfEmployment"
          :rules="employmentRules"
          type="date"
          label="Date of Employment"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="draft.terminationDate"
          :rules="terminationRules"
          type="date"
          label="Termination Date"
        />
      </v-col>
    </v-row>

    <div class="d-flex justify-end ga-2 mt-2">
      <v-btn variant="text" @click="emit('cancel')">Cancel</v-btn>
      <v-btn color="primary" type="submit">Save</v-btn>
    </div>
  </v-form>
</template>
