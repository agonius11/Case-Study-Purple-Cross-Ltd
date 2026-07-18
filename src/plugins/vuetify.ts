/**
 * Vuetify setup for the Purple Cross employee dashboard.
 *
 * We register a light and a dark theme built on the "Purple Cross" violet so
 * the app can be toggled at runtime (see AppLayout). Component-level defaults
 * keep every input/table visually consistent without repeating props.
 */
import 'vuetify/styles'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import type { ThemeDefinition } from 'vuetify'

// Shared brand hues so light/dark stay in the same family.
const brand = {
  primary: '#6D28D9', // violet-700
  primaryDark: '#8B5CF6', // violet-500 (reads better on dark surfaces)
}

const purpleCrossLight: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#F6F5FA',
    surface: '#FFFFFF',
    'surface-variant': '#ECEAF4',
    'on-surface-variant': '#585563',
    primary: brand.primary,
    'on-primary': '#FFFFFF',
    secondary: '#54525E',
    info: '#2563EB',
    success: '#15803D',
    warning: '#B45309',
    error: '#B91C1C',
  },
}

const purpleCrossDark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#141218',
    surface: '#1D1A22',
    'surface-variant': '#2A2632',
    'on-surface-variant': '#C7C2D0',
    primary: brand.primaryDark,
    'on-primary': '#1A1023',
    secondary: '#B7B3C0',
    info: '#60A5FA',
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',
  },
}

export const LIGHT_THEME = 'purpleCrossLight'
export const DARK_THEME = 'purpleCrossDark'

export const vuetify = createVuetify({
  theme: {
    defaultTheme: LIGHT_THEME,
    themes: {
      [LIGHT_THEME]: purpleCrossLight,
      [DARK_THEME]: purpleCrossDark,
    },
  },
  defaults: {
    global: { ripple: true },
    VBtn: { variant: 'flat' },
    VTextField: { variant: 'outlined', density: 'comfortable' },
    VSelect: { variant: 'outlined', density: 'comfortable' },
    VCombobox: { variant: 'outlined', density: 'comfortable' },
    VAutocomplete: { variant: 'outlined', density: 'comfortable' },
    VCard: { rounded: 'lg' },
    VAppBar: { flat: true },
  },
})
