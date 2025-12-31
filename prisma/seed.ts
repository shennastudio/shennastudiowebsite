import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Helper to generate random dates
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Helper to pick random item from array
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Helper to generate order number
function generateOrderNumber(index: number): string {
  const year = 2024
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
  return `ORD-${year}${month}-${String(index).padStart(5, '0')}`
}

async function main() {
  console.log('🌱 ADDITIVE Seeding - Adding dummy data without erasing existing data...')
  console.log('💰 Target: $2,650,800+ in revenue with conservation impact data\n')

  // ===========================
  // CHECK EXISTING DATA
  // ===========================
  const existingUsers = await prisma.user.count()
  const existingOrders = await prisma.order.count()
  const existingProducts = await prisma.product.count()
  const existingAnalyticsEvents = await prisma.analyticsEvent.count()

  console.log('📊 Existing Data:')
  console.log(`   • Users: ${existingUsers}`)
  console.log(`   • Products: ${existingProducts}`)
  console.log(`   • Orders: ${existingOrders}`)
  console.log(`   • Analytics Events: ${existingAnalyticsEvents}`)
  console.log('')

  // ===========================
  // GET OR CREATE ADMIN USER
  // ===========================
  console.log('👤 Checking admin user...')

  let admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })

  if (!admin) {
    const hashedAdminPassword = await bcrypt.hash('Sh3nn@R0ng3l!2025$Ocean#Admin', 10)
    admin = await prisma.user.create({
      data: {
        email: 'shenna.rangel@yahoo.com',
        password: hashedAdminPassword,
        name: 'Shenna Rangel',
        role: 'ADMIN',
      },
    })
    console.log('✅ Created admin user')
  } else {
    console.log('✅ Admin user exists')
  }

  // Get or create staff user
  let staff = await prisma.user.findFirst({ where: { role: 'STAFF' } })
  if (!staff) {
    const hashedStaffPassword = await bcrypt.hash('Staff2025!Ocean', 10)
    staff = await prisma.user.create({
      data: {
        email: 'staff@shennastudio.com',
        password: hashedStaffPassword,
        name: 'Maria Santos',
        role: 'STAFF',
      },
    })
    console.log('✅ Created staff user')
  }

  // ===========================
  // CREATE DEMO CUSTOMERS (for orders/analytics)
  // ===========================
  console.log('\n👥 Creating demo customers for testing...')

  const demoCustomerNames = [
    'Demo Sarah Ocean', 'Demo Mike Turtle', 'Demo Lisa Waves', 'Demo James Coral', 'Demo Emily Shore',
    'Demo David Beach', 'Demo Amanda Reef', 'Demo Robert Marina', 'Demo Jennifer Coast', 'Demo Michael Bay',
    'Demo Ashley Pearl', 'Demo Christopher Shell', 'Demo Jessica Tide', 'Demo Matthew Seabreeze', 'Demo Lauren Dune',
    'Demo Daniel Lagoon', 'Demo Rachel Harbor', 'Demo Andrew Cove', 'Demo Megan Surf', 'Demo Joshua Sunset',
    'Demo Stephanie Starfish', 'Demo Brandon Dolphin', 'Demo Nicole Whale', 'Demo Kevin Anchor', 'Demo Melissa Sandbar',
    'Demo Ryan Seagull', 'Demo Samantha Kelp', 'Demo Justin Manatee', 'Demo Heather Pelican', 'Demo Tyler Seahorse',
  ]

  const hashedCustomerPassword = await bcrypt.hash('demo123', 10)
  const demoCustomers = []

  for (const name of demoCustomerNames) {
    const email = name.toLowerCase().replace(/\s+/g, '.') + '@demo.shennastudio.com'
    let customer = await prisma.user.findUnique({ where: { email } })

    if (!customer) {
      customer = await prisma.user.create({
        data: {
          email,
          password: hashedCustomerPassword,
          name,
          role: 'CUSTOMER',
          rewards: {
            create: {
              points: Math.floor(Math.random() * 5000) + 100,
              totalSpent: Math.floor(Math.random() * 10000) + 500,
              totalOrders: Math.floor(Math.random() * 50) + 1,
              currentTier: randomItem(['Bronze', 'Silver', 'Gold', 'Platinum']),
            },
          },
        },
      })
    }
    demoCustomers.push(customer)
  }

  console.log(`✅ ${demoCustomers.length} demo customers ready\n`)

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
  // GET EXISTING PRODUCTS AND VARIANTS
  // ===========================
  console.log('🛍️  Getting products and variants...')

  let products = await prisma.product.findMany({ include: { variants: true } })

  // If no products exist, create demo products
  if (products.length === 0) {
    console.log('   Creating demo products...')

    const productData = [
      { name: 'Demo Ocean Wave Bracelet', slug: 'demo-ocean-wave-bracelet', basePrice: 29.99, categoryIndex: 0 },
      { name: 'Demo Sea Turtle Guardian', slug: 'demo-sea-turtle-guardian', basePrice: 34.99, categoryIndex: 2 },
      { name: 'Demo Coral Reef Bracelet', slug: 'demo-coral-reef-bracelet', basePrice: 27.99, categoryIndex: 1 },
      { name: 'Demo Whale Song Bracelet', slug: 'demo-whale-song-bracelet', basePrice: 39.99, categoryIndex: 0 },
      { name: 'Demo Pearl Lagoon Luxury', slug: 'demo-pearl-lagoon-luxury', basePrice: 149.99, categoryIndex: 3 },
      { name: 'Demo Diamond Tide', slug: 'demo-diamond-tide', basePrice: 299.99, categoryIndex: 3 },
      { name: 'Demo Golden Sunset', slug: 'demo-golden-sunset', basePrice: 199.99, categoryIndex: 3 },
      { name: 'Demo Conservation Bundle', slug: 'demo-conservation-bundle', basePrice: 119.99, categoryIndex: 5 },
    ]

    const sizes = ['Small', 'Medium', 'Large']

    for (let i = 0; i < productData.length; i++) {
      const pd = productData[i]
      const product = await prisma.product.create({
        data: {
          name: pd.name,
          slug: pd.slug,
          description: `Demo ${pd.name} - for testing purposes`,
          sku: `DEMO-SKU-${String(i + 1).padStart(3, '0')}`,
          basePrice: pd.basePrice,
          featured: true,
          conservationPercentage: 10,
          conservationFocus: 'Sea Turtle Conservation',
          categoryId: categories[pd.categoryIndex]?.id,
          variants: {
            create: sizes.map((size, sizeIndex) => ({
              name: `${size} - Demo`,
              sku: `DEMO-SKU-${String(i + 1).padStart(3, '0')}-${size[0]}`,
              price: pd.basePrice + (sizeIndex * 3),
              stock: 100,
              size,
              color: 'Ocean Blue',
              material: 'Glass Beads',
            })),
          },
        },
        include: { variants: true },
      })
      products.push(product)
    }
  }

  const allVariants = products.flatMap(p => p.variants)
  console.log(`✅ ${products.length} products with ${allVariants.length} variants ready\n`)

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
      // Coordinates for map: 26.0767° N, 97.1578° W
    },
    {
      name: 'Rio Grande Valley Nature Coalition',
      description: 'Protecting the unique ecosystems of the Rio Grande Valley through habitat restoration and wildlife conservation.',
      website: 'https://www.rgvnature.org',
      contactEmail: 'info@rgvnature.org',
      focusAreas: ['Wildlife Habitat', 'Coastal Restoration', 'Education', 'Wetlands'],
      location: 'Brownsville, TX',
      // Coordinates: 25.9017° N, 97.4975° W
    },
    {
      name: 'Gulf Coast Whale Research',
      description: 'Dedicated to studying and protecting whales and dolphins in the Gulf of Mexico through scientific research and public education.',
      website: 'https://www.gulfwhales.org',
      contactEmail: 'research@gulfwhales.org',
      focusAreas: ['Whale Migration', 'Marine Research', 'Dolphin Conservation', 'Ocean Health'],
      location: 'Corpus Christi, TX',
      // Coordinates: 27.8006° N, 97.3964° W
    },
    {
      name: 'Coastal Conservation Association Texas',
      description: 'Working to protect and enhance marine resources along the Texas coast for generations to come.',
      website: 'https://www.ccatexas.org',
      contactEmail: 'info@ccatexas.org',
      focusAreas: ['Habitat Restoration', 'Fish Conservation', 'Clean Water', 'Advocacy'],
      location: 'Houston, TX',
      // Coordinates: 29.7604° N, 95.3698° W
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
  // CREATE DEMO ORDERS FOR $2.65M REVENUE
  // ===========================
  console.log('📦 Creating demo orders (targeting $2,650,800 total revenue)...')

  // Check current order total
  const existingOrderTotals = await prisma.order.aggregate({
    _sum: { total: true }
  })
  const existingRevenue = existingOrderTotals._sum.total || 0

  console.log(`   Current revenue from existing orders: $${existingRevenue.toFixed(2)}`)

  const targetRevenue = 2650800
  const neededRevenue = targetRevenue - existingRevenue

  if (neededRevenue <= 0) {
    console.log('   ✅ Target revenue already met!')
  } else {
    console.log(`   Need to create: $${neededRevenue.toFixed(2)} in demo orders`)

    const states = ['TX', 'CA', 'FL', 'NY', 'AZ', 'CO', 'WA', 'OR', 'NV', 'NC']
    const cities = ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Los Angeles', 'Miami', 'New York', 'Phoenix', 'Denver', 'Seattle']

    let addedRevenue = 0
    let orderIndex = existingOrders + 1
    const newOrders = []

    while (addedRevenue < neededRevenue) {
      const customer = randomItem(demoCustomers)
      const orderDate = randomDate(new Date('2024-01-01'), new Date('2024-12-28'))

      // Create larger orders to reach target faster
      const numItems = Math.floor(Math.random() * 5) + 2
      const selectedVariants = []
      let subtotal = 0

      for (let j = 0; j < numItems; j++) {
        const variant = randomItem(allVariants)
        const quantity = Math.floor(Math.random() * 5) + 1
        selectedVariants.push({ variant, quantity })
        subtotal += variant.price * quantity
      }

      // 20% chance of bulk order
      if (Math.random() > 0.8) {
        subtotal *= Math.floor(Math.random() * 5) + 3
      }

      const shipping = subtotal >= 50 ? 0 : 5.95
      const tax = subtotal * 0.0825
      const total = subtotal + shipping + tax

      const daysSinceOrder = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
      let status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
      if (daysSinceOrder > 14) {
        status = Math.random() > 0.03 ? 'DELIVERED' : 'CANCELLED'
      } else if (daysSinceOrder > 7) {
        status = randomItem(['SHIPPED', 'DELIVERED'])
      } else if (daysSinceOrder > 2) {
        status = randomItem(['PROCESSING', 'SHIPPED'])
      } else {
        status = randomItem(['PENDING', 'PROCESSING'])
      }

      const order = await prisma.order.create({
        data: {
          orderNumber: `DEMO-${generateOrderNumber(orderIndex)}`,
          userId: customer.id,
          customerEmail: customer.email!,
          customerName: customer.name!,
          shippingAddress: `${Math.floor(Math.random() * 9999) + 100} ${randomItem(['Ocean', 'Beach', 'Coastal', 'Marine', 'Harbor'])} ${randomItem(['Drive', 'Street', 'Avenue', 'Boulevard', 'Lane'])}`,
          shippingCity: randomItem(cities),
          shippingState: randomItem(states),
          shippingZip: String(Math.floor(Math.random() * 90000) + 10000),
          shippingCountry: 'US',
          subtotal,
          shipping,
          tax,
          total,
          status,
          stripePaymentId: status !== 'CANCELLED' ? `pi_demo_${Math.random().toString(36).substring(2, 15)}` : null,
          trackingNumber: status === 'SHIPPED' || status === 'DELIVERED' ? `1Z999AA${Math.floor(Math.random() * 10000000000)}` : null,
          carrier: status === 'SHIPPED' || status === 'DELIVERED' ? randomItem(['USPS', 'FedEx', 'UPS']) : null,
          shippingCost: shipping,
          shippedAt: status === 'SHIPPED' || status === 'DELIVERED' ? randomDate(orderDate, new Date()) : null,
          deliveredAt: status === 'DELIVERED' ? randomDate(orderDate, new Date()) : null,
          createdAt: orderDate,
          items: {
            create: selectedVariants.map(({ variant, quantity }) => ({
              variantId: variant.id,
              quantity,
              price: variant.price,
            })),
          },
        },
      })

      // Add conservation donation for delivered/shipped orders (10% of total)
      if (status === 'DELIVERED' || status === 'SHIPPED') {
        const partner = randomItem(partners)
        await prisma.conservationDonation.create({
          data: {
            orderId: order.id,
            amount: total * 0.10,
            percentage: 10,
            organization: partner.name,
            region: randomItem(['South Padre Island', 'Rio Grande Valley', 'Gulf Coast', 'Corpus Christi', 'Houston Area']),
            status: status === 'DELIVERED' ? 'DONATED' : 'PLEDGED',
            partnerId: partner.id,
          },
        })

        // Update partner totals
        await prisma.conservationPartner.update({
          where: { id: partner.id },
          data: {
            totalDonations: { increment: total * 0.10 },
            donationCount: { increment: 1 },
          },
        })
      }

      newOrders.push(order)
      addedRevenue += total
      orderIndex++

      if (orderIndex % 500 === 0) {
        console.log(`   Created ${newOrders.length} demo orders... ($${addedRevenue.toFixed(2)} / $${neededRevenue.toFixed(2)})`)
      }
    }

    console.log(`✅ Created ${newOrders.length} demo orders totaling $${addedRevenue.toFixed(2)}\n`)
  }

  // ===========================
  // ABANDONED CARTS (Analytics Events)
  // ===========================
  console.log('🛒 Creating abandoned cart analytics events...')

  const existingAbandonedCarts = await prisma.analyticsEvent.count({
    where: { eventType: 'ADD_TO_CART' }
  })

  if (existingAbandonedCarts < 50) {
    const sessionsToCreate = 50 - Math.floor(existingAbandonedCarts / 3)

    for (let i = 0; i < sessionsToCreate; i++) {
      const sessionId = `demo_session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
      const customer = Math.random() > 0.3 ? randomItem(demoCustomers) : null
      const sessionStart = randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date(Date.now() - 2 * 60 * 60 * 1000))

      const numItems = Math.floor(Math.random() * 4) + 1

      for (let j = 0; j < numItems; j++) {
        const variant = randomItem(allVariants)
        const product = products.find(p => p.variants.some(v => v.id === variant.id))
        const quantity = Math.floor(Math.random() * 3) + 1

        await prisma.analyticsEvent.create({
          data: {
            eventType: 'ADD_TO_CART',
            timestamp: new Date(sessionStart.getTime() + j * 5 * 60 * 1000),
            sessionId,
            userId: customer?.id,
            productId: product?.id,
            variantId: variant.id,
            metadata: {
              price: variant.price,
              quantity,
              productName: product?.name,
              variantName: variant.name,
            },
            deviceType: randomItem(['desktop', 'mobile', 'tablet']),
            referrer: randomItem(['/products', '/category/ocean-inspired', '/search', '/']),
          },
        })
      }
    }

    console.log(`✅ Created abandoned cart sessions\n`)
  } else {
    console.log(`✅ Sufficient abandoned cart data exists (${existingAbandonedCarts} events)\n`)
  }

  // ===========================
  // CONSERVATION IMPACT DATA
  // ===========================
  console.log('🌊 Creating/updating conservation impact records...')

  // Calculate total donations from all orders
  const allDonations = await prisma.conservationDonation.aggregate({
    _sum: { amount: true },
    _count: true,
  })

  const totalDonations = allDonations._sum.amount || 0
  const donationCount = allDonations._count || 0

  console.log(`   Total conservation donations: $${totalDonations.toFixed(2)} from ${donationCount} orders`)

  // Create/update monthly impact records for 2024
  for (let month = 0; month < 12; month++) {
    const monthStart = new Date(2024, month, 1)
    const monthEnd = new Date(2024, month + 1, 0)

    // Get actual donations for this month
    const monthlyDonationsResult = await prisma.conservationDonation.aggregate({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      _sum: { amount: true },
      _count: true,
    })

    const monthlyDonations = monthlyDonationsResult._sum.amount || (totalDonations / 12)
    const monthlyOrderCount = monthlyDonationsResult._count || Math.floor(donationCount / 12)

    // Upsert impact record
    await prisma.conservationImpact.upsert({
      where: {
        id: `impact-2024-${month}`,
      },
      create: {
        id: `impact-2024-${month}`,
        periodStart: monthStart,
        periodEnd: monthEnd,
        periodType: 'monthly',
        totalDonations: monthlyDonations,
        orderCount: monthlyOrderCount,
        turtlesSaved: Math.floor(monthlyDonations / 50), // ~$50 per turtle protection effort
        oceanCleaned: monthlyDonations * 2, // 2 sqm per dollar
        coralRestored: monthlyDonations * 0.5, // 0.5 sqm per dollar
        focusBreakdown: {
          "Sea Turtle Conservation": monthlyDonations * 0.5,
          "Ocean Cleanup": monthlyDonations * 0.2,
          "Coral Reef Restoration": monthlyDonations * 0.15,
          "Marine Research": monthlyDonations * 0.1,
          "Education Programs": monthlyDonations * 0.05,
        },
      },
      update: {
        totalDonations: monthlyDonations,
        orderCount: monthlyOrderCount,
        turtlesSaved: Math.floor(monthlyDonations / 50),
        oceanCleaned: monthlyDonations * 2,
        coralRestored: monthlyDonations * 0.5,
        focusBreakdown: {
          "Sea Turtle Conservation": monthlyDonations * 0.5,
          "Ocean Cleanup": monthlyDonations * 0.2,
          "Coral Reef Restoration": monthlyDonations * 0.15,
          "Marine Research": monthlyDonations * 0.1,
          "Education Programs": monthlyDonations * 0.05,
        },
      },
    })
  }

  // Create annual summary
  await prisma.conservationImpact.upsert({
    where: { id: 'impact-2024-annual' },
    create: {
      id: 'impact-2024-annual',
      periodStart: new Date(2024, 0, 1),
      periodEnd: new Date(2024, 11, 31),
      periodType: 'yearly',
      totalDonations,
      orderCount: donationCount,
      turtlesSaved: Math.floor(totalDonations / 50),
      oceanCleaned: totalDonations * 2,
      coralRestored: totalDonations * 0.5,
      focusBreakdown: {
        "Sea Turtle Conservation": totalDonations * 0.5,
        "Ocean Cleanup": totalDonations * 0.2,
        "Coral Reef Restoration": totalDonations * 0.15,
        "Marine Research": totalDonations * 0.1,
        "Education Programs": totalDonations * 0.05,
      },
    },
    update: {
      totalDonations,
      orderCount: donationCount,
      turtlesSaved: Math.floor(totalDonations / 50),
      oceanCleaned: totalDonations * 2,
      coralRestored: totalDonations * 0.5,
      focusBreakdown: {
        "Sea Turtle Conservation": totalDonations * 0.5,
        "Ocean Cleanup": totalDonations * 0.2,
        "Coral Reef Restoration": totalDonations * 0.15,
        "Marine Research": totalDonations * 0.1,
        "Education Programs": totalDonations * 0.05,
      },
    },
  })

  console.log(`✅ Conservation impact records updated\n`)

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
          usageCount: Math.floor(Math.random() * 200),
          minPurchaseAmount: dc.code === 'SAVE25' ? 150 : dc.code === 'FREESHIP' ? 50 : 25,
          isActive: true,
          createdBy: admin.id,
        },
      })
    }
  }

  console.log(`✅ Discount codes ready\n`)

  // ===========================
  // SUPPORT TICKETS (demo data)
  // ===========================
  console.log('🎫 Creating demo support tickets...')

  const existingTickets = await prisma.supportTicket.count()
  if (existingTickets < 20) {
    const ticketsToCreate = 20 - existingTickets

    const ticketSubjects = [
      'Order not received', 'Wrong item sent', 'Need tracking info', 'Return request',
      'Product inquiry', 'Shipping delay', 'Discount code not working', 'Size exchange',
    ]

    for (let i = 0; i < ticketsToCreate; i++) {
      const customer = randomItem(demoCustomers)
      const status = randomItem(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']) as 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
      const priority = randomItem(['LOW', 'MEDIUM', 'HIGH']) as 'LOW' | 'MEDIUM' | 'HIGH'
      const createdAt = randomDate(new Date('2024-06-01'), new Date())

      await prisma.supportTicket.create({
        data: {
          ticketNumber: `DEMO-TKT-${String(existingTickets + i + 1).padStart(5, '0')}`,
          customerId: customer.id,
          customerEmail: customer.email!,
          customerName: customer.name!,
          subject: randomItem(ticketSubjects),
          description: 'Demo support ticket for testing admin panel functionality.',
          category: randomItem(['general', 'order', 'shipping', 'return', 'product']),
          status,
          priority,
          assignedTo: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(status) ? randomItem([admin.id, staff!.id]) : null,
          resolvedAt: ['RESOLVED', 'CLOSED'].includes(status) ? randomDate(createdAt, new Date()) : null,
          createdAt,
        },
      })
    }

    console.log(`✅ Created ${ticketsToCreate} demo support tickets\n`)
  } else {
    console.log(`✅ Sufficient support tickets exist (${existingTickets})\n`)
  }

  // ===========================
  // RETURNS (demo data)
  // ===========================
  console.log('↩️  Creating demo returns...')

  const existingReturns = await prisma.return.count()
  if (existingReturns < 15) {
    const returnsToCreate = 15 - existingReturns
    const deliveredOrders = await prisma.order.findMany({
      where: { status: 'DELIVERED' },
      include: { items: { include: { variant: true } } },
      take: returnsToCreate * 2,
    })

    for (let i = 0; i < Math.min(returnsToCreate, deliveredOrders.length); i++) {
      const order = deliveredOrders[i]
      const status = randomItem(['PENDING', 'APPROVED', 'REFUNDED']) as 'PENDING' | 'APPROVED' | 'REFUNDED'

      const returnRecord = await prisma.return.create({
        data: {
          returnNumber: `DEMO-RET-${String(existingReturns + i + 1).padStart(4, '0')}`,
          orderId: order.id,
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          reason: randomItem(['CHANGED_MIND', 'SIZE_ISSUE', 'NOT_AS_DESCRIBED']) as 'CHANGED_MIND' | 'SIZE_ISSUE' | 'NOT_AS_DESCRIBED',
          reasonDetails: 'Demo return for testing admin panel.',
          status,
          refundAmount: status === 'REFUNDED' ? order.total : null,
          refundMethod: status === 'REFUNDED' ? 'original_payment' : null,
          approvedBy: status !== 'PENDING' ? admin.id : null,
          createdAt: randomDate(order.createdAt, new Date()),
        },
      })

      if (order.items.length > 0) {
        const item = order.items[0]
        await prisma.returnItem.create({
          data: {
            returnId: returnRecord.id,
            orderItemId: item.id,
            variantId: item.variantId,
            productName: item.variant.name,
            variantName: item.variant.name,
            quantity: 1,
            unitPrice: item.price,
            condition: 'like_new',
            restockable: true,
          },
        })
      }
    }

    console.log(`✅ Created demo returns\n`)
  } else {
    console.log(`✅ Sufficient returns exist (${existingReturns})\n`)
  }

  // ===========================
  // EMAIL LOGS (demo data)
  // ===========================
  console.log('📬 Creating demo email logs...')

  const existingEmailLogs = await prisma.emailLog.count()
  if (existingEmailLogs < 50) {
    const logsToCreate = 50 - existingEmailLogs

    for (let i = 0; i < logsToCreate; i++) {
      const customer = randomItem(demoCustomers)
      const template = randomItem(['ORDER_CONFIRMATION', 'SHIPPING_NOTIFICATION', 'DELIVERY_CONFIRMATION']) as 'ORDER_CONFIRMATION' | 'SHIPPING_NOTIFICATION' | 'DELIVERY_CONFIRMATION'
      const status = randomItem(['sent', 'sent', 'sent', 'failed'])

      await prisma.emailLog.create({
        data: {
          to: customer.email!,
          subject: `[Demo] ${template.replace(/_/g, ' ')} - ShennaStudio`,
          template,
          status,
          provider: 'demo',
          sentAt: status === 'sent' ? randomDate(new Date('2024-06-01'), new Date()) : null,
          error: status === 'failed' ? 'Demo error' : null,
          createdAt: randomDate(new Date('2024-06-01'), new Date()),
        },
      })
    }

    console.log(`✅ Created ${logsToCreate} demo email logs\n`)
  } else {
    console.log(`✅ Sufficient email logs exist (${existingEmailLogs})\n`)
  }

  // ===========================
  // PRODUCT ANALYTICS
  // ===========================
  console.log('📈 Updating product analytics...')

  for (const product of products) {
    const views7 = Math.floor(Math.random() * 500) + 100
    const views30 = views7 * 4 + Math.floor(Math.random() * 200)
    const carts7 = Math.floor(views7 * 0.15)
    const carts30 = Math.floor(views30 * 0.15)
    const purchases7 = Math.floor(carts7 * 0.4)
    const purchases30 = Math.floor(carts30 * 0.4)

    await prisma.productAnalytics.upsert({
      where: { productId: product.id },
      create: {
        productId: product.id,
        viewsLast7Days: views7,
        viewsLast30Days: views30,
        addToCartLast7Days: carts7,
        addToCartLast30Days: carts30,
        purchasesLast7Days: purchases7,
        purchasesLast30Days: purchases30,
        viewToCartRate: views30 > 0 ? carts30 / views30 : 0,
        cartToPurchaseRate: carts30 > 0 ? purchases30 / carts30 : 0,
        trendingScore: Math.floor(Math.random() * 100),
      },
      update: {
        viewsLast7Days: views7,
        viewsLast30Days: views30,
        addToCartLast7Days: carts7,
        addToCartLast30Days: carts30,
        purchasesLast7Days: purchases7,
        purchasesLast30Days: purchases30,
        viewToCartRate: views30 > 0 ? carts30 / views30 : 0,
        cartToPurchaseRate: carts30 > 0 ? purchases30 / carts30 : 0,
        trendingScore: Math.floor(Math.random() * 100),
      },
    })
  }

  console.log('✅ Product analytics updated\n')

  // ===========================
  // FINAL SUMMARY
  // ===========================
  const finalStats = {
    users: await prisma.user.count(),
    products: await prisma.product.count(),
    variants: await prisma.productVariant.count(),
    orders: await prisma.order.count(),
    revenue: (await prisma.order.aggregate({ _sum: { total: true } }))._sum.total || 0,
    donations: (await prisma.conservationDonation.aggregate({ _sum: { amount: true } }))._sum.amount || 0,
    abandonedCarts: await prisma.analyticsEvent.count({ where: { eventType: 'ADD_TO_CART' } }),
    partners: await prisma.conservationPartner.count(),
    returns: await prisma.return.count(),
    tickets: await prisma.supportTicket.count(),
  }

  console.log('═══════════════════════════════════════════════════════════════')
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!')
  console.log('═══════════════════════════════════════════════════════════════\n')
  console.log('📊 FINAL DATA SUMMARY:')
  console.log(`   • Users: ${finalStats.users}`)
  console.log(`   • Products: ${finalStats.products} with ${finalStats.variants} variants`)
  console.log(`   • Orders: ${finalStats.orders}`)
  console.log(`   • Total Revenue: $${finalStats.revenue.toFixed(2)}`)
  console.log(`   • Conservation Donations: $${finalStats.donations.toFixed(2)} (${((finalStats.donations / finalStats.revenue) * 100).toFixed(1)}% of revenue)`)
  console.log(`   • Abandoned Cart Sessions: ~${Math.floor(finalStats.abandonedCarts / 3)}`)
  console.log(`   • Conservation Partners: ${finalStats.partners}`)
  console.log(`   • Returns: ${finalStats.returns}`)
  console.log(`   • Support Tickets: ${finalStats.tickets}`)
  console.log('')
  console.log('🔑 LOGIN CREDENTIALS:')
  console.log('   Admin: shenna.rangel@yahoo.com / Sh3nn@R0ng3l!2025$Ocean#Admin')
  console.log('   Staff: staff@shennastudio.com / Staff2025!Ocean')
  console.log('   Demo Customers: demo.[name]@demo.shennastudio.com / demo123')
  console.log('')
  console.log('💡 NOTE: Demo data is prefixed with "Demo" or "DEMO-" for easy identification')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
