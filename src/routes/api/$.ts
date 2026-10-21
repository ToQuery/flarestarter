import { createFileRoute } from '@tanstack/react-router'

/**
 * All API traffic is handled by Hono. Keep the mount inside a TanStack Start
 * server route (rather than the worker entry) so better-auth's cookie plugin
 * still runs with Start's request context.
 */
export const Route = createFileRoute('/api/$')({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const [{ api }, { env }] = await Promise.all([
          import('@/server/api/app'),
          import('@/lib/env'),
        ])
        return api.fetch(request, env)
      },
    },
  },
})
