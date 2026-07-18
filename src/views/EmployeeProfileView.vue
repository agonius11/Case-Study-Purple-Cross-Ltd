<script setup lang="ts">
import { useRoute } from 'vue-router'

// Placeholder — the profile view/edit is wired up in a later phase.
const route = useRoute()
</script>

<template>
  <v-card>
    <v-card-item>
      <v-card-title class="text-h6">Employee {{ route.params.code }}</v-card-title>
      <v-card-subtitle>The employee profile will appear here.</v-card-subtitle>
    </v-card-item>
  </v-card>
</template>
