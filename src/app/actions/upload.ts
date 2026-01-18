"use server";
import sharp from 'sharp';
import { put } from '@vercel/blob';

export async function uploadProductImage(formData: FormData) {
  try {
    // Check for Vercel Blob token first
    if (!process.env.IMAGES_READ_WRITE_TOKEN) {
      console.error('IMAGES_READ_WRITE_TOKEN is not configured');
      return { success: false, error: 'Image upload is not configured. Please set IMAGES_READ_WRITE_TOKEN in environment variables.' };
    }

    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file type (including HEIC/HEIF for iPhone photos)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only JPEG, PNG, WebP, GIF, and HEIC are allowed.' };
    }

    // Validate file size (max 50MB for 4K photos)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: 'File too large. Maximum size is 50MB.' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert to WebP and compress for SEO optimization
    // Quality 90 preserves detail for high-res iPhone photos
    // 5000x5000 max supports iPhone 17 Pro Max resolution
    let compressedBuffer: Buffer;
    try {
      compressedBuffer = await sharp(buffer)
        .rotate() // Auto-rotate based on EXIF orientation
        .webp({ quality: 90 })
        .resize(5000, 5000, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toBuffer();
    } catch (sharpError) {
      console.error('Image processing error:', sharpError);
      return { success: false, error: 'Failed to process image. Please try a different image format.' };
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

    // Upload to Vercel Blob Storage
    try {
      const blob = await put(fileName, compressedBuffer, {
        access: 'public',
        addRandomSuffix: true,
        contentType: 'image/webp',
        token: process.env.IMAGES_READ_WRITE_TOKEN,
      });

      return { success: true, url: blob.url };
    } catch (blobError) {
      console.error('Blob upload error:', blobError);
      return { success: false, error: 'Failed to upload to storage. Please check your connection and try again.' };
    }
  } catch (error) {
    console.error('Image upload error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to upload image' };
  }
}
