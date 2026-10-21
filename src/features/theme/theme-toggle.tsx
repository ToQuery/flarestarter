import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTranslation } from '@/features/i18n/provider'
import { useTheme } from '@/features/theme/provider'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()
  // next-themes resolves the theme on the client only; render a stable
  // placeholder until mounted so SSR and hydration agree.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const current = mounted && resolvedTheme === 'light' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
      aria-label={t('common.toggleTheme')}
      className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-transparent text-fg-2 transition-colors hover:bg-bg-alt hover:text-foreground"
    >
      {!mounted ? (
        <span className="h-[18px] w-[18px]" aria-hidden="true" />
      ) : current === 'dark' ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  )
}
