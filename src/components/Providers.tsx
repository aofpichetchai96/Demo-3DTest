'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        defaultTheme="dark"
        storageKey="nanyang-ui-theme"
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
