-- Seed Subscription Plans for ShennaStudio
-- Run this directly on Coolify PostgreSQL 17

-- First, clear existing plans (optional - remove if you want to keep existing)
-- DELETE FROM subscription_plans;

-- Insert Ocean Lover Plan (Basic)
INSERT INTO subscription_plans (
  id, name, tier, description, "priceMonthly", "stripePriceId",
  "braceletsPerMonth", "exclusiveDiscounts", "earlyAccess", "limitedEditions", "vipPerks",
  features, "badgeColor", "isActive", "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'Ocean Lover',
  'OCEAN_LOVER',
  'Start your ocean jewelry journey with 1 beautiful bracelet delivered each month, plus subscriber-only discounts.',
  19.99,
  NULL, -- Add your Stripe price ID here: 'price_xxxxx'
  1,    -- 1 bracelet per month
  true, -- exclusiveDiscounts
  false, -- earlyAccess
  false, -- limitedEditions
  false, -- vipPerks
  ARRAY['1 Handcrafted Bracelet Monthly', '10% Subscriber Discount', 'Free Shipping on Subscription', 'Ocean Conservation Impact', 'Cancel Anytime'],
  '#06b6d4', -- cyan
  true,
  NOW(),
  NOW()
) ON CONFLICT (tier) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "priceMonthly" = EXCLUDED."priceMonthly",
  features = EXCLUDED.features,
  "updatedAt" = NOW();

-- Insert Wave Rider Plan (Popular)
INSERT INTO subscription_plans (
  id, name, tier, description, "priceMonthly", "stripePriceId",
  "braceletsPerMonth", "exclusiveDiscounts", "earlyAccess", "limitedEditions", "vipPerks",
  features, "badgeColor", "isActive", "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'Wave Rider',
  'WAVE_RIDER',
  'Elevate your collection with 2 bracelets monthly, early access to new designs, and exclusive subscriber perks.',
  34.99,
  NULL, -- Add your Stripe price ID here
  2,    -- 2 bracelets per month
  true, -- exclusiveDiscounts
  true, -- earlyAccess
  false, -- limitedEditions
  false, -- vipPerks
  ARRAY['2 Handcrafted Bracelets Monthly', '15% Subscriber Discount', 'Free Shipping Always', 'Early Access to New Designs', 'Ocean Conservation Impact', 'Priority Support'],
  '#14b8a6', -- teal
  true,
  NOW(),
  NOW()
) ON CONFLICT (tier) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "priceMonthly" = EXCLUDED."priceMonthly",
  features = EXCLUDED.features,
  "updatedAt" = NOW();

-- Insert Collector Plan (Premium/VIP)
INSERT INTO subscription_plans (
  id, name, tier, description, "priceMonthly", "stripePriceId",
  "braceletsPerMonth", "exclusiveDiscounts", "earlyAccess", "limitedEditions", "vipPerks",
  features, "badgeColor", "isActive", "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'Collector',
  'COLLECTOR',
  'The ultimate ocean jewelry experience. 3 bracelets including limited editions, VIP perks, and exclusive collector benefits.',
  54.99,
  NULL, -- Add your Stripe price ID here
  3,    -- 3 bracelets per month
  true, -- exclusiveDiscounts
  true, -- earlyAccess
  true, -- limitedEditions
  true, -- vipPerks
  ARRAY['3 Handcrafted Bracelets Monthly', '20% Subscriber Discount', 'Free Expedited Shipping', 'Limited Edition Exclusives', 'Early Access + Sneak Peeks', 'VIP Collector Perks', 'Personal Stylist Consultation', 'Birthday Surprise Gift'],
  '#f472b6', -- pink
  true,
  NOW(),
  NOW()
) ON CONFLICT (tier) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "priceMonthly" = EXCLUDED."priceMonthly",
  features = EXCLUDED.features,
  "updatedAt" = NOW();

-- Verify the inserts
SELECT id, name, tier, "priceMonthly", "braceletsPerMonth", "isActive" FROM subscription_plans;
