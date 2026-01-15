import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || '');

export interface SocialMediaPost {
  platform: 'instagram' | 'facebook' | 'pinterest' | 'twitter';
  caption: string;
  hashtags: string[];
  imageUrl: string;
  scheduledAt: Date;
}

export interface ProductInfo {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

/**
 * Generate engaging social media captions using Gemini AI
 */
export async function generateSocialCaption(
  product: ProductInfo,
  platform: 'instagram' | 'facebook' | 'pinterest' | 'twitter',
  tone: 'casual' | 'professional' | 'enthusiastic' = 'enthusiastic'
): Promise<{ caption: string; hashtags: string[] }> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a social media expert for an ocean-themed handcrafted jewelry business called ShennaStudio.

Product Details:
- Name: ${product.name}
- Description: ${product.description}
- Price: $${product.price}
- Category: ${product.category}

Platform: ${platform}
Tone: ${tone}

Create an engaging ${platform} post caption that:
1. Highlights the beauty and uniqueness of this ocean-inspired jewelry
2. Mentions that 10% of sales support marine conservation
3. Creates emotional connection with ocean lovers
4. Includes a clear call-to-action
5. Is ${platform === 'twitter' ? 'under 280 characters' : platform === 'instagram' ? 'engaging and story-driven (max 200 words)' : 'descriptive and informative'}

Also suggest 10-15 relevant hashtags for maximum reach.

Format your response as:
CAPTION:
[your caption here]

HASHTAGS:
[comma-separated hashtags without # symbol]`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse the response
    const captionMatch = response.match(/CAPTION:\s*([\s\S]*?)(?=HASHTAGS:|$)/i);
    const hashtagsMatch = response.match(/HASHTAGS:\s*([\s\S]*?)$/i);

    const caption = captionMatch ? captionMatch[1].trim() : response;
    const hashtagsText = hashtagsMatch ? hashtagsMatch[1].trim() : '';
    const hashtags = hashtagsText
      .split(',')
      .map(tag => tag.trim().replace(/^#/, ''))
      .filter(tag => tag.length > 0)
      .slice(0, 15);

    return { caption, hashtags };
  } catch (error) {
    console.error('AI caption generation error:', error);
    
    // Fallback caption
    return {
      caption: `✨ ${product.name} ✨\n\n${product.description}\n\n🌊 Handcrafted with love in South Padre Island\n💙 10% supports ocean conservation\n\nShop now! Link in bio 👆`,
      hashtags: [
        'oceanjewelry',
        'handmadejewelry',
        'beachjewelry',
        'oceanconservation',
        'coastalstyle',
        'mermaidvibes',
        'seasidestyle',
        'handcrafted',
        'supportoceans'
      ]
    };
  }
}

/**
 * Generate optimal posting times based on platform
 */
export function getOptimalPostingTimes(platform: string): Date[] {
  const now = new Date();
  const times: Date[] = [];

  // Best times based on platform research
  const schedules = {
    instagram: [
      { hour: 9, minute: 0 },  // 9 AM
      { hour: 14, minute: 0 }, // 2 PM
      { hour: 19, minute: 0 }  // 7 PM
    ],
    facebook: [
      { hour: 10, minute: 0 }, // 10 AM
      { hour: 13, minute: 0 }, // 1 PM
      { hour: 20, minute: 0 }  // 8 PM
    ],
    pinterest: [
      { hour: 8, minute: 30 },  // 8:30 AM
      { hour: 15, minute: 0 },  // 3 PM
      { hour: 21, minute: 0 }   // 9 PM
    ],
    twitter: [
      { hour: 8, minute: 0 },   // 8 AM
      { hour: 12, minute: 0 },  // 12 PM
      { hour: 17, minute: 0 }   // 5 PM
    ]
  };

  const platformSchedule = schedules[platform as keyof typeof schedules] || schedules.instagram;

  // Generate next 7 days of posting times
  for (let day = 0; day < 7; day++) {
    platformSchedule.forEach(time => {
      const postDate = new Date(now);
      postDate.setDate(postDate.getDate() + day);
      postDate.setHours(time.hour, time.minute, 0, 0);
      
      // Only schedule future times
      if (postDate > now) {
        times.push(postDate);
      }
    });
  }

  return times.slice(0, 14); // Return next 14 posting slots
}

/**
 * Create a complete social media content calendar
 */
export async function createContentCalendar(
  products: ProductInfo[],
  startDate: Date = new Date(),
  daysAhead: number = 14
): Promise<SocialMediaPost[]> {
  const posts: SocialMediaPost[] = [];
  const platforms: Array<'instagram' | 'facebook' | 'pinterest'> = [
    'instagram',
    'facebook', 
    'pinterest'
  ];

  // Rotate through products and platforms
  let productIndex = 0;
  let platformIndex = 0;

  // Generate 2 posts per day until Jan 31
  const endDate = new Date('2026-01-31T23:59:59');
  const currentDate = new Date(startDate);

  while (currentDate <= endDate && productIndex < products.length * 3) {
    const product = products[productIndex % products.length];
    const platform = platforms[platformIndex % platforms.length];

    // Get optimal times for this platform
    const times = getOptimalPostingTimes(platform);
    const timeSlot = times[Math.floor(Math.random() * Math.min(3, times.length))];

    // Generate AI caption
    const { caption, hashtags } = await generateSocialCaption(product, platform);

    posts.push({
      platform,
      caption,
      hashtags,
      imageUrl: product.imageUrl,
      scheduledAt: timeSlot
    });

    // Move to next product and platform
    productIndex++;
    platformIndex++;
    
    // Every 2 posts, move to next day
    if (posts.length % 2 === 0) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return posts.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
}

/**
 * Get trending hashtags for ocean/jewelry niche
 */
export function getTrendingOceanHashtags(): string[] {
  return [
    'oceanjewelry',
    'beachjewelry',
    'coastaljewelry',
    'handmadejewelry',
    'oceanconservation',
    'saveouroceans',
    'marineconservation',
    'oceanlover',
    'beachlife',
    'coastalliving',
    'mermaidlife',
    'sealife',
    'oceanvibes',
    'beachstyle',
    'coastalstyle',
    'handcraftedjewelry',
    'artisanjewelry',
    'uniquejewelry',
    'statementjewelry',
    'southpadreisland',
    'texasbeach',
    'gulfcoast',
    'beachboutique',
    'oceaninspired',
    'nauticaljewelry'
  ];
}
