import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BlogGenerator, AIProvider } from '@/lib/ai/blog-generator';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { topic, keywords, tone, length, provider } = body;

    if (!topic || !provider) {
      return NextResponse.json(
        { error: 'Topic and provider are required' },
        { status: 400 }
      );
    }

    const generator = new BlogGenerator();
    const result = await generator.generate({
      topic,
      keywords: keywords || [],
      tone,
      length,
      provider: provider as AIProvider,
    });

    return NextResponse.json({ success: true, blog: result });
  } catch (error: unknown) {
    console.error('Blog generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}
