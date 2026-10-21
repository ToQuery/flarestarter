import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SiteNav } from '@/components/marketing/site-nav'
import { Footer } from '@/components/marketing/footer'
import { getOptionalUser } from '@/features/auth/middleware'

/**
 * Shared shell for every public marketing page. Loading the optional user once
 * here removes the duplicate session lookup each page used to perform.
 */
export const Route = createFileRoute('/{-$locale}/(pages)')({
  loader: async () => {
    try {
      return { loggedIn: !!(await getOptionalUser()) }
    } catch {
      // Public pages must still render if the session store blips; the nav
      // simply falls back to the signed-out state.
      return { loggedIn: false }
    }
  },
  component: MarketingLayout,
})

function MarketingLayout() {
  const { loggedIn } = Route.useLoaderData()
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav loggedIn={loggedIn} />
      <Outlet />
      <Footer />
    </div>
  )
}
