"use server";
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadProductImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
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
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Ignore error if directory already exists
      console.log('Directory check', error);
    }

    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, compressedBuffer);

    return { success: true, url: `/uploads/${fileName}` };
  } catch (error) {
    console.error('Image upload error:', error);
    return { success: false, error: 'Failed to upload image' };
  }
}
