import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { localeHead } from '@/features/seo/seo'
import { getOrigin } from '@/features/seo/seo.fns'
import type { Locale } from '@/features/i18n/locale'
import { Hero } from '@/components/marketing/hero'
import { TechStrip } from '@/components/marketing/tech-strip'
import { Features } from '@/components/marketing/features'
import { FeatureGrid } from '@/components/marketing/feature-grid'
import { AgentSection } from '@/components/marketing/agent-section'
import { CTA } from '@/components/marketing/cta'

const marketingRoute = getRouteApi('/{-$locale}/(pages)')

export const Route = createFileRoute('/{-$locale}/(pages)/')({
  loader: async () => ({ origin: await getOrigin() }),
  head: ({ loaderData, params }) => {
    const origin = loaderData?.origin ?? ''
    const locale = ((params as { locale?: string }).locale ?? 'en') as Locale
    const { meta, links } = localeHead({
      origin,
      locale,
      path: '/',
      title: 'FlareStarter',
      description:
        locale === 'zh'
          ? 'FlareStarter——Cloudflare 原生的 SaaS 起步模板。克隆即用，部署到 Workers。'
          : 'FlareStarter — the Cloudflare-native SaaS starter. Clone it and ship on Workers.',
    })
    return { meta, links }
  },
  component: Home,
})

function Home() {
  const { loggedIn } = marketingRoute.useLoaderData()

  return (
    <>
      <Hero loggedIn={loggedIn} />
      <TechStrip />
      <Features />
      <FeatureGrid />
      <AgentSection />
      <CTA loggedIn={loggedIn} />
    </>
  )
}
