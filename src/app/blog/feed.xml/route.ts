import { prisma } from '@/lib/db'

const BASE_URL = 'https://shennastudio.com'

export async function GET() {
  let posts: Array<{
    title: string
    slug: string
    excerpt: string | null
    content: string | null
    publishedAt: Date | null
    createdAt: Date
    featuredImage: string | null
  }> = []

  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        publishedAt: true,
        createdAt: true,
        featuredImage: true,
      },
    })
  } catch {
    // Database may not be available
  }

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')

  const rssItems = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt || '')}</description>
      <pubDate>${(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
    </item>`
    )
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Shenna's Studio Blog - Ocean Conservation &amp; Handcrafted Jewelry</title>
    <link>${BASE_URL}/blog</link>
    <description>Ocean conservation stories, bracelet care guides, and marine life updates from Shenna's Studio in Brownsville, TX.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
