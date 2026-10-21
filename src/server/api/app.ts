import { Hono } from 'hono'
import { authHandler } from './handlers/auth'
import { avatarHandler } from './handlers/avatars'
import { searchHandler } from './handlers/search'
import { stripeHandler } from './handlers/stripe'

/**
 * Single Hono app for every `/api/*` request. It is mounted from
 * `src/routes/api/$.ts` so Start's request context (and better-auth's cookie
 * helper) stays active.
 */
export const api = new Hono<{ Bindings: Cloudflare.Env }>()

api.onError((err, c) => {
  if (err instanceof URIError) return c.text('Bad request', 400)
  console.error('[api] unhandled error', err)
  return c.text('Internal Server Error', 500)
})

api.all('/api/auth', authHandler)
api.all('/api/auth/*', authHandler)
api.get('/api/avatars/:userId', avatarHandler)
api.get('/api/search', searchHandler)
api.post('/api/webhooks/stripe', stripeHandler)
