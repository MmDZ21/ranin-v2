import { Injectable } from '@nestjs/common';
import { s3 } from '../lib/s3.client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class UploadsService {
  async uploadFile(file: MulterFile, folder = 'products'): Promise<string> {
    if (!file) {
      throw new Error('No file provided');
    }

    const fileId = randomUUID();
    const fileKey = `${folder}/${fileId}-${file.originalname}`;
    
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    
    return `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${fileKey}`;
  }
}
