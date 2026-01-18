import { put, del, head, list } from '@vercel/blob';

// Support both BLOB_READ_WRITE_TOKEN (Vercel standard) and IMAGES_READ_WRITE_TOKEN (legacy)
const getBlobToken = () => process.env.BLOB_READ_WRITE_TOKEN || process.env.IMAGES_READ_WRITE_TOKEN;

export interface UploadOptions {
  folder?: string;
  addRandomSuffix?: boolean;
}

export async function uploadImage(file: File, options: UploadOptions = {}): Promise<string> {
  const { folder = 'products', addRandomSuffix = false } = options;
  
  // Generate filename
  const name = addRandomSuffix 
    ? `${file.name.split('.')[0]}-${Date.now()}.${file.name.split('.').pop()}`
    : file.name;
    
  const path = `${folder}/${name}`;
  
  try {
    const blob = await put(path, file, {
      access: 'public',
      token: getBlobToken()!,
    });

    return blob.url;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
    throw new Error('Failed to upload image: Unknown error');
  }
}

export async function uploadMultipleImages(files: File[], folder = 'products'): Promise<string[]> {
  const uploadPromises = files.map(file => 
    uploadImage(file, { folder, addRandomSuffix: true })
  );
  
  return Promise.all(uploadPromises);
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const pathname = new URL(url).pathname;
    await del(pathname, {
      token: getBlobToken()!,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
    throw new Error('Failed to delete image: Unknown error');
  }
}

export async function listImages(folder = 'products'): Promise<{ url: string; size: number; uploadedAt: Date }[]> {
  try {
    const blobs = await list({
      prefix: folder,
      token: getBlobToken()!,
    });

    return blobs.blobs.map(blob => ({
      url: blob.url,
      size: blob.size,
      uploadedAt: new Date(blob.uploadedAt)
    }));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to list images: ${error.message}`);
    }
    throw new Error('Failed to list images: Unknown error');
  }
}

export async function imageExists(url: string): Promise<boolean> {
  try {
    const pathname = new URL(url).pathname;
    await head(pathname, {
      token: getBlobToken()!,
    });
    return true;
  } catch {
    return false;
  }
}