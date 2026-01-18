import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { put } from '@vercel/blob';
import sharp from 'sharp';

// Support both BLOB_READ_WRITE_TOKEN (Vercel standard) and IMAGES_READ_WRITE_TOKEN (legacy)
const getBlobToken = () => process.env.BLOB_READ_WRITE_TOKEN || process.env.IMAGES_READ_WRITE_TOKEN;

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

    // Validate file type (including HEIC/HEIF for iPhone photos)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, GIF, and HEIC are allowed.' },
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
    // Quality 90 preserves detail for high-res iPhone photos
    // 5000x5000 max supports iPhone 17 Pro Max resolution
    const compressedBuffer = await sharp(buffer)
      .rotate() // Auto-rotate based on EXIF orientation
      .webp({ quality: 90 })
      .resize(5000, 5000, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer();

    // Generate unique filename with .webp extension
    const timestamp = Date.now();
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.webp`;

    // Check for token
    const blobToken = getBlobToken();
    if (!blobToken) {
      return NextResponse.json(
        { error: 'Image upload is not configured. Please set BLOB_READ_WRITE_TOKEN in environment variables.' },
        { status: 500 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(filename, compressedBuffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: 'image/webp',
      token: blobToken,
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
