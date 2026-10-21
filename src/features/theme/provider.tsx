import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes'
import type { ReactNode } from 'react'

/**
 * Single theme system for the whole site. `next-themes` already powers the
 * docs (via fumadocs), so using it at the root keeps the marketing/app/docs
 * surfaces in sync without a server round-trip or a theme cookie.
 *
 * `attribute="class"` matches the existing CSS contract (`.light` / `.dark`
 * on <html>); `storageKey="theme"` is the key fumadocs expects.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}

export function useTheme() {
  return useNextTheme()
}
