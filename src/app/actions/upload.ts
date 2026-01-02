"use server";
import sharp from 'sharp';
import { put } from '@vercel/blob';

export async function uploadProductImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' };
    }

    // Validate file size (max 50MB for 4K photos)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: 'File too large. Maximum size is 50MB.' };
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

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

    // Upload to Vercel Blob Storage
    const blob = await put(fileName, compressedBuffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: 'image/webp',
    });

    return { success: true, url: blob.url };
  } catch (error) {
    console.error('Image upload error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to upload image' };
  }
}
