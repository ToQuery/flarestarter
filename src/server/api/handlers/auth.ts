import type { Context } from 'hono'
import { env } from '@/lib/env'
import { createDb } from '@/db/client'
import { createAuth } from '@/features/auth/auth.server'

/**
 * better-auth owns the whole /api/auth subtree. Mounting it through TanStack
 * Start (not the worker entry) keeps `tanstackStartCookies()` working: the
 * plugin writes cookies through Start's request context.
 */
export function authHandler(c: Context) {
  const auth = createAuth(env, createDb(env.DB))
  return auth.handler(c.req.raw)
}
