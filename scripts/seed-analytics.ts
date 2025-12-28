import { PrismaClient, AnalyticsEventType } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to generate random date within last 30 days
function randomDate(daysAgo: number = 30): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

// Helper to generate session ID
function generateSessionId(): string {
  return `session_${Math.random().toString(36).substring(2, 15)}`;
}

async function seedAnalytics() {
  console.log('🌊 Starting analytics data seeding...\n');

  try {
    // Get all products and users for realistic data
    const products = await prisma.product.findMany({
      include: { variants: true },
    });

    const users = await prisma.user.findMany();

    console.log(`📊 Found ${products.length} products and ${users.length} users\n`);

    if (products.length === 0) {
      console.log('⚠️  No products found. Please seed products first.');
      return;
    }

    // Clear existing analytics data
    console.log('🧹 Clearing old analytics data...');
    await prisma.analyticsEvent.deleteMany({});
    await prisma.productAnalytics.deleteMany({});
    await prisma.userBrowsingPattern.deleteMany({});
    console.log('✅ Cleared old data\n');

    // Generate analytics events for last 30 days
    const events: any[] = [];
    const sessionsPerUser = 5; // Average sessions per user
    const eventsPerSession = 8; // Average events per session
    const anonymousSessions = 50; // Sessions from non-logged-in users

    console.log('📝 Generating analytics events...');

    // Events from logged-in users
    for (const user of users) {
      for (let session = 0; session < sessionsPerUser; session++) {
        const sessionId = generateSessionId();
        const sessionDate = randomDate(30);

        for (let i = 0; i < eventsPerSession; i++) {
          const eventDate = new Date(sessionDate.getTime() + i * 60000); // 1 min apart
          const product = products[Math.floor(Math.random() * products.length)];
          const variant = product.variants[0];

          // Determine event type (higher probability for views)
          const rand = Math.random();
          let eventType: AnalyticsEventType;
          let metadata: any = {};

          if (rand < 0.5) {
            eventType = 'PRODUCT_VIEW';
            metadata = {
              productName: product.name,
              price: variant?.price || product.basePrice,
            };
          } else if (rand < 0.7) {
            eventType = 'ADD_TO_CART';
            metadata = {
              productName: product.name,
              variantId: variant?.id,
              price: variant?.price || product.basePrice,
              quantity: Math.floor(Math.random() * 3) + 1,
            };
          } else if (rand < 0.8) {
            eventType = 'SEARCH';
            metadata = {
              query: ['ocean', 'turtle', 'bracelet', 'blue', 'pearl'][
                Math.floor(Math.random() * 5)
              ],
            };
          } else if (rand < 0.9) {
            eventType = 'CATEGORY_VIEW';
            metadata = {
              categoryId: product.categoryId,
            };
          } else if (rand < 0.95) {
            eventType = 'REMOVE_FROM_CART';
            metadata = {
              productName: product.name,
              variantId: variant?.id,
            };
          } else {
            eventType = 'PURCHASE';
            metadata = {
              productName: product.name,
              variantId: variant?.id,
              price: variant?.price || product.basePrice,
              quantity: Math.floor(Math.random() * 2) + 1,
              total: (variant?.price || product.basePrice) * (Math.floor(Math.random() * 2) + 1),
            };
          }

          events.push({
            eventType,
            timestamp: eventDate,
            sessionId,
            userId: user.id,
            productId: product.id,
            variantId: variant?.id || null,
            categoryId: product.categoryId,
            metadata,
            deviceType: ['mobile', 'desktop', 'tablet'][Math.floor(Math.random() * 3)],
            referrer: ['/', '/products', '/categories', null][Math.floor(Math.random() * 4)],
          });
        }
      }
    }

    // Events from anonymous users
    console.log('👤 Adding anonymous user events...');
    for (let i = 0; i < anonymousSessions; i++) {
      const sessionId = generateSessionId();
      const sessionDate = randomDate(30);

      for (let j = 0; j < Math.floor(Math.random() * 10) + 3; j++) {
        const eventDate = new Date(sessionDate.getTime() + j * 60000);
        const product = products[Math.floor(Math.random() * products.length)];
        const variant = product.variants[0];

        const rand = Math.random();
        let eventType: AnalyticsEventType;
        let metadata: any = {};

        if (rand < 0.6) {
          eventType = 'PRODUCT_VIEW';
          metadata = {
            productName: product.name,
            price: variant?.price || product.basePrice,
          };
        } else if (rand < 0.8) {
          eventType = 'ADD_TO_CART';
          metadata = {
            productName: product.name,
            price: variant?.price || product.basePrice,
            quantity: 1,
          };
        } else {
          eventType = 'SEARCH';
          metadata = {
            query: ['ocean', 'sea', 'marine', 'conservation'][Math.floor(Math.random() * 4)],
          };
        }

        events.push({
          eventType,
          timestamp: eventDate,
          sessionId,
          userId: null,
          productId: product.id,
          variantId: variant?.id || null,
          categoryId: product.categoryId,
          metadata,
          deviceType: ['mobile', 'desktop', 'tablet'][Math.floor(Math.random() * 3)],
          referrer: null,
        });
      }
    }

    console.log(`📊 Creating ${events.length} analytics events...`);
    await prisma.analyticsEvent.createMany({
      data: events,
    });
    console.log(`✅ Created ${events.length} events\n`);

    // Generate ProductAnalytics summaries
    console.log('📈 Calculating product analytics...');
    for (const product of products) {
      const now = new Date();
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const viewsLast7Days = await prisma.analyticsEvent.count({
        where: {
          productId: product.id,
          eventType: 'PRODUCT_VIEW',
          timestamp: { gte: last7Days },
        },
      });

      const viewsLast30Days = await prisma.analyticsEvent.count({
        where: {
          productId: product.id,
          eventType: 'PRODUCT_VIEW',
          timestamp: { gte: last30Days },
        },
      });

      const addToCartLast7Days = await prisma.analyticsEvent.count({
        where: {
          productId: product.id,
          eventType: 'ADD_TO_CART',
          timestamp: { gte: last7Days },
        },
      });

      const addToCartLast30Days = await prisma.analyticsEvent.count({
        where: {
          productId: product.id,
          eventType: 'ADD_TO_CART',
          timestamp: { gte: last30Days },
        },
      });

      const purchasesLast7Days = await prisma.analyticsEvent.count({
        where: {
          productId: product.id,
          eventType: 'PURCHASE',
          timestamp: { gte: last7Days },
        },
      });

      const purchasesLast30Days = await prisma.analyticsEvent.count({
        where: {
          productId: product.id,
          eventType: 'PURCHASE',
          timestamp: { gte: last30Days },
        },
      });

      const viewToCartRate = viewsLast30Days > 0 ? addToCartLast30Days / viewsLast30Days : 0;
      const cartToPurchaseRate =
        addToCartLast30Days > 0 ? purchasesLast30Days / addToCartLast30Days : 0;

      // Calculate trending score (weighted by recency and conversion)
      const trendingScore = Math.min(
        100,
        (viewsLast7Days * 2 + addToCartLast7Days * 5 + purchasesLast7Days * 10) / 2
      );

      await prisma.productAnalytics.create({
        data: {
          productId: product.id,
          viewsLast7Days,
          viewsLast30Days,
          addToCartLast7Days,
          addToCartLast30Days,
          purchasesLast7Days,
          purchasesLast30Days,
          viewToCartRate,
          cartToPurchaseRate,
          trendingScore,
        },
      });
    }
    console.log(`✅ Created analytics for ${products.length} products\n`);

    // Generate UserBrowsingPatterns for logged-in users
    console.log('👥 Creating user browsing patterns...');
    for (const user of users) {
      const userEvents = await prisma.analyticsEvent.findMany({
        where: { userId: user.id },
        include: {
          // Include relations if needed
        },
      });

      const totalViews = userEvents.filter((e) => e.eventType === 'PRODUCT_VIEW').length;
      const totalAddToCarts = userEvents.filter((e) => e.eventType === 'ADD_TO_CART').length;
      const totalPurchases = userEvents.filter((e) => e.eventType === 'PURCHASE').length;

      // Calculate category preferences
      const categoryViews: Record<string, number> = {};
      userEvents
        .filter((e) => e.categoryId)
        .forEach((e) => {
          const catId = e.categoryId!;
          categoryViews[catId] = (categoryViews[catId] || 0) + 1;
        });

      const categoryPreferences = Object.entries(categoryViews).map(([categoryId, count]) => ({
        categoryId,
        score: count,
      }));

      // Calculate price preferences
      const prices = userEvents
        .filter((e) => e.metadata && typeof e.metadata === 'object' && 'price' in e.metadata)
        .map((e: any) => e.metadata.price as number);

      const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : null;
      const minPrice = prices.length > 0 ? Math.min(...prices) : null;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

      // Calculate browsing time patterns (hour of day)
      const hourCounts: Record<number, number> = {};
      userEvents.forEach((e) => {
        const hour = new Date(e.timestamp).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });

      const preferredBrowsingTimes = Object.entries(hourCounts)
        .map(([hour, count]) => ({ hour: Number(hour), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      await prisma.userBrowsingPattern.create({
        data: {
          userId: user.id,
          categoryPreferences: categoryPreferences as any,
          avgPriceViewed: avgPrice,
          minPriceViewed: minPrice,
          maxPriceViewed: maxPrice,
          totalViews,
          totalAddToCarts,
          totalPurchases,
          preferredBrowsingTimes: preferredBrowsingTimes as any,
          conservationInterests: [
            'Sea Turtles',
            'Marine Conservation',
            'Ocean Cleanup',
          ].slice(0, Math.floor(Math.random() * 3) + 1) as any,
        },
      });
    }
    console.log(`✅ Created browsing patterns for ${users.length} users\n`);

    console.log('🎉 Analytics seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`  - Total events: ${events.length}`);
    console.log(`  - Products analyzed: ${products.length}`);
    console.log(`  - User patterns: ${users.length}`);
    console.log(`  - Anonymous sessions: ${anonymousSessions}`);
  } catch (error) {
    console.error('❌ Error seeding analytics:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAnalytics()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
