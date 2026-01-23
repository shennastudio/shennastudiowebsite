import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { file, public_id, folder, transformation } = await request.json();

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      public_id,
      folder: folder || 'lapesqueria',
      transformation,
      resource_type: 'image',
    });

    return NextResponse.json({
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      created_at: result.created_at,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
