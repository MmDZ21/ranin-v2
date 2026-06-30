import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../lib/s3.client';

interface MulterFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class UploadsService {
  async uploadFile(file: MulterFile, folder = 'products'): Promise<string> {
    const bucket = process.env.LIARA_BUCKET_NAME;
    const endpoint = process.env.LIARA_ENDPOINT;

    // Derive a safe extension from the original name — never interpolate the
    // raw client-supplied filename into the S3 key (path-traversal / key abuse).
    const ext = extname(file.originalname)
      .toLowerCase()
      .replace(/[^.a-z0-9]/g, '');
    const fileKey = `${folder}/${randomUUID()}${ext}`;

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
