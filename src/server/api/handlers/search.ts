import type { Context } from 'hono'
import { createFromSource } from 'fumadocs-core/search/server'
import { createTokenizer } from '@orama/tokenizers/mandarin'
import { stopwords as mandarinStopwords } from '@orama/stopwords/mandarin'
import { source } from '@/features/docs/source'

// Docs are Chinese, so index/query with a Mandarin tokenizer — Orama's default
// tokenizer splits on whitespace and can't segment CJK, so 中文 queries返回空.
// `createFromSource` reads each page's compiled `structuredData` (bundled, not
// filesystem — safe on workerd) and defers indexing.
const searchServer = createFromSource(source, {
  tokenizer: createTokenizer({ language: 'mandarin', stopWords: mandarinStopwords }),
  search: { threshold: 0, tolerance: 0 },
})

export function searchHandler(c: Context) {
  return searchServer.GET(c.req.raw)
}
