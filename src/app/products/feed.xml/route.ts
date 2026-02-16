import { prisma } from '@/lib/db'

const BASE_URL = 'https://shennastudio.com'

export async function GET() {
  let products: Array<{
    name: string
    slug: string
    description: string | null
    basePrice: number
    variants: Array<{ price: number; stock: number; sku: string }>
    images: Array<{ url: string }>
  }> = []

  try {
    products = await prisma.product.findMany({
      include: {
        variants: { select: { price: true, stock: true, sku: true } },
        images: { select: { url: true }, orderBy: { position: 'asc' }, take: 1 },
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

  const items = products
    .map((product) => {
      const price = product.variants[0]?.price || product.basePrice
      const stock = product.variants.reduce((sum, v) => sum + v.stock, 0)
      const imageUrl = product.images[0]?.url || ''
      const sku = product.variants[0]?.sku || product.slug

      return `
    <item>
      <g:id>${escapeXml(sku)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description || product.name)}</g:description>
      <g:link>${BASE_URL}/products/${product.slug}</g:link>
      <g:image_link>${imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`}</g:image_link>
      <g:availability>${stock > 0 ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:price>${price.toFixed(2)} USD</g:price>
      <g:brand>Shenna's Studio</g:brand>
      <g:condition>new</g:condition>
      <g:product_type>Jewelry &gt; Bracelets</g:product_type>
    </item>`
    })
    .join('')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Shenna's Studio Product Feed</title>
    <link>${BASE_URL}</link>
    <description>Handcrafted ocean-inspired jewelry from Brownsville, TX</description>${items}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
