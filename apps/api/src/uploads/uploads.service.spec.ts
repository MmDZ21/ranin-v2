import { PutObjectCommand } from '@aws-sdk/client-s3';
import { put } from '@vercel/blob';
import { s3 } from '../lib/s3.client';
import { UploadsService } from './uploads.service';

jest.mock('@vercel/blob', () => ({ put: jest.fn() }));
jest.mock('../lib/s3.client', () => ({ s3: { send: jest.fn() } }));

const mockedPut = put as jest.MockedFunction<typeof put>;
const mockedS3Send = s3.send as jest.Mock;

const jpeg = {
  originalname: 'photo.jpg',
  mimetype: 'image/jpeg',
  size: 3,
  buffer: Buffer.from('jpg'),
};

describe('UploadsService', () => {
  const originalProvider = process.env.UPLOAD_PROVIDER;
  const originalEndpoint = process.env.LIARA_ENDPOINT;
  const originalBucket = process.env.LIARA_BUCKET_NAME;
  let service: UploadsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UploadsService();
  });

  afterAll(() => {
    process.env.UPLOAD_PROVIDER = originalProvider;
    process.env.LIARA_ENDPOINT = originalEndpoint;
    process.env.LIARA_BUCKET_NAME = originalBucket;
  });

  it('uploads to Vercel Blob when selected', async () => {
    process.env.UPLOAD_PROVIDER = 'vercel-blob';
    mockedPut.mockResolvedValue({
      url: 'https://example.public.blob.vercel-storage.com/products/test.jpg',
      downloadUrl:
        'https://example.public.blob.vercel-storage.com/products/test.jpg?download=1',
      pathname: 'products/test.jpg',
      contentType: 'image/jpeg',
      contentDisposition: 'inline',
      etag: 'test-etag',
    });

    const result = await service.uploadFile(jpeg);

    expect(result).toBe(
      'https://example.public.blob.vercel-storage.com/products/test.jpg',
    );
    expect(mockedPut).toHaveBeenCalledWith(
      expect.stringMatching(/^products\/[0-9a-f-]{36}\.jpg$/),
      jpeg.buffer,
      {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'image/jpeg',
      },
    );
    expect(mockedS3Send).not.toHaveBeenCalled();
  });

  it('keeps Liara as the default provider', async () => {
    delete process.env.UPLOAD_PROVIDER;
    process.env.LIARA_ENDPOINT = 'https://storage.example.com';
    process.env.LIARA_BUCKET_NAME = 'catalog';
    mockedS3Send.mockResolvedValue({});

    const result = await service.uploadFile(jpeg);

    expect(result).toMatch(
      /^https:\/\/storage\.example\.com\/catalog\/products\/[0-9a-f-]{36}\.jpg$/,
    );
    expect(mockedPut).not.toHaveBeenCalled();
    expect(mockedS3Send).toHaveBeenCalledTimes(1);
    expect(mockedS3Send.mock.calls[0][0]).toBeInstanceOf(PutObjectCommand);
  });

  it('rejects MIME types outside the controller allow-list', async () => {
    await expect(
      service.uploadFile({ ...jpeg, mimetype: 'image/svg+xml' }),
    ).rejects.toThrow('Unsupported file type: image/svg+xml');
  });
});
