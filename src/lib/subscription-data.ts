// Subscription plan data - shared between server and client components

export type SubscriptionTier = 'BASIC' | 'PREMIUM' | 'COLLECTOR';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PlanData {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  description: string;
  features: PlanFeature[];
  braceletsPerMonth: number;
  badgeColor: string;
  isPopular?: boolean;
}

export const SUBSCRIPTION_PLANS: PlanData[] = [
  {
    id: 'basic',
    name: 'Ocean Explorer',
    tier: 'BASIC',
    price: 19,
    description: 'Perfect for starting your ocean journey',
    braceletsPerMonth: 1,
    badgeColor: 'cyan',
    features: [
      { text: '1 handcrafted bracelet monthly', included: true },
      { text: 'Conservation updates & stories', included: true },
      { text: 'Exclusive member newsletter', included: true },
      { text: 'Free standard shipping', included: true },
      { text: 'Member discounts (5% off)', included: false },
      { text: 'Early access to new designs', included: false },
      { text: 'Limited edition pieces', included: false },
      { text: 'VIP conservation events', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Wave Guardian',
    tier: 'PREMIUM',
    price: 39,
    description: 'For dedicated ocean advocates',
    braceletsPerMonth: 2,
    badgeColor: 'teal',
    isPopular: true,
    features: [
      { text: '2 handcrafted bracelets monthly', included: true },
      { text: 'Conservation updates & stories', included: true },
      { text: 'Exclusive member newsletter', included: true },
      { text: 'Free priority shipping', included: true },
      { text: 'Member discounts (10% off)', included: true },
      { text: 'Early access to new designs', included: true },
      { text: 'Limited edition pieces', included: false },
      { text: 'VIP conservation events', included: false },
    ],
  },
  {
    id: 'collector',
    name: 'Tide Master',
    tier: 'COLLECTOR',
    price: 59,
    description: 'The ultimate conservation supporter',
    braceletsPerMonth: 3,
    badgeColor: 'purple',
    features: [
      { text: '3 handcrafted bracelets monthly', included: true },
      { text: 'Conservation updates & stories', included: true },
      { text: 'Exclusive member newsletter', included: true },
      { text: 'Free express shipping', included: true },
      { text: 'Member discounts (15% off)', included: true },
      { text: 'Early access to new designs', included: true },
      { text: 'Limited edition pieces', included: true },
      { text: 'VIP conservation events', included: true },
    ],
  },
];
