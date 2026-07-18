import { reactive, readonly } from 'vue'

export type SnackbarTone = 'success' | 'error' | 'info' | 'warning'

interface SnackbarState {
  visible: boolean
  message: string
  tone: SnackbarTone
  timeout: number
}

// Module-scoped so any component can raise a toast into the single layout snackbar.
const state = reactive<SnackbarState>({
  visible: false,
  message: '',
  tone: 'info',
  timeout: 3500,
})

function show(message: string, tone: SnackbarTone = 'info', timeout = 3500): void {
  state.message = message
  state.tone = tone
  state.timeout = timeout
  state.visible = true
}

export function useSnackbar() {
  return {
    state: readonly(state),
    notify: show,
    success: (message: string, timeout?: number) => show(message, 'success', timeout),
    error: (message: string, timeout?: number) => show(message, 'error', timeout),
    info: (message: string, timeout?: number) => show(message, 'info', timeout),
    dismiss: () => {
      state.visible = false
    },
  }
}
