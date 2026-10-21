import { createFileRoute } from '@tanstack/react-router'
import { localeHead } from '@/features/seo/seo'
import { getOrigin } from '@/features/seo/seo.fns'
import { getTurnstileSiteKey } from '@/features/auth/middleware'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useTranslation } from '@/features/i18n/provider'
import { WaitlistForm } from '@/features/waitlist/components/waitlist-form'
import type { Locale } from '@/features/i18n/locale'

export const Route = createFileRoute('/{-$locale}/(pages)/waitlist')({
  loader: async () => {
    const [origin, turnstileSiteKey] = await Promise.all([getOrigin(), getTurnstileSiteKey()])
    return { origin, turnstileSiteKey }
  },
  head: ({ loaderData, params }) => {
    const origin = loaderData?.origin ?? ''
    const locale = ((params as { locale?: string }).locale ?? 'en') as Locale
    const dict = locale === 'zh' ? '加入候补名单' : 'Join the waitlist'
    const { meta, links } = localeHead({
      origin,
      locale,
      path: '/waitlist',
      title: `${dict} — FlareStarter`,
      description: locale === 'zh' ? '我们一上线就第一时间通知你。' : "We'll let you know the moment we launch.",
    })
    return { meta, links }
  },
  component: WaitlistPage,
})

function WaitlistPage() {
  const { turnstileSiteKey } = Route.useLoaderData()
  const { t } = useTranslation()
  return (
    <main className="mx-auto flex max-w-md flex-col px-4 py-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('waitlist.title')}</CardTitle>
          <CardDescription>{t('waitlist.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <WaitlistForm turnstileSiteKey={turnstileSiteKey} source="waitlist" />
        </CardContent>
      </Card>
    </main>
  )
}
