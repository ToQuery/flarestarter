import type { Context } from 'hono'
import { env } from '@/lib/env'
import { getAvatar } from '@/features/storage/storage.server'

/**
 * Stream a user's avatar from R2. R2 objects aren't public by default, so this
 * route is the read side — `user.image` points here. Avatars are non-sensitive,
 * so no auth gate; the userId is the last path segment.
 */
export async function avatarHandler(c: Context) {
  let userId = ''
  try {
    userId = decodeURIComponent(c.req.param('userId') ?? '')
  } catch {
    // 畸形百分号编码（如 /%E0%A4%A）→ 404，而不是未捕获的 URIError 500
  }
  const object = userId ? await getAvatar(env.BUCKET, userId) : null
  if (!object) return c.text('Not found', 404)

  const headers = new Headers()
  if (object.httpMetadata?.contentType) headers.set('Content-Type', object.httpMetadata.contentType)
  headers.set('ETag', object.httpEtag)
  headers.set('Cache-Control', 'public, max-age=60') // short: url is cache-busted on re-upload
  return new Response(object.body, { headers })
}
