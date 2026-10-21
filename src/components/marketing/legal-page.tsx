import { Link } from '@tanstack/react-router'
import { useTranslation } from '@/features/i18n/provider'

/** Shared content for the placeholder legal pages (/terms, /privacy). */
export function LegalPage({ title }: { title: string }) {
  const { t } = useTranslation()
  return (
    <main className="mx-auto max-w-[680px] px-5 py-16 md:px-7">
      <h1 className="page-h">{title}</h1>
      <p className="mt-4 leading-relaxed text-fg-2">{t('legal.placeholder')}</p>
      <p className="mt-8">
        <Link to="/{-$locale}" className="font-semibold text-primary">
          ← {t('common.appName')}
        </Link>
      </p>
    </main>
  )
}
