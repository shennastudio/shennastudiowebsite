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

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: 'File too large. Maximum size is 5MB.' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert to WebP and compress
    // 80 is the sweet spot for e-commerce
    const compressedBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .resize(1200, 1200, {
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
