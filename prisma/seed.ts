import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import Stripe from 'stripe'

const prisma = new PrismaClient()

// Initialize Stripe if configured
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-12-15.clover' })
  : null

async function main() {
  console.log('🌱 Production Seeding - Setting up essential data...')

  // ===========================
  // GET OR CREATE ADMIN USER
  // ===========================
  console.log('👤 Checking admin user...')

  const hashedAdminPassword = await bcrypt.hash('Sh3nn@R0ng3l!2025$Ocean#Admin', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'shenna.rangel@yahoo.com' },
    update: {},
    create: {
      email: 'shenna.rangel@yahoo.com',
      password: hashedAdminPassword,
      name: 'Shenna Rangel',
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user ready')

  // Get or create staff user
  const hashedStaffPassword = await bcrypt.hash('Staff2025!Ocean', 10)
  const staff = await prisma.user.upsert({
    where: { email: 'staff@shennastudio.com' },
    update: {},
    create: {
      email: 'staff@shennastudio.com',
      password: hashedStaffPassword,
      name: 'Maria Santos',
      role: 'STAFF',
    },
  })
  console.log('✅ Staff user ready')

  // ===========================
  // GET EXISTING OR CREATE CATEGORIES
  // ===========================
  console.log('📁 Checking categories...')

  const categoryData = [
    // Existing categories
    { name: 'Ocean Inspired', slug: 'ocean-inspired', description: 'Bracelets inspired by the beauty of the ocean' },
    { name: 'Conservation Collection', slug: 'conservation-collection', description: 'Every purchase supports marine conservation' },
    { name: 'Sea Turtle Collection', slug: 'sea-turtle-collection', description: "Inspired by Kemp's Ridley sea turtles" },
    { name: 'Luxury Collection', slug: 'luxury-collection', description: 'Premium handcrafted bracelets' },
    { name: 'Limited Edition', slug: 'limited-edition', description: 'Exclusive limited run designs' },
    { name: 'Gift Sets', slug: 'gift-sets', description: 'Curated bracelet sets perfect for gifting' },
    
    // New product categories
    { name: 'Bracelets', slug: 'bracelets', description: 'Handcrafted ocean-inspired bracelets for all styles' },
    { name: 'Necklaces', slug: 'necklaces', description: 'Beautiful ocean-themed necklaces and pendants' },
    { name: 'T-Shirts', slug: 't-shirts', description: 'Comfortable ocean-inspired apparel and tees' },
    { name: 'Pets', slug: 'pets', description: 'Ocean-themed accessories for your furry friends' },
    { name: 'Holidays', slug: 'holidays', description: 'Special holiday-themed ocean jewelry and gifts' },
  ]

  const categories = []
  for (const cat of categoryData) {
    let category = await prisma.category.findUnique({ where: { slug: cat.slug } })
    if (!category) {
      category = await prisma.category.create({
        data: {
          ...cat,
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
        },
      })
    }
    categories.push(category)
  }

  console.log(`✅ ${categories.length} categories ready\n`)

  // ===========================
  // BRACELET SIZES
  // ===========================
  console.log('📏 Checking bracelet sizes...')
  const defaultSizes = [
    { name: 'XS', label: 'Extra Small (6\"', inches: '6', numericSize: 6, description: 'Size 6 - For petite wrists', displayOrder: 1 },
    { name: 'S', label: 'Small (6.5\"', inches: '6.5', numericSize: 6, description: 'Size 6.5 - For smaller wrists', displayOrder: 2 },
    { name: 'M', label: 'Medium (7\"', inches: '7', numericSize: 7, description: 'Size 7 - Standard women\'s size', displayOrder: 3 },
    { name: 'M+', label: 'Medium Plus (7.5\"', inches: '7.5', numericSize: 7, description: 'Size 7.5 - Between medium and large', displayOrder: 4 },
    { name: 'L', label: 'Large (8\"', inches: '8', numericSize: 8, description: 'Size 8 - Standard men\'s size', displayOrder: 5 },
    { name: 'L+', label: 'Large Plus (8.5\"', inches: '8.5', numericSize: 8, description: 'Size 8.5 - Between large and extra large', displayOrder: 6 },
    { name: 'XL', label: 'Extra Large (9\"', inches: '9', numericSize: 9, description: 'Size 9 - For larger men\'s wrists', displayOrder: 7 },
  ]

  for (const sizeData of defaultSizes) {
    await prisma.braceletSize.upsert({
      where: { name: sizeData.name },
      update: {},
      create: { ...sizeData, isActive: true },
    })
  }
  console.log('✅ Bracelet sizes ready\n')

  // ===========================
  // CONSERVATION PARTNERS (for map)
  // ===========================
  console.log('🐢 Creating/updating conservation partners with location data...')

  const partnerData = [
    {
      name: 'Sea Turtle Inc.',
      description: "South Padre Island's premier sea turtle rescue and rehabilitation center. Home to dozens of rescued Kemp's Ridley sea turtles.",
      website: 'https://www.seaturtleinc.org',
      contactEmail: 'info@seaturtleinc.org',
      focusAreas: ["Kemp's Ridley Sea Turtles", 'Turtle Rescue', 'Education', 'Rehabilitation'],
      location: 'South Padre Island, TX',
    },
    {
      name: 'Rio Grande Valley Nature Coalition',
      description: 'Protecting the unique ecosystems of the Rio Grande Valley through habitat restoration and wildlife conservation.',
      website: 'https://www.rgvnature.org',
      contactEmail: 'info@rgvnature.org',
      focusAreas: ['Wildlife Habitat', 'Coastal Restoration', 'Education', 'Wetlands'],
      location: 'Brownsville, TX',
    },
    {
      name: 'Gulf Coast Whale Research',
      description: 'Dedicated to studying and protecting whales and dolphins in the Gulf of Mexico through scientific research and public education.',
      website: 'https://www.gulfwhales.org',
      contactEmail: 'research@gulfwhales.org',
      focusAreas: ['Whale Migration', 'Marine Research', 'Dolphin Conservation', 'Ocean Health'],
      location: 'Corpus Christi, TX',
    },
    {
      name: 'Coastal Conservation Association Texas',
      description: 'Working to protect and enhance marine resources along the Texas coast for generations to come.',
      website: 'https://www.ccatexas.org',
      contactEmail: 'info@ccatexas.org',
      focusAreas: ['Habitat Restoration', 'Fish Conservation', 'Clean Water', 'Advocacy'],
      location: 'Houston, TX',
    },
    {
      name: 'Texas State Aquarium',
      description: 'Inspiring conservation of the Gulf of Mexico through education, animal rehabilitation, and research programs.',
      website: 'https://www.texasstateaquarium.org',
      contactEmail: 'info@txstateaquarium.org',
      focusAreas: ['Marine Education', 'Animal Rescue', 'Research', 'Conservation'],
      location: 'Corpus Christi, TX',
    },
  ]

  const partners = []
  for (const pd of partnerData) {
    let partner = await prisma.conservationPartner.findFirst({ where: { name: pd.name } })
    if (!partner) {
      partner = await prisma.conservationPartner.create({
        data: {
          ...pd,
          logo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200',
          totalDonations: 0,
          donationCount: 0,
          isActive: true,
          verifiedAt: new Date(),
        },
      })
    }
    partners.push(partner)
  }

  console.log(`✅ ${partners.length} conservation partners ready\n`)

  // ===========================
  // DISCOUNT CODES (if not exist)
  // ===========================
  console.log('🏷️  Checking discount codes...')

  const discountCodes = [
    { code: 'OCEAN10', type: 'PERCENTAGE' as const, value: 10, description: '10% off all orders' },
    { code: 'TURTLE15', type: 'PERCENTAGE' as const, value: 15, description: '15% off Sea Turtle Collection' },
    { code: 'FREESHIP', type: 'FREE_SHIPPING' as const, value: 0, description: 'Free shipping on orders over $50' },
    { code: 'LUXURY20', type: 'PERCENTAGE' as const, value: 20, description: '20% off Luxury Collection' },
    { code: 'SAVE25', type: 'FIXED_AMOUNT' as const, value: 25, description: '$25 off orders over $150' },
  ]

  for (const dc of discountCodes) {
    const existing = await prisma.discountCode.findUnique({ where: { code: dc.code } })
    if (!existing) {
      await prisma.discountCode.create({
        data: {
          ...dc,
          usageLimit: 1000,
          usageCount: 0,
          minPurchaseAmount: dc.code === 'SAVE25' ? 150 : dc.code === 'FREESHIP' ? 50 : 25,
          isActive: true,
          createdBy: admin.id,
        },
      })
    }
  }

  console.log(`✅ Discount codes ready\n`)

  // ===========================
  // IMPORT STRIPE ORDERS
  // ===========================
  if (stripe) {
    console.log('💳 Importing historical Stripe orders...')
    await importStripeOrders()
  } else {
    console.log('⚠️  Skipping Stripe order import (STRIPE_SECRET_KEY not configured)')
  }

  console.log('═══════════════════════════════════════════════════════════════')
  console.log('🎉 PRODUCTION SEEDING COMPLETED!')
  console.log('═══════════════════════════════════════════════════════════════\n')
}

/**
 * Import historical orders from Stripe
 */
async function importStripeOrders() {
  if (!stripe) return

  const DAYS_TO_SYNC = 365 // Fetch up to 1 year of orders
  const startDate = Math.floor(Date.now() / 1000) - (DAYS_TO_SYNC * 24 * 60 * 60)

  let imported = 0
  let skipped = 0
  let hasMore = true
  let startingAfter: string | undefined

  try {
    // Fetch all completed checkout sessions (paginated)
    while (hasMore) {
      const sessions = await stripe.checkout.sessions.list({
        limit: 100,
        created: { gte: startDate },
        status: 'complete',
        starting_after: startingAfter,
      })

      for (const session of sessions.data) {
        const paymentIntentId = session.payment_intent as string

        // Check if order already exists
        const existingOrder = await prisma.order.findFirst({
          where: {
            OR: [
              { stripePaymentId: paymentIntentId },
              { stripePaymentId: session.id },
            ],
          },
        })

        if (existingOrder) {
          skipped++
          continue
        }

        // Import this order
        try {
          await importSingleOrder(session)
          imported++
        } catch (error) {
          console.error(`   ❌ Failed to import ${session.id}:`, error instanceof Error ? error.message : error)
        }
      }

      hasMore = sessions.has_more
      if (sessions.data.length > 0) {
        startingAfter = sessions.data[sessions.data.length - 1].id
      }
    }

    console.log(`   ✅ Imported ${imported} new orders (${skipped} already existed)`)
  } catch (error) {
    console.error('   ❌ Error importing Stripe orders:', error)
  }
}

async function importSingleOrder(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_email || session.customer_details?.email || ''
  const customerName = session.customer_details?.name || session.shipping_details?.name || session.metadata?.shippingName || 'Guest'

  // Try multiple sources for shipping address
  const shipping = session.shipping_details?.address || session.customer_details?.address
  const metadata = session.metadata || {}

  // Build address from best available source
  const shippingLine1 = shipping?.line1 || metadata.shippingLine1 || ''
  const shippingLine2 = shipping?.line2 || metadata.shippingLine2 || ''
  const shippingCity = shipping?.city || metadata.shippingCity || ''
  const shippingState = shipping?.state || metadata.shippingState || ''
  const shippingZip = shipping?.postal_code || metadata.shippingPostalCode || ''
  const shippingCountry = shipping?.country || metadata.shippingCountry || 'US'

  const total = (session.amount_total || 0) / 100
  const subtotal = (session.amount_subtotal || session.amount_total || 0) / 100

  // Estimate tax and shipping
  let tax = 0
  let shippingCost = 0

  try {
    const lineItems = await stripe!.checkout.sessions.listLineItems(session.id, { limit: 100 })
    for (const item of lineItems.data) {
      if (item.description?.toLowerCase().includes('tax')) {
        tax = (item.amount_total || 0) / 100
      } else if (item.description?.toLowerCase().includes('shipping')) {
        shippingCost = (item.amount_total || 0) / 100
      }
    }
  } catch {
    // Estimate if we can't get line items
    tax = subtotal * 0.0825
    if (total < 50) shippingCost = 5.95
  }

  const productSubtotal = total - tax - shippingCost

  // Create the order
  const order = await prisma.order.create({
    data: {
      customerEmail,
      customerName,
      status: 'PENDING',
      subtotal: productSubtotal > 0 ? productSubtotal : subtotal,
      shipping: shippingCost,
      tax,
      total,
      stripePaymentId: session.payment_intent as string || session.id,
      shippingAddress: shippingLine1 + (shippingLine2 ? '\n' + shippingLine2 : ''),
      shippingCity,
      shippingState,
      shippingZip,
      shippingCountry,
      createdAt: new Date(session.created * 1000),
    },
  })

  // Create conservation donation record
  await prisma.conservationDonation.create({
    data: {
      orderId: order.id,
      amount: productSubtotal * 0.10,
      percentage: 10.0,
      status: 'PLEDGED',
      region: 'South Padre Island',
    },
  })
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })