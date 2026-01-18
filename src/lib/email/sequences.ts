import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export interface EmailSequence {
  name: string;
  trigger: 'welcome' | 'abandoned_cart' | 'post_purchase' | 'win_back';
  delay: number; // minutes
  subject: string;
  content: string;
}

/**
 * Welcome Email Sequence
 */
export const welcomeSequence: EmailSequence[] = [
  {
    name: 'Welcome Email',
    trigger: 'welcome',
    delay: 0, // Send immediately
    subject: "🌊 Welcome to Shenna's Studio - Your Ocean Journey Begins!",
    content: `
      <h1>Welcome to the Shenna's Studio Family! 🌊</h1>
      <p>Thank you for joining our ocean-loving community!</p>
      
      <h2>Here's what makes us special:</h2>
      <ul>
        <li>🐋 Handcrafted ocean-inspired jewelry</li>
        <li>💙 10% of sales support marine conservation</li>
        <li>✨ Each piece tells a story</li>
        <li>🎁 Exclusive subscriber-only offers</li>
      </ul>
      
      <p><strong>Special Welcome Gift:</strong> Use code <strong>OCEANSALE25</strong> for 25% OFF your first purchase!</p>
      
      <a href="https://shennastudio.com/products" style="background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Shop Ocean Treasures →</a>
      
      <p>With ocean love,<br>The Shenna's Studio Team 💖</p>
    `
  },
  {
    name: 'Product Showcase',
    trigger: 'welcome',
    delay: 2880, // 2 days
    subject: '✨ Discover Our Most-Loved Ocean Treasures',
    content: `
      <h1>Our Customers' Favorites 💙</h1>
      <p>Since you joined us, we wanted to share some of our most beloved pieces...</p>
      
      <p>Each bracelet is handcrafted with love and helps protect our oceans. Here are the pieces our community adores:</p>
      
      <p><strong>👉 Browse Best Sellers</strong></p>
      
      <a href="https://shennastudio.com/products?featured=true">View Collection →</a>
      
      <p>Remember: Your code <strong>OCEANSALE25</strong> is still active! 🎁</p>
    `
  }
];

/**
 * Abandoned Cart Sequence
 */
export const abandonedCartSequence: EmailSequence[] = [
  {
    name: 'Cart Reminder - 1 Hour',
    trigger: 'abandoned_cart',
    delay: 60, // 1 hour
    subject: '🛍️ You Left Something Behind...',
    content: `
      <h1>Don't Forget Your Ocean Treasures! 🌊</h1>
      <p>We noticed you left some beautiful pieces in your cart...</p>
      
      <p>Your items are waiting for you:</p>
      {cart_items}
      
      <p><strong>Complete your purchase now and save 25% with code OCEANSALE25!</strong></p>
      
      <a href="https://shennastudio.com/cart">Complete My Purchase →</a>
      
      <p>These handcrafted pieces are popular and may sell out soon! 💫</p>
    `
  },
  {
    name: 'Cart Reminder - Extra Incentive',
    trigger: 'abandoned_cart',
    delay: 1440, // 24 hours
    subject: '🎁 Still Thinking? Here\'s An Extra Surprise!',
    content: `
      <h1>We Really Want You to Have These! 💙</h1>
      <p>Your cart is still waiting, and we've added something special...</p>
      
      <p><strong>🎉 Use code OCEANSALE25 for 25% OFF + FREE SHIPPING on orders $50+!</strong></p>
      
      <a href="https://shennastudio.com/cart">Claim My Discount →</a>
      
      <p>This offer expires in 48 hours! ⏰</p>
    `
  }
];

/**
 * Post-Purchase Sequence
 */
export const postPurchaseSequence: EmailSequence[] = [
  {
    name: 'Thank You Email',
    trigger: 'post_purchase',
    delay: 0,
    subject: '🎉 Thank You for Your Order!',
    content: `
      <h1>Your Ocean Treasure is On Its Way! 🌊</h1>
      <p>Thank you so much for your purchase! We're thrilled to welcome you to the Shenna's Studio family.</p>
      
      <p><strong>📦 Your order is being carefully prepared...</strong></p>
      
      <p>You'll receive tracking information as soon as your package ships!</p>
      
      <p>💙 Through your purchase, you're helping protect our oceans. 10% goes directly to marine conservation!</p>
      
      <p>Follow us on Instagram @shennastudio to see more ocean-inspired creations!</p>
    `
  },
  {
    name: 'Review Request',
    trigger: 'post_purchase',
    delay: 10080, // 7 days
    subject: '💖 How Are You Loving Your Ocean Treasure?',
    content: `
      <h1>We'd Love Your Feedback! ⭐</h1>
      <p>It's been a week since your ocean treasure arrived...</p>
      
      <p>We hope you're absolutely loving it! Would you mind sharing your experience?</p>
      
      <p>Your review helps other ocean lovers discover our handcrafted pieces.</p>
      
      <a href="https://shennastudio.com/reviews">Leave a Review →</a>
      
      <p><strong>As a thank you, we'll send you an exclusive 15% OFF code for your next purchase!</strong></p>
    `
  }
];

/**
 * Win-Back Sequence (for inactive customers)
 */
export const winBackSequence: EmailSequence[] = [
  {
    name: 'We Miss You',
    trigger: 'win_back',
    delay: 0,
    subject: '🌊 We Miss You! Come Back to the Ocean...',
    content: `
      <h1>The Ocean is Calling You Back! 💙</h1>
      <p>It's been a while since we've seen you...</p>
      
      <p>We have new ocean treasures you'll love, and we're offering you an exclusive welcome-back gift:</p>
      
      <p><strong>🎁 25% OFF your next purchase with code OCEANSALE25</strong></p>
      
      <p>Plus, check out what's new:</p>
      <ul>
        <li>New whale shark collection</li>
        <li>Limited edition sea turtle designs</li>
        <li>Fresh ocean-inspired pieces</li>
      </ul>
      
      <a href="https://shennastudio.com/products">Dive Back In →</a>
    `
  }
];

/**
 * Schedule email for a specific sequence
 */
export async function scheduleSequenceEmail(
  recipientEmail: string,
  sequence: EmailSequence,
  variables: Record<string, string> = {}
): Promise<void> {
  // Replace variables in content
  let content = sequence.content;
  Object.entries(variables).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{${key}}`, 'g'), value);
  });

  // Schedule the email - store delay in variables since scheduledAt isn't in schema
  const sendAt = new Date(Date.now() + sequence.delay * 60 * 1000);

  await prisma.emailLog.create({
    data: {
      to: recipientEmail,
      subject: sequence.subject,
      template: 'NEWSLETTER', // Using existing template
      status: 'pending',
      variables: {
        content,
        sequenceName: sequence.name,
        scheduledFor: sendAt.toISOString(),
        delayMinutes: sequence.delay,
        ...variables
      }
    }
  });
}

/**
 * Trigger welcome sequence for new subscriber
 */
export async function triggerWelcomeSequence(email: string, name?: string): Promise<void> {
  for (const sequence of welcomeSequence) {
    await scheduleSequenceEmail(email, sequence, {
      name: name || 'Ocean Lover'
    });
  }
}

/**
 * Trigger abandoned cart sequence
 */
export async function triggerAbandonedCartSequence(
  email: string,
  cartItems: string
): Promise<void> {
  for (const sequence of abandonedCartSequence) {
    await scheduleSequenceEmail(email, sequence, {
      cart_items: cartItems
    });
  }
}
