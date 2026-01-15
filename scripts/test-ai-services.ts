import { BlogGenerator } from '../src/lib/ai/blog-generator';
import { generateSocialCaption } from '../src/lib/ai/social-media-manager';

async function testAI() {
  console.log('🧪 Starting AI Services Verification...\n');

  // 1. Test Blog Generator
  console.log('📝 Testing BlogGenerator...');
  const blogGen = new BlogGenerator();
  try {
    const blog = await blogGen.generate({
      topic: 'The impact of ocean conservation on coastal communities',
      keywords: ['ocean', 'conservation', 'community', 'jewelry'],
      provider: 'gemini',
      model: 'gemini-1.5-flash'
    });
    console.log('✅ Blog Generated Successfully:');
    console.log(`   Title: ${blog.title}`);
    console.log(`   Tags: ${blog.tags.join(', ')}`);
  } catch (error) {
    console.error('❌ Blog Generation Failed:', (error as Error).message);
  }

  // 2. Test Social Media Manager
  console.log('\n📱 Testing SocialMediaManager...');
  try {
    const post = await generateSocialCaption(
      {
        name: 'Ocean Wave Bracelet',
        description: 'A beautiful handcrafted bracelet inspired by the waves of the Gulf.',
        price: 24.99,
        imageUrl: '/images/products/wave-bracelet.jpg',
        category: 'Bracelets'
      },
      'instagram'
    );
    console.log('✅ Social Post Generated Successfully:');
    console.log(`   Caption: ${post.caption.substring(0, 50)}...`);
    console.log(`   Hashtags: ${post.hashtags.join(', ')}`);
  } catch (error) {
    console.error('❌ Social Post Generation Failed:', (error as Error).message);
  }

  console.log('\n✨ Verification Complete!');
}

testAI().catch(console.error);
