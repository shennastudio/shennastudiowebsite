import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Beautiful bracelet and jewelry images from Unsplash
const braceletImages = [
  'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&h=800&fit=crop', // Beaded bracelet
  'https://images.unsplash.com/photo-1573408301185-a1d310683e29?w=800&h=800&fit=crop', // Gold bracelet
  'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800&h=800&fit=crop', // Pearl bracelet
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=800&fit=crop', // Crystal beads
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop', // Colorful beads
  'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=800&h=800&fit=crop', // Bracelet on wrist
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop', // Multiple bracelets
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=800&fit=crop', // Jewelry close-up
  'https://images.unsplash.com/photo-1576022162944-d98c4e43e3d9?w=800&h=800&fit=crop', // Charm bracelet
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop', // Fashion bracelet
  'https://images.unsplash.com/photo-1627293620999-e9b5c2325dbe?w=800&h=800&fit=crop', // Elegant bracelet
  'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?w=800&h=800&fit=crop', // Jewelry set
]

const productImages: Record<string, string> = {
  'demo-ocean-wave-bracelet': braceletImages[0],
  'demo-sea-turtle-guardian': braceletImages[1],
  'demo-coral-reef-bracelet': braceletImages[2],
  'demo-whale-song-bracelet': braceletImages[3],
  'demo-pearl-lagoon-luxury': braceletImages[4],
  'demo-diamond-tide': braceletImages[5],
  'demo-golden-sunset': braceletImages[6],
  'demo-conservation-bundle': braceletImages[7],
}

async function main() {
  console.log('🔄 Updating product images to correct jewelry versions...')

  const products = await prisma.product.findMany({
    where: {
      slug: {
        in: Object.keys(productImages)
      }
    },
    include: { images: true }
  })

  for (const product of products) {
    const newImageUrl = productImages[product.slug]
    
    // Check if current image is different
    const currentImage = product.images[0]
    
    if (newImageUrl) {
      if (!currentImage || currentImage.url !== newImageUrl) {
        console.log(`   Updating ${product.name}...`)
        
        // Delete old images
        await prisma.productImage.deleteMany({
          where: { productId: product.id }
        })

        // Create new image
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: newImageUrl,
            alt: product.name,
            position: 0,
          }
        })
      } else {
        console.log(`   ${product.name} already has correct image. `)
      }
    }
  }

  // Also verify any other products without images
  const productsWithoutImages = await prisma.product.findMany({
    where: {
      images: {
        none: {}
      }
    }
  })

  if (productsWithoutImages.length > 0) {
    console.log(`\n⚠️ Found ${productsWithoutImages.length} other products without images. Adding unique bracelet photos...`)
    for (let i = 0; i < productsWithoutImages.length; i++) {
      const product = productsWithoutImages[i]
      // Cycle through bracelet images to give variety
      const imageUrl = braceletImages[i % braceletImages.length]
      console.log(`   Adding bracelet image to ${product.name}...`)
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: imageUrl,
          alt: product.name,
          position: 0,
        }
      })
    }
  }

  // Update any products with broken or placeholder images
  const allProducts = await prisma.product.findMany({
    include: { images: true }
  })

  console.log(`\n🔍 Checking all ${allProducts.length} products for broken images...`)
  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i]
    const hasImage = product.images.length > 0
    const currentImage = product.images[0]?.url || ''

    // Check if image is a broken placeholder or old URL
    const isBroken = currentImage.includes('placeholder') ||
                     currentImage.includes('undefined') ||
                     currentImage === '' ||
                     !currentImage.includes('unsplash')

    if (hasImage && isBroken) {
      const newImageUrl = braceletImages[i % braceletImages.length]
      console.log(`   Fixing broken image for ${product.name}...`)

      await prisma.productImage.updateMany({
        where: { productId: product.id },
        data: { url: newImageUrl }
      })
    }
  }

  console.log('✅ Product images updated successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
