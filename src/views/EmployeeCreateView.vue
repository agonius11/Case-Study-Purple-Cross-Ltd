<script setup lang="ts">
import { useRouter } from 'vue-router'
import EmployeeForm from '@/components/EmployeeForm.vue'
import type { Employee } from '@/types/employee'

const router = useRouter()

function onSaved(employee: Employee) {
  router.push({ name: 'employee-profile', params: { code: employee.code } })
}

function onCancel() {
  router.push({ name: 'employee-list' })
}
</script>

<template>
  <v-card>
    <v-card-item>
      <v-card-title class="text-h6">Create employee</v-card-title>
      <v-card-subtitle>Add a new employee to the directory.</v-card-subtitle>
    </v-card-item>
    <v-divider />
    <v-card-text>
      <EmployeeForm mode="create" @saved="onSaved" @cancel="onCancel" />
    </v-card-text>
  </v-card>
</template>
