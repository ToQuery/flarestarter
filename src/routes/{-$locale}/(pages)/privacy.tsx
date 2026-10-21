import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from '@/features/i18n/provider'
import { LegalPage } from '@/components/marketing/legal-page'

export const Route = createFileRoute('/{-$locale}/(pages)/privacy')({
  // Placeholder content — keep it out of search until you write a real policy.
  head: () => ({ meta: [{ name: 'robots', content: 'noindex' }] }),
  component: Privacy,
})

function Privacy() {
  const { t } = useTranslation()
  return <LegalPage title={t('legal.privacyTitle')} />
}
