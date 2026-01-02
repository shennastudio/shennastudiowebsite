import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

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
    { name: 'Ocean Inspired', slug: 'ocean-inspired', description: 'Bracelets inspired by the beauty of the ocean' },
    { name: 'Conservation Collection', slug: 'conservation-collection', description: 'Every purchase supports marine conservation' },
    { name: 'Sea Turtle Collection', slug: 'sea-turtle-collection', description: "Inspired by Kemp's Ridley sea turtles" },
    { name: 'Luxury Collection', slug: 'luxury-collection', description: 'Premium handcrafted bracelets' },
    { name: 'Limited Edition', slug: 'limited-edition', description: 'Exclusive limited run designs' },
    { name: 'Gift Sets', slug: 'gift-sets', description: 'Curated bracelet sets perfect for gifting' },
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

  console.log('═══════════════════════════════════════════════════════════════')
  console.log('🎉 PRODUCTION SEEDING COMPLETED!')
  console.log('═══════════════════════════════════════════════════════════════\n')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })