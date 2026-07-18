<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <v-card class="text-center pa-10">
    <v-icon icon="mdi-map-marker-question-outline" size="56" color="primary" class="mb-4" />
    <div class="text-h6">Page not found</div>
    <div class="text-body-2 text-medium-emphasis mt-1">
      The page you are looking for does not exist or has moved.
    </div>
    <v-btn
      class="mt-6"
      color="primary"
      prepend-icon="mdi-arrow-left"
      @click="router.push({ name: 'employee-list' })"
    >
      Back to employees
    </v-btn>
  </v-card>
</template>
