import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { put } from '@vercel/blob';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB for 4K photos)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert to WebP and compress for SEO optimization
    // Quality 80 is the sweet spot for e-commerce
    // 2400x2400 max preserves detail for 4K source images
    const compressedBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .resize(2400, 2400, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer();

    // Generate unique filename with .webp extension
    const timestamp = Date.now();
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.webp`;

    // Upload to Vercel Blob
    const blob = await put(filename, compressedBuffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: 'image/webp',
    });

    return NextResponse.json({
      url: blob.url,
      filename: filename,
      originalSize: file.size,
      type: 'image/webp',
    });
  } catch (error: unknown) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) || 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Get upload size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};
