import { computed, watch } from 'vue'
import { useTheme } from 'vuetify'
import { DARK_THEME, LIGHT_THEME } from '@/plugins/vuetify'

const STORAGE_KEY = 'pc.theme'

export function useThemeToggle() {
  const theme = useTheme()

  // Initial theme: stored choice > OS preference > light default.
  const stored = safeGet()
  if (stored === LIGHT_THEME || stored === DARK_THEME) {
    theme.global.name.value = stored
  } else if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
  ) {
    theme.global.name.value = DARK_THEME
  }

  const isDark = computed(() => theme.global.name.value === DARK_THEME)

  function toggle(): void {
    theme.global.name.value = isDark.value ? LIGHT_THEME : DARK_THEME
  }

  watch(() => theme.global.name.value, safeSet)

  return { isDark, toggle }
}

function safeGet(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function safeSet(value: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Storage may be unavailable; the in-memory theme still works.
  }
}
