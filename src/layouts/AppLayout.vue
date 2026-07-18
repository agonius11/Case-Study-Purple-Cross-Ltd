<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import { useThemeToggle } from '@/composables/useThemeToggle'

const route = useRoute()
const { state: snackbar, dismiss } = useSnackbar()
const { isDark, toggle } = useThemeToggle()

type Crumb = { title: string; to?: string; disabled?: boolean }

const crumbs = computed<Crumb[]>(() => {
  const base: Crumb = { title: 'Employees', to: '/employees' }
  switch (route.name) {
    case 'employee-profile':
      return [base, { title: String(route.params.code ?? ''), disabled: true }]
    case 'not-found':
      return [{ title: 'Not found', disabled: true }]
    default:
      return [{ ...base, disabled: true }]
  }
})
</script>

<template>
  <v-app-bar color="surface" border="b">
    <div class="d-flex align-center px-4" style="gap: 12px">
      <v-icon icon="mdi-hospital-box-outline" color="primary" size="24" />
      <span class="text-subtitle-1 font-weight-bold">Purple Cross</span>
      <v-divider vertical class="mx-1" />
      <span class="text-body-2 text-medium-emphasis d-none d-sm-inline">
        Employee Management
      </span>
    </div>

    <v-spacer />

    <v-btn
      :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
      variant="text"
      :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
      :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
      @click="toggle"
    />

    <v-avatar color="primary" size="34" class="mr-4" title="Signed in as Purple Cross admin">
      <span class="text-caption font-weight-bold">PC</span>
    </v-avatar>
  </v-app-bar>

  <v-main class="bg-background">
    <v-container class="py-6" style="max-width: 1400px">
      <v-breadcrumbs :items="crumbs" density="compact" class="px-0 pt-0 pb-4" />
      <router-view />
    </v-container>
  </v-main>

  <v-snackbar
    :model-value="snackbar.visible"
    :color="snackbar.tone"
    :timeout="snackbar.timeout"
    location="bottom right"
    @update:model-value="(value: boolean) => !value && dismiss()"
  >
    {{ snackbar.message }}
    <template #actions>
      <v-btn variant="text" @click="dismiss">Close</v-btn>
    </template>
  </v-snackbar>
</template>
