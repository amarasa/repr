'use client'

import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '@/theme/theme'

interface ProvidersProps {
  children: React.ReactNode
}

/**
 * Global providers wrapper for the application
 * Includes MUI Theme Provider and CSS baseline
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
} 