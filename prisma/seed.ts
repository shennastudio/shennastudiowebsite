import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🗑️  Clearing existing data...')
  await prisma.productReview.deleteMany()
  await prisma.orderNote.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.conservationDonation.deleteMany()
  await prisma.order.deleteMany()
  await prisma.inventoryTransaction.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.discountUsage.deleteMany()
  await prisma.discountCode.deleteMany()
  await prisma.emailLog.deleteMany()
  await prisma.conservationPartner.deleteMany()
  await prisma.customerReward.deleteMany()
  await prisma.user.deleteMany()

  // ===========================
  // USERS
  // ===========================

  // ADMIN PASSWORD (SECURE): Sh3nn@R0ng3l!2025$Ocean#Admin
  const hashedPassword = await bcrypt.hash('Sh3nn@R0ng3l!2025$Ocean#Admin', 10)
  const customerPassword = await bcrypt.hash('customer123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'shenna.rangel@yahoo.com',
      password: hashedPassword,
      name: 'Shenna Rangel',
      role: 'ADMIN',
    },
  })

  console.log('🔐 ADMIN LOGIN CREDENTIALS:')
  console.log('   Email: shenna.rangel@yahoo.com')
  console.log('   Password: Sh3nn@R0ng3l!2025$Ocean#Admin')
  console.log('')

  const customer1 = await prisma.user.create({
    data: {
      email: 'sarah.ocean@example.com',
      password: customerPassword,
      name: 'Sarah Ocean',
      role: 'CUSTOMER',
      rewards: {
        create: {
          points: 450,
          totalSpent: 189.95,
          totalOrders: 3,
          currentTier: 'Silver',
        },
      },
    },
  })

  const customer2 = await prisma.user.create({
    data: {
      email: 'mike.turtle@example.com',
      password: customerPassword,
      name: 'Mike Turtle',
      role: 'CUSTOMER',
      rewards: {
        create: {
          points: 250,
          totalSpent: 89.98,
          totalOrders: 2,
          currentTier: 'Bronze',
        },
      },
    },
  })

  const customer3 = await prisma.user.create({
    data: {
      email: 'lisa.waves@example.com',
      password: customerPassword,
      name: 'Lisa Waves',
      role: 'CUSTOMER',
      rewards: {
        create: {
          points: 150,
          totalSpent: 59.99,
          totalOrders: 1,
          currentTier: 'Bronze',
        },
      },
    },
  })

  console.log('✅ Created users')
  console.log('')
  console.log('👥 CUSTOMER TEST ACCOUNTS:')
  console.log('   1. Email: sarah.ocean@example.com | Password: customer123')
  console.log('   2. Email: mike.turtle@example.com | Password: customer123')
  console.log('   3. Email: lisa.waves@example.com | Password: customer123')
  console.log('')

  // ===========================
  // CATEGORIES
  // ===========================

  const oceanCategory = await prisma.category.create({
    data: {
      name: 'Ocean Inspired',
      slug: 'ocean-inspired',
      description: 'Bracelets inspired by the beauty of the ocean and marine life',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    },
  })

  const conservationCategory = await prisma.category.create({
    data: {
      name: 'Conservation Collection',
      slug: 'conservation-collection',
      description: 'Every purchase supports sea turtle and marine conservation',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400',
    },
  })

  const turtleCategory = await prisma.category.create({
    data: {
      name: 'Sea Turtle Collection',
      slug: 'sea-turtle-collection',
      description: "Bracelets inspired by Kemp's Ridley sea turtles of South Padre Island",
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    },
  })

  console.log('✅ Created categories')

  // ===========================
  // PRODUCTS & VARIANTS
  // ===========================

  const products = []

  // Product 1: Ocean Wave Bracelet
  const product1 = await prisma.product.create({
    data: {
      name: 'Ocean Wave Bracelet',
      slug: 'ocean-wave-bracelet',
      description: 'Handcrafted bracelet inspired by ocean waves. Features blue and turquoise beads representing the sea.',
      sku: 'OWB-001',
      basePrice: 29.99,
      featured: true,
      conservationPercentage: 10,
      conservationFocus: 'Sea Turtle Conservation - South Padre Island',
      categoryId: oceanCategory.id,
      variants: {
        create: [
          {
            name: 'Small - Ocean Blue',
            sku: 'OWB-001-S-BLUE',
            price: 29.99,
            stock: 25,
            size: 'Small',
            color: 'Ocean Blue',
            material: 'Glass Beads',
          },
          {
            name: 'Medium - Ocean Blue',
            sku: 'OWB-001-M-BLUE',
            price: 29.99,
            stock: 30,
            size: 'Medium',
            color: 'Ocean Blue',
            material: 'Glass Beads',
          },
          {
            name: 'Large - Ocean Blue',
            sku: 'OWB-001-L-BLUE',
            price: 32.99,
            stock: 20,
            size: 'Large',
            color: 'Ocean Blue',
            material: 'Glass Beads',
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
            alt: 'Ocean Wave Bracelet - Blue beaded design',
            position: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
            alt: 'Ocean Wave Bracelet - Detail view',
            position: 1,
          },
        ],
      },
    },
  })
  products.push(product1)

  // Product 2: Sea Turtle Guardian
  const product2 = await prisma.product.create({
    data: {
      name: 'Sea Turtle Guardian',
      slug: 'sea-turtle-guardian',
      description: "Celebrate Kemp's Ridley sea turtles with this beautiful green and gold bracelet. Perfect for ocean lovers.",
      sku: 'STG-002',
      basePrice: 34.99,
      featured: true,
      conservationPercentage: 15,
      conservationFocus: "Kemp's Ridley Sea Turtle Nesting - South Padre Island",
      categoryId: turtleCategory.id,
      variants: {
        create: [
          {
            name: 'Small - Sea Green',
            sku: 'STG-002-S-GREEN',
            price: 34.99,
            stock: 18,
            size: 'Small',
            color: 'Sea Green',
            material: 'Gemstone Beads',
          },
          {
            name: 'Medium - Sea Green',
            sku: 'STG-002-M-GREEN',
            price: 34.99,
            stock: 22,
            size: 'Medium',
            color: 'Sea Green',
            material: 'Gemstone Beads',
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800',
            alt: 'Sea Turtle Guardian Bracelet',
            position: 0,
          },
        ],
      },
    },
  })
  products.push(product2)

  // Product 3: Coral Reef Collection
  const product3 = await prisma.product.create({
    data: {
      name: 'Coral Reef Bracelet',
      slug: 'coral-reef-bracelet',
      description: 'Vibrant coral-inspired bracelet with mixed warm tones. Supports reef conservation.',
      sku: 'CRB-003',
      basePrice: 27.99,
      featured: false,
      conservationPercentage: 10,
      conservationFocus: 'Coral Reef Restoration - Rio Grande Valley',
      categoryId: conservationCategory.id,
      variants: {
        create: [
          {
            name: 'One Size - Coral Mix',
            sku: 'CRB-003-OS-CORAL',
            price: 27.99,
            stock: 35,
            size: 'One Size',
            color: 'Coral Mix',
            material: 'Mixed Beads',
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
            alt: 'Coral Reef Bracelet',
            position: 0,
          },
        ],
      },
    },
  })
  products.push(product3)

  // Product 4: Whale Song
  const product4 = await prisma.product.create({
    data: {
      name: 'Whale Song Bracelet',
      slug: 'whale-song-bracelet',
      description: 'Deep blue bracelet honoring the whales of the Gulf. Features silver accents.',
      sku: 'WSB-004',
      basePrice: 39.99,
      featured: true,
      conservationPercentage: 12,
      conservationFocus: 'Whale Migration Protection - Gulf of Mexico',
      categoryId: oceanCategory.id,
      variants: {
        create: [
          {
            name: 'Medium - Deep Blue',
            sku: 'WSB-004-M-BLUE',
            price: 39.99,
            stock: 8, // Low stock
            size: 'Medium',
            color: 'Deep Blue',
            material: 'Crystal Beads',
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
            alt: 'Whale Song Bracelet',
            position: 0,
          },
        ],
      },
    },
  })
  products.push(product4)

  // Product 5: Starfish Dreams (Out of stock)
  const product5 = await prisma.product.create({
    data: {
      name: 'Starfish Dreams Bracelet',
      slug: 'starfish-dreams-bracelet',
      description: 'Delicate peach and cream bracelet with starfish charm. Coming back soon!',
      sku: 'SDB-005',
      basePrice: 24.99,
      featured: false,
      conservationPercentage: 10,
      conservationFocus: 'Coastal Habitat Protection - South Padre Island',
      categoryId: oceanCategory.id,
      variants: {
        create: [
          {
            name: 'Small - Peach',
            sku: 'SDB-005-S-PEACH',
            price: 24.99,
            stock: 0, // Out of stock
            size: 'Small',
            color: 'Peach',
            material: 'Pearl Beads',
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800',
            alt: 'Starfish Dreams Bracelet',
            position: 0,
          },
        ],
      },
    },
  })
  products.push(product5)

  console.log('✅ Created 5 products with variants and images')

  // ===========================
  // CONSERVATION PARTNERS
  // ===========================

  const partner1 = await prisma.conservationPartner.create({
    data: {
      name: 'Sea Turtle Inc.',
      description: "South Padre Island's premier sea turtle rescue and rehabilitation center",
      logo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200',
      website: 'https://www.seaturtleinc.org',
      contactEmail: 'info@seaturtleinc.org',
      focusAreas: ["Kemp's Ridley Sea Turtles", 'Turtle Rescue', 'Education'],
      location: 'South Padre Island, TX',
      totalDonations: 1250.50,
      donationCount: 45,
      isActive: true,
      verifiedAt: new Date(),
    },
  })

  console.log('✅ Created conservation partners')

  // ===========================
  // ORDERS
  // ===========================

  // Get variants for orders
  const variants = await prisma.productVariant.findMany({
    include: { product: true },
  })

  // Order 1: Sarah's completed order
  await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-001',
      userId: customer1.id,
      customerEmail: customer1.email!,
      customerName: customer1.name!,
      shippingAddress: '123 Ocean Drive',
      shippingCity: 'South Padre Island',
      shippingState: 'TX',
      shippingZip: '78597',
      shippingCountry: 'US',
      subtotal: 64.98,
      shipping: 5.95,
      tax: 5.82,
      total: 76.75,
      status: 'DELIVERED',
      stripePaymentId: 'pi_1234567890',
      trackingNumber: '1Z999AA10123456784',
      carrier: 'USPS',
      shippingCost: 5.95,
      shippedAt: new Date('2024-12-20'),
      deliveredAt: new Date('2024-12-23'),
      createdAt: new Date('2024-12-18'),
      items: {
        create: [
          {
            variantId: variants[0].id, // Ocean Wave Small
            quantity: 1,
            price: 29.99,
          },
          {
            variantId: variants[1].id, // Ocean Wave Medium
            quantity: 1,
            price: 34.99,
          },
        ],
      },
      conservationDonation: {
        create: {
          amount: 6.50,
          percentage: 10,
          organization: 'Sea Turtle Inc.',
          region: 'South Padre Island',
          status: 'DONATED',
          partnerId: partner1.id,
        },
      },
    },
  })

  // Order 2: Mike's shipped order
  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-002',
      userId: customer2.id,
      customerEmail: customer2.email!,
      customerName: customer2.name!,
      shippingAddress: '456 Beach Boulevard',
      shippingCity: 'Brownsville',
      shippingState: 'TX',
      shippingZip: '78520',
      shippingCountry: 'US',
      subtotal: 39.99,
      shipping: 5.95,
      tax: 3.78,
      total: 49.72,
      status: 'SHIPPED',
      stripePaymentId: 'pi_0987654321',
      trackingNumber: '1Z999AA10123456999',
      carrier: 'FedEx',
      shippingCost: 5.95,
      shippedAt: new Date('2024-12-26'),
      createdAt: new Date('2024-12-24'),
      items: {
        create: [
          {
            variantId: variants[7].id, // Whale Song
            quantity: 1,
            price: 39.99,
          },
        ],
      },
      conservationDonation: {
        create: {
          amount: 4.80,
          percentage: 12,
          organization: 'Sea Turtle Inc.',
          region: 'South Padre Island',
          status: 'PLEDGED',
          partnerId: partner1.id,
        },
      },
    },
  })

  // Order 3: Lisa's pending order
  await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-003',
      userId: customer3.id,
      customerEmail: customer3.email!,
      customerName: customer3.name!,
      shippingAddress: '789 Coastal Way',
      shippingCity: 'Port Isabel',
      shippingState: 'TX',
      shippingZip: '78578',
      shippingCountry: 'US',
      subtotal: 27.99,
      shipping: 5.95,
      tax: 2.80,
      total: 36.74,
      status: 'PROCESSING',
      stripePaymentId: 'pi_1122334455',
      createdAt: new Date('2024-12-27'),
      items: {
        create: [
          {
            variantId: variants[6].id, // Coral Reef
            quantity: 1,
            price: 27.99,
          },
        ],
      },
    },
  })

  // Add order notes to order 2
  await prisma.orderNote.create({
    data: {
      orderId: order2.id,
      userId: admin.id,
      content: 'Customer requested gift wrapping - added free of charge.',
    },
  })

  console.log('✅ Created 3 sample orders')

  // ===========================
  // DISCOUNT CODES
  // ===========================

  await prisma.discountCode.create({
    data: {
      code: 'OCEAN10',
      type: 'PERCENTAGE',
      value: 10,
      description: '10% off all ocean-inspired bracelets',
      usageLimit: 100,
      usageLimitPerCustomer: 1,
      usageCount: 15,
      minPurchaseAmount: 25,
      isActive: true,
      startsAt: new Date('2024-12-01'),
      expiresAt: new Date('2025-01-31'),
      createdBy: admin.id,
    },
  })

  await prisma.discountCode.create({
    data: {
      code: 'TURTLE15',
      type: 'PERCENTAGE',
      value: 15,
      description: '15% off Sea Turtle Collection',
      usageLimit: 50,
      usageCount: 8,
      minPurchaseAmount: 30,
      applicableProducts: [product2.id],
      isActive: true,
      startsAt: new Date('2024-12-15'),
      expiresAt: new Date('2025-02-28'),
      createdBy: admin.id,
    },
  })

  await prisma.discountCode.create({
    data: {
      code: 'FREESHIP',
      type: 'FREE_SHIPPING',
      value: 0,
      description: 'Free shipping on orders over $50',
      usageLimit: 200,
      usageCount: 42,
      minPurchaseAmount: 50,
      isActive: true,
      createdBy: admin.id,
    },
  })

  console.log('✅ Created 3 discount codes')

  // ===========================
  // PRODUCT REVIEWS
  // ===========================

  // Approved review 1
  await prisma.productReview.create({
    data: {
      productId: product1.id,
      userId: customer1.id,
      rating: 5,
      title: 'Beautiful bracelet!',
      body: 'Absolutely love this ocean wave bracelet! The colors are stunning and the quality is excellent. Plus, knowing that it supports sea turtle conservation makes it even better!',
      photos: [],
      isApproved: true,
      isVerifiedPurchase: true,
      moderatedBy: admin.id,
      moderatedAt: new Date('2024-12-19'),
      helpfulCount: 8,
      createdAt: new Date('2024-12-18'),
    },
  })

  // Approved review 2
  await prisma.productReview.create({
    data: {
      productId: product2.id,
      userId: customer2.id,
      rating: 5,
      title: 'Perfect gift!',
      body: "Bought this for my daughter who loves sea turtles. She wears it every day! The craftsmanship is top-notch.",
      photos: [],
      isApproved: true,
      isVerifiedPurchase: true,
      moderatedBy: admin.id,
      moderatedAt: new Date('2024-12-20'),
      helpfulCount: 5,
      createdAt: new Date('2024-12-19'),
    },
  })

  // Pending review
  await prisma.productReview.create({
    data: {
      productId: product4.id,
      userId: customer3.id,
      rating: 4,
      title: 'Great bracelet, minor sizing issue',
      body: 'Love the design and the cause it supports. The medium was a bit loose on me, but otherwise perfect!',
      photos: [],
      isApproved: false,
      isRejected: false,
      isVerifiedPurchase: true,
      helpfulCount: 0,
      createdAt: new Date('2024-12-27'),
    },
  })

  // Guest review (pending)
  await prisma.productReview.create({
    data: {
      productId: product3.id,
      rating: 5,
      body: 'Amazing bracelet! The coral colors are so vibrant.',
      photos: [],
      customerName: 'Emily Shores',
      customerEmail: 'emily@example.com',
      isApproved: false,
      isRejected: false,
      isVerifiedPurchase: false,
      helpfulCount: 0,
      createdAt: new Date('2024-12-26'),
    },
  })

  console.log('✅ Created 4 product reviews')

  // ===========================
  // INVENTORY TRANSACTIONS
  // ===========================

  await prisma.inventoryTransaction.create({
    data: {
      variantId: variants[0].id,
      userId: admin.id,
      type: 'RESTOCK',
      quantity: 50,
      notes: 'Initial stock - new product launch',
      createdAt: new Date('2024-12-01'),
    },
  })

  await prisma.inventoryTransaction.create({
    data: {
      variantId: variants[0].id,
      type: 'SALE',
      quantity: -1,
      notes: 'Order #ORD-2024-001',
      createdAt: new Date('2024-12-18'),
    },
  })

  await prisma.inventoryTransaction.create({
    data: {
      variantId: variants[7].id,
      userId: admin.id,
      type: 'ADJUSTMENT',
      quantity: -2,
      notes: 'Damaged during shipping - removed from inventory',
      createdAt: new Date('2024-12-25'),
    },
  })

  console.log('✅ Created inventory transactions')

  // ===========================
  // EMAIL LOGS
  // ===========================

  await prisma.emailLog.create({
    data: {
      to: customer1.email!,
      subject: 'Your ShennaStudio Order Confirmation #ORD-2024-001',
      template: 'ORDER_CONFIRMATION',
      status: 'sent',
      provider: 'resend',
      providerId: 'email_abc123',
      sentAt: new Date('2024-12-18'),
      openedAt: new Date('2024-12-18T10:30:00'),
      createdAt: new Date('2024-12-18'),
    },
  })

  await prisma.emailLog.create({
    data: {
      to: customer2.email!,
      subject: 'Your Order Has Shipped! #ORD-2024-002',
      template: 'SHIPPING_NOTIFICATION',
      status: 'sent',
      provider: 'resend',
      providerId: 'email_def456',
      sentAt: new Date('2024-12-26'),
      createdAt: new Date('2024-12-26'),
    },
  })

  await prisma.emailLog.create({
    data: {
      to: 'bounce@example.com',
      subject: 'Your ShennaStudio Order Confirmation',
      template: 'ORDER_CONFIRMATION',
      status: 'failed',
      provider: 'resend',
      error: 'Email bounced - invalid address',
      retryCount: 2,
      createdAt: new Date('2024-12-27'),
    },
  })

  console.log('✅ Created email logs')

  console.log('\n🎉 Seeding completed successfully!\n')
  console.log('📝 Summary:')
  console.log('   - 4 users (1 admin, 3 customers)')
  console.log('   - 3 categories')
  console.log('   - 5 products with 9 variants')
  console.log('   - 3 orders (delivered, shipped, processing)')
  console.log('   - 3 discount codes')
  console.log('   - 4 product reviews (2 approved, 2 pending)')
  console.log('   - 3 inventory transactions')
  console.log('   - 3 email logs')
  console.log('   - 1 conservation partner\n')
  console.log('🔑 Login credentials:')
  console.log('   Admin: shenna.rangel@yahoo.com / Sh3nn@R0ng3l!2025$Ocean#Admin')
  console.log('   Customer: sarah.ocean@example.com / customer123')
  console.log('   Customer: mike.turtle@example.com / customer123')
  console.log('   Customer: lisa.waves@example.com / customer123\n')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
