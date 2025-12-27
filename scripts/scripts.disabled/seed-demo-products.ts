/**
 * Seed Demo Products for ShennaStudio
 *
 * Creates sample ocean-themed bracelet products with working placeholder images.
 * These products are tagged as demo data for easy cleanup.
 *
 * Run: npm run payload:seed:demo
 */

import { getPayload } from 'payload'
import config from '../payload-config'

interface DemoProduct {
  name: string
  description: string
  basePrice: number
  sku: string
  featured: boolean
  conservationDonationPercentage: number
  conservationFocus: string
  imageUrl: string
  variants: Array<{
    variantName: string
    sku: string
    price: number
    stock: number
    size?: 'small' | 'medium' | 'large'
    color?: string
    material?: string
  }>
}

const DEMO_PRODUCTS: DemoProduct[] = [
  {
    name: 'Sea Turtle Guardian Bracelet',
    description: 'Handcrafted bracelet inspired by the majestic sea turtles of South Padre Island. Features ocean-blue beads and turtle charm. Every purchase helps protect sea turtle nesting grounds.',
    basePrice: 24.99,
    sku: 'DEMO-SEA-TURTLE-001',
    featured: true,
    conservationDonationPercentage: 10,
    conservationFocus: 'Sea Turtle Conservation - South Padre Island',
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80', // Turquoise beads
    variants: [
      {
        variantName: 'Small - Turquoise',
        sku: 'DEMO-STG-S-TUR',
        price: 24.99,
        stock: 15,
        size: 'small',
        color: 'Turquoise',
        material: 'Glass Beads'
      },
      {
        variantName: 'Medium - Ocean Blue',
        sku: 'DEMO-STG-M-BLU',
        price: 26.99,
        stock: 20,
        size: 'medium',
        color: 'Ocean Blue',
        material: 'Glass Beads'
      },
      {
        variantName: 'Large - Deep Sea',
        sku: 'DEMO-STG-L-DEP',
        price: 28.99,
        stock: 12,
        size: 'large',
        color: 'Deep Blue',
        material: 'Glass Beads'
      }
    ]
  },
  {
    name: 'Whale Song Bracelet',
    description: 'Inspired by the gentle giants of the ocean. Features deep blue and white beads representing ocean waves. Supports whale research and protection in the Rio Grande Valley.',
    basePrice: 29.99,
    sku: 'DEMO-WHALE-SONG-002',
    featured: true,
    conservationDonationPercentage: 10,
    conservationFocus: 'Whale Protection - Rio Grande Valley',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80', // Blue/white beads
    variants: [
      {
        variantName: 'Small - Ocean Mist',
        sku: 'DEMO-WS-S-MST',
        price: 29.99,
        stock: 18,
        size: 'small',
        color: 'White & Blue',
        material: 'Natural Stone'
      },
      {
        variantName: 'Medium - Wave Crest',
        sku: 'DEMO-WS-M-WAV',
        price: 31.99,
        stock: 25,
        size: 'medium',
        color: 'Blue & Silver',
        material: 'Natural Stone'
      }
    ]
  },
  {
    name: 'Coral Reef Protector',
    description: 'Vibrant coral-inspired bracelet with pink, orange, and turquoise beads. Each bracelet represents the beauty of our ocean reefs. Proceeds support coral restoration efforts.',
    basePrice: 22.99,
    sku: 'DEMO-CORAL-REEF-003',
    featured: true,
    conservationDonationPercentage: 10,
    conservationFocus: 'Coral Reef Restoration',
    imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80', // Colorful beads
    variants: [
      {
        variantName: 'Small - Coral Pink',
        sku: 'DEMO-CR-S-PNK',
        price: 22.99,
        stock: 22,
        size: 'small',
        color: 'Coral Pink',
        material: 'Acrylic Beads'
      },
      {
        variantName: 'Medium - Sunset Coral',
        sku: 'DEMO-CR-M-SUN',
        price: 24.99,
        stock: 30,
        size: 'medium',
        color: 'Orange & Pink',
        material: 'Acrylic Beads'
      },
      {
        variantName: 'Large - Rainbow Reef',
        sku: 'DEMO-CR-L-RNB',
        price: 26.99,
        stock: 15,
        size: 'large',
        color: 'Multicolor',
        material: 'Acrylic Beads'
      }
    ]
  },
  {
    name: 'Shark Guardian Bracelet',
    description: 'Bold bracelet honoring the apex predators of our oceans. Features grey and black beads with silver shark charm. Supports shark research and conservation.',
    basePrice: 27.99,
    sku: 'DEMO-SHARK-GUARD-004',
    featured: false,
    conservationDonationPercentage: 10,
    conservationFocus: 'Shark Research & Conservation',
    imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80', // Dark beads
    variants: [
      {
        variantName: 'Medium - Steel Grey',
        sku: 'DEMO-SG-M-GRY',
        price: 27.99,
        stock: 20,
        size: 'medium',
        color: 'Steel Grey',
        material: 'Hematite Beads'
      },
      {
        variantName: 'Large - Deep Ocean',
        sku: 'DEMO-SG-L-DPO',
        price: 29.99,
        stock: 15,
        size: 'large',
        color: 'Black & Silver',
        material: 'Hematite Beads'
      }
    ]
  },
  {
    name: 'Dolphin Dreams Bracelet',
    description: 'Playful and elegant bracelet inspired by dolphins. Features aqua and silver beads with dolphin charm. Perfect for ocean lovers. Supports marine mammal rescue.',
    basePrice: 25.99,
    sku: 'DEMO-DOLPHIN-DREAMS-005',
    featured: false,
    conservationDonationPercentage: 10,
    conservationFocus: 'Marine Mammal Rescue',
    imageUrl: 'https://images.unsplash.com/photo-1596051264773-70c7e3a6b49e?w=800&q=80', // Aqua beads
    variants: [
      {
        variantName: 'Small - Aquamarine',
        sku: 'DEMO-DD-S-AQU',
        price: 25.99,
        stock: 18,
        size: 'small',
        color: 'Aquamarine',
        material: 'Crystal Beads'
      },
      {
        variantName: 'Medium - Ocean Spray',
        sku: 'DEMO-DD-M-SPR',
        price: 27.99,
        stock: 25,
        size: 'medium',
        color: 'Aqua & Silver',
        material: 'Crystal Beads'
      }
    ]
  },
  {
    name: 'Starfish Sunrise Bracelet',
    description: 'Warm and inviting bracelet with amber, gold, and cream beads. Starfish charm celebrates coastal mornings. Supports beach cleanup initiatives.',
    basePrice: 23.99,
    sku: 'DEMO-STARFISH-SUN-006',
    featured: false,
    conservationDonationPercentage: 10,
    conservationFocus: 'Beach & Coastal Cleanup',
    imageUrl: 'https://images.unsplash.com/photo-1612472447275-0addc09a2a1d?w=800&q=80', // Gold/amber beads
    variants: [
      {
        variantName: 'Small - Sunrise Gold',
        sku: 'DEMO-SS-S-GLD',
        price: 23.99,
        stock: 20,
        size: 'small',
        color: 'Gold',
        material: 'Wood Beads'
      },
      {
        variantName: 'Medium - Amber Glow',
        sku: 'DEMO-SS-M-AMB',
        price: 25.99,
        stock: 28,
        size: 'medium',
        color: 'Amber',
        material: 'Wood Beads'
      },
      {
        variantName: 'Large - Coastal Cream',
        sku: 'DEMO-SS-L-CRM',
        price: 27.99,
        stock: 12,
        size: 'large',
        color: 'Cream & Gold',
        material: 'Wood Beads'
      }
    ]
  }
]

async function seedDemoProducts() {
  console.log('🌊 Starting demo product seed...')

  try {
    const payload = await getPayload({ config })

    // First, check if we have a demo category
    const demoCategory = await payload.find({
      collection: 'categories',
      where: {
        slug: {
          equals: 'demo-collection'
        }
      }
    })

    let categoryId: number

    if (demoCategory.docs.length === 0) {
      console.log('📁 Creating demo category...')
      const newCategory = await payload.create({
        collection: 'categories',
        data: {
          name: 'Demo Collection',
          slug: 'demo-collection',
          description: 'Sample products for demonstration purposes. These can be removed when ready for production.',
        }
      })
      categoryId = newCategory.id
      console.log(`✅ Demo category created: ${categoryId}`)
    } else {
      categoryId = demoCategory.docs[0].id
      console.log(`✅ Using existing demo category: ${categoryId}`)
    }

    // Create demo products
    let createdCount = 0
    let skippedCount = 0

    for (const demoProduct of DEMO_PRODUCTS) {
      // Check if product already exists
      const existing = await payload.find({
        collection: 'products',
        where: {
          sku: {
            equals: demoProduct.sku
          }
        }
      })

      if (existing.docs.length > 0) {
        console.log(`⏭️  Skipping ${demoProduct.name} (already exists)`)
        skippedCount++
        continue
      }

      console.log(`🔨 Creating ${demoProduct.name}...`)

      // Create the product with variants
      await payload.create({
        collection: 'products',
        data: {
          name: demoProduct.name,
          description: demoProduct.description,
          basePrice: demoProduct.basePrice,
          sku: demoProduct.sku,
          status: 'active',
          featured: demoProduct.featured,
          inStock: true,
          conservationDonationPercentage: demoProduct.conservationDonationPercentage,
          conservationFocus: demoProduct.conservationFocus,
          category: [categoryId],
          // Use image URL directly - Payload will handle it
          images: [
            {
              image: demoProduct.imageUrl
            }
          ],
          variants: demoProduct.variants.map(v => ({
            variantName: v.variantName,
            sku: v.sku,
            price: v.price,
            stock: v.stock,
            size: v.size,
            color: v.color,
            material: v.material,
          }))
        }
      })

      createdCount++
      console.log(`✅ Created ${demoProduct.name}`)
    }

    console.log('\n🎉 Demo product seed complete!')
    console.log(`📊 Created: ${createdCount} products`)
    console.log(`⏭️  Skipped: ${skippedCount} products (already exist)`)
    console.log('\n💡 You can remove all demo data by running: npm run payload:clear-demo')

  } catch (error) {
    console.error('❌ Error seeding demo products:', error)
    throw error
  }

  process.exit(0)
}

seedDemoProducts()
