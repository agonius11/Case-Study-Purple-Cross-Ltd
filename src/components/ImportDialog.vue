<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useEmployeesStore } from '@/stores/employees'
import { useSnackbar } from '@/composables/useSnackbar'
import { mergeByCode, parseEmployeesJson, previewMerge, type ParseResult } from '@/utils/employeeIO'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const store = useEmployeesStore()
const { employees } = storeToRefs(store)
const snackbar = useSnackbar()

const fileInput = ref<HTMLInputElement | null>(null)
const fileName = ref('')
const result = ref<ParseResult | null>(null)
const error = ref('')
const mode = ref<'merge' | 'replace'>('merge')

watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) {
      fileName.value = ''
      result.value = null
      error.value = ''
      mode.value = 'merge'
    }
  },
)

function pickFile() {
  fileInput.value?.click()
}

async function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  fileName.value = file.name
  error.value = ''
  result.value = null
  try {
    result.value = parseEmployeesJson(await file.text())
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    target.value = ''
  }
}

const summary = computed(() => {
  if (!result.value) return ''
  const { valid, invalidCount } = result.value
  const skipped = invalidCount > 0 ? `, ${invalidCount} skipped as invalid` : ''
  if (mode.value === 'replace') {
    return `Replace all ${employees.value.length} current records with ${valid.length} from the file${skipped}.`
  }
  const { added, updated } = previewMerge(employees.value, valid)
  return `Merge by code: ${added} new, ${updated} updated${skipped}.`
})

const canApply = computed(() => !!result.value && result.value.valid.length > 0 && !error.value)

function close() {
  emit('update:modelValue', false)
}

function apply() {
  if (!result.value) return
  const next =
    mode.value === 'replace'
      ? result.value.valid
      : mergeByCode(employees.value, result.value.valid)
  store.replaceAll(next)
  snackbar.success(`Imported ${result.value.valid.length} records`)
  close()
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="560"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="text-h6">Import employees</v-card-title>
      <v-divider />
      <v-card-text>
        <input
          ref="fileInput"
          type="file"
          accept="application/json,.json"
          class="d-none"
          @change="onFileSelected"
        />

        <v-btn variant="tonal" prepend-icon="mdi-file-upload-outline" @click="pickFile">
          {{ fileName ? 'Choose another file' : 'Choose JSON file' }}
        </v-btn>
        <div v-if="fileName" class="mt-3 text-body-2 text-medium-emphasis">
          <v-icon icon="mdi-file-document-outline" size="16" class="mr-1" />{{ fileName }}
        </div>

        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mt-4">
          {{ error }}
        </v-alert>

        <template v-if="result && !error">
          <v-divider class="my-4" />
          <v-radio-group v-model="mode" hide-details density="compact">
            <v-radio value="merge" label="Merge by code (update existing, add new)" />
            <v-radio value="replace" label="Replace all current employees" />
          </v-radio-group>
          <div class="text-body-2 text-medium-emphasis mt-3">{{ summary }}</div>
          <v-alert
            v-if="result.valid.length === 0"
            type="warning"
            variant="tonal"
            density="compact"
            class="mt-3"
          >
            No valid employees found in this file.
          </v-alert>
        </template>
      </v-card-text>
      <v-divider />
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" :disabled="!canApply" @click="apply">Apply</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
