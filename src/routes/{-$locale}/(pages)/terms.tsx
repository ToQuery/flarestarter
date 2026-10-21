import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from '@/features/i18n/provider'
import { LegalPage } from '@/components/marketing/legal-page'

export const Route = createFileRoute('/{-$locale}/(pages)/terms')({
  // Placeholder content — keep it out of search until you write real terms.
  head: () => ({ meta: [{ name: 'robots', content: 'noindex' }] }),
  component: Terms,
})

function Terms() {
  const { t } = useTranslation()
  return <LegalPage title={t('legal.termsTitle')} />
}
