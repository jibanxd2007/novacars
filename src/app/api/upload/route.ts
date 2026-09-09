import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { isCloudinaryConfigured, uploadToCloudinary } from '@/lib/cloudinary';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload JPG, PNG, or WebP images.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum limit of 15MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. If Cloudinary is configured in environment, upload to Cloudinary CDN
    if (isCloudinaryConfigured) {
      try {
        const uploadResult = await uploadToCloudinary(buffer);
        if (uploadResult) {
          return NextResponse.json({
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            success: true,
            provider: 'cloudinary',
          });
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload warning:', cloudErr);
      }
    }

    // 2. Try writing to local disk (works in local dev environment)
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });

      const ext = path.extname(file.name) || '.jpg';
      const cleanName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '');
      const filename = `${Date.now()}-${cleanName || 'vehicle'}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      await writeFile(filePath, buffer);
      const publicUrl = `/uploads/${filename}`;

      return NextResponse.json({
        url: publicUrl,
        success: true,
        provider: 'local',
      });
    } catch (fsErr) {
      // 3. Fallback for serverless (Vercel read-only filesystem):
      // Convert to optimized Data URL and return immediately
      console.log('Read-only filesystem detected on serverless. Returning Data URL fallback.');
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;

      return NextResponse.json({
        url: dataUrl,
        success: true,
        provider: 'data-url',
      });
    }
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
