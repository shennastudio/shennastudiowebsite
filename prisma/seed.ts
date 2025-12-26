import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@shennastudio.com' },
    update: {},
    create: {
      email: 'admin@shennastudio.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  console.log('✅ Created admin user:', admin.email)

  // Create sample categories
  const oceanCategory = await prisma.category.upsert({
    where: { slug: 'ocean-inspired' },
    update: {},
    create: {
      name: 'Ocean Inspired',
      slug: 'ocean-inspired',
      description: 'Bracelets inspired by the beauty of the ocean',
    },
  })

  const conservationCategory = await prisma.category.upsert({
    where: { slug: 'conservation-collection' },
    update: {},
    create: {
      name: 'Conservation Collection',
      slug: 'conservation-collection',
      description: 'Every purchase supports marine conservation',
    },
  })

  console.log('✅ Created categories')

  // Create sample product
  const product = await prisma.product.create({
    data: {
      name: 'Ocean Wave Bracelet',
      slug: 'ocean-wave-bracelet',
      description: 'Handcrafted bracelet inspired by ocean waves. Features blue and white beads representing the sea.',
      sku: 'OWB-001',
      basePrice: 29.99,
      featured: true,
      conservationPercentage: 10,
      conservationFocus: 'Sea Turtle Conservation - South Padre Island',
      categoryId: oceanCategory.id,
      variants: {
        create: [
          {
            name: 'Small - Blue',
            sku: 'OWB-001-S-BLUE',
            price: 29.99,
            stock: 25,
            size: 'Small',
            color: 'Blue',
            material: 'Glass Beads',
          },
          {
            name: 'Medium - Blue',
            sku: 'OWB-001-M-BLUE',
            price: 29.99,
            stock: 30,
            size: 'Medium',
            color: 'Blue',
            material: 'Glass Beads',
          },
          {
            name: 'Large - Blue',
            sku: 'OWB-001-L-BLUE',
            price: 32.99,
            stock: 20,
            size: 'Large',
            color: 'Blue',
            material: 'Glass Beads',
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
            alt: 'Ocean Wave Bracelet',
            position: 0,
          },
        ],
      },
    },
  })

  console.log('✅ Created sample product:', product.name)

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
