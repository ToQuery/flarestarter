import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Suspense } from 'react'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
} from 'fumadocs-ui/layouts/docs/page'
import { RootProvider } from 'fumadocs-ui/provider/tanstack'
import { useFumadocsLoader } from 'fumadocs-core/source/client'
import { source } from '@/features/docs/source'
import { baseOptions } from '@/features/docs/layout.shared'
import { useMDXComponents } from '@/features/docs/mdx-components'
import browserCollections from 'collections/browser'
import docsCss from '@/styles/docs.css?url'

const serverLoader = createServerFn({ method: 'GET' })
  .validator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs)
    if (!page) throw notFound()
    const { env } = await import('@/lib/env')
    return {
      path: page.path,
      title: page.data.title,
      description: page.data.description,
      origin: new URL(env.BETTER_AUTH_URL).origin,
      pageTree: await source.serializePageTree(source.getPageTree()),
    }
  })

const clientLoader = browserCollections.docs.createClientLoader({
  component({ toc, frontmatter, default: MDX }, props: { markdownUrl: string }) {
    return (
      <DocsPage toc={toc}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <div className="mb-4 flex">
          <MarkdownCopyButton markdownUrl={props.markdownUrl} />
        </div>
        <DocsBody>
          <MDX components={useMDXComponents()} />
        </DocsBody>
      </DocsPage>
    )
  },
})

export const Route = createFileRoute('/docs/$')({
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? []
    const data = await serverLoader({ data: slugs })
    await clientLoader.preload(data.path)
    return { ...data, docsPath: `/docs/${slugs.join('/')}`.replace(/\/$/, '') || '/docs', markdownUrl: `/docs-md/${slugs.join('/')}` }
  },
  // Per-page title/description — sitemap.xml advertises every docs URL, so each
  // must not fall back to the site-wide default title (duplicate-title farm).
  // og:title/og:description 同步覆盖（否则分享卡片仍显示 __root 的全站默认值，与 <title> 脱节）。
  head: ({ loaderData }) => {
    const title = loaderData?.title ? `${loaderData.title} · FlareStarter Docs` : 'FlareStarter Docs'
    const canonical = loaderData?.origin ? `${loaderData.origin}${loaderData.docsPath}` : null
    return {
      meta: [
        { title },
        { property: 'og:title', content: title },
        ...(loaderData?.description
          ? [
              { name: 'description', content: loaderData.description },
              { property: 'og:description', content: loaderData.description },
            ]
          : []),
        ...(canonical ? [{ property: 'og:url', content: canonical }] : []),
      ],
      links: [
        { rel: 'stylesheet', href: docsCss },
        ...(canonical ? [{ rel: 'canonical', href: canonical }] : []),
      ],
    }
  },
  component: Page,
})

function Page() {
  const loaderData = Route.useLoaderData()
  // head() 的存在让 loaderData 类型含 undefined；运行时 loader 阻塞渲染，此分支不可达
  if (!loaderData) throw new Error('docs loader data missing')
  const data = useFumadocsLoader(loaderData)
  return (
    // The root <ThemeProvider> owns next-themes; disable fumadocs' nested
    // provider so the docs switch and the app switch share one store.
    <RootProvider theme={{ enabled: false }}>
      <DocsLayout {...baseOptions()} tree={data.pageTree}>
        <Suspense>
          {clientLoader.useContent(data.path, { markdownUrl: loaderData.markdownUrl })}
        </Suspense>
      </DocsLayout>
    </RootProvider>
  )
}
