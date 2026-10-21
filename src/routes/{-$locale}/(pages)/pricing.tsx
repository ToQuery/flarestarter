import { createFileRoute } from '@tanstack/react-router'
import { localeHead } from '@/features/seo/seo'
import { getOrigin } from '@/features/seo/seo.fns'
import { getTurnstileSiteKey } from '@/features/auth/middleware'
import { PricingTable } from '@/features/billing/components/pricing-table'
import type { Locale } from '@/features/i18n/locale'

export const Route = createFileRoute('/{-$locale}/(pages)/pricing')({
  loader: async () => {
    const [origin, turnstileSiteKey] = await Promise.all([getOrigin(), getTurnstileSiteKey()])
    return { origin, turnstileSiteKey }
  },
  head: ({ loaderData, params }) => {
    const origin = loaderData?.origin ?? ''
    const locale = ((params as { locale?: string }).locale ?? 'en') as Locale
    const { meta, links } = localeHead({
      origin,
      locale,
      path: '/pricing',
      title: locale === 'zh' ? '定价 — FlareStarter' : 'Pricing — FlareStarter',
      description:
        locale === 'zh'
          ? '开源核心（Apache 2.0）。Pro 一次买断、终身可用，即将推出。'
          : 'Open source core (Apache 2.0). Pro — a one-time lifetime license — is coming soon.',
    })
    return { meta, links }
  },
  component: Pricing,
})

function Pricing() {
  const { turnstileSiteKey } = Route.useLoaderData()
  return <PricingTable turnstileSiteKey={turnstileSiteKey} />
}
