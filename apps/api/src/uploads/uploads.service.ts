import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { put } from '@vercel/blob';
import { s3 } from '../lib/s3.client';

interface MulterFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// Maps each MIME type accepted by the controller's ALLOWED_MIME filter to a
// fixed extension. The stored extension is derived solely from the
// already-validated file.mimetype — never from the client-supplied
// originalname — so it can never diverge from the validated content type.
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'application/pdf': '.pdf',
};

@Injectable()
export class UploadsService {
  async uploadFile(file: MulterFile, folder = 'products'): Promise<string> {
    const ext = MIME_TO_EXT[file.mimetype];
    if (!ext) {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }
    const fileKey = `${folder}/${randomUUID()}${ext}`;

    if (process.env.UPLOAD_PROVIDER === 'vercel-blob') {
      const blob = await put(fileKey, file.buffer, {
        access: 'public',
        addRandomSuffix: false,
        contentType: file.mimetype,
      });
      return blob.url;
    }

    const bucket = process.env.LIARA_BUCKET_NAME;
    const endpoint = process.env.LIARA_ENDPOINT;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `${endpoint}/${bucket}/${fileKey}`;
  }
}
