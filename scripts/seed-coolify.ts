import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('🌊 Starting ShennaStudio database seed...\n');

  // 1. Create SocialMediaPost table
  console.log('📱 Creating SocialMediaPost table...');
  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "SocialMediaPost" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        platform TEXT NOT NULL,
        content TEXT NOT NULL,
        hashtags TEXT[] DEFAULT '{}',
        "imageUrl" TEXT,
        "scheduledAt" TIMESTAMP(3) NOT NULL,
        "postedAt" TIMESTAMP(3),
        status TEXT DEFAULT 'scheduled',
        "errorMessage" TEXT,
        "createdById" TEXT NOT NULL,
        "postUrl" TEXT,
        engagement JSONB,
        "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ SocialMediaPost table ready');
  } catch (error) {
    console.log('ℹ️  SocialMediaPost table already exists or error:', (error as Error).message);
  }

  // Create indexes
  try {
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "SocialMediaPost_scheduledAt_idx" ON "SocialMediaPost"("scheduledAt")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "SocialMediaPost_status_idx" ON "SocialMediaPost"(status)`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "SocialMediaPost_platform_idx" ON "SocialMediaPost"(platform)`;
    console.log('✅ Indexes created');
  } catch (error) {
    console.log('ℹ️  Indexes already exist');
  }

  // 2. Seed Subscription Plans
  console.log('\n📦 Seeding subscription plans...');
  
  const plans = [
    {
      name: 'Ocean Lover',
      tier: 'OCEAN_LOVER' as const,
      description: 'Start your ocean jewelry journey with 1 beautiful bracelet delivered each month, plus subscriber-only discounts.',
      priceMonthly: 19.99,
      braceletsPerMonth: 1,
      exclusiveDiscounts: true,
      earlyAccess: false,
      limitedEditions: false,
      vipPerks: false,
      features: ['1 Handcrafted Bracelet Monthly', '10% Subscriber Discount', 'Free Shipping on Subscription', 'Ocean Conservation Impact', 'Cancel Anytime'],
      badgeColor: '#06b6d4',
      isActive: true,
    },
    {
      name: 'Wave Rider',
      tier: 'WAVE_RIDER' as const,
      description: 'Elevate your collection with 2 bracelets monthly, early access to new designs, and exclusive subscriber perks.',
      priceMonthly: 34.99,
      braceletsPerMonth: 2,
      exclusiveDiscounts: true,
      earlyAccess: true,
      limitedEditions: false,
      vipPerks: false,
      features: ['2 Handcrafted Bracelets Monthly', '15% Subscriber Discount', 'Free Shipping Always', 'Early Access to New Designs', 'Ocean Conservation Impact', 'Priority Support'],
      badgeColor: '#14b8a6',
      isActive: true,
    },
    {
      name: 'Collector',
      tier: 'COLLECTOR' as const,
      description: 'The ultimate ocean jewelry experience. 3 bracelets including limited editions, VIP perks, and exclusive collector benefits.',
      priceMonthly: 54.99,
      braceletsPerMonth: 3,
      exclusiveDiscounts: true,
      earlyAccess: true,
      limitedEditions: true,
      vipPerks: true,
      features: ['3 Handcrafted Bracelets Monthly', '20% Subscriber Discount', 'Free Expedited Shipping', 'Limited Edition Exclusives', 'Early Access + Sneak Peeks', 'VIP Collector Perks', 'Personal Stylist Consultation', 'Birthday Surprise Gift'],
      badgeColor: '#f472b6',
      isActive: true,
    },
  ];

  for (const plan of plans) {
    try {
      const existing = await prisma.subscriptionPlan.findUnique({
        where: { tier: plan.tier }
      });

      if (existing) {
        await prisma.subscriptionPlan.update({
          where: { tier: plan.tier },
          data: plan
        });
        console.log(`✅ Updated: ${plan.name}`);
      } else {
        await prisma.subscriptionPlan.create({
          data: plan
        });
        console.log(`✅ Created: ${plan.name}`);
      }
    } catch (error) {
      console.error(`❌ Error with ${plan.name}:`, (error as Error).message);
    }
  }

  // 3. Verify
  console.log('\n📋 Verification...');
  const planCount = await prisma.subscriptionPlan.count();
  console.log(`   Subscription Plans: ${planCount}`);

  console.log('\n🎉 Database seed complete!');
}

seedDatabase()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
