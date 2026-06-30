import { hashSecret, verifySecret } from './hashing';

describe('hashing', () => {
  it('hashes and verifies a secret', async () => {
    const hash = await hashSecret('s3cret-token');
    expect(hash).not.toBe('s3cret-token');
    expect(await verifySecret(hash, 's3cret-token')).toBe(true);
  });

  it('rejects an incorrect secret', async () => {
    const hash = await hashSecret('correct');
    expect(await verifySecret(hash, 'wrong')).toBe(false);
  });

  it('produces distinct (salted) hashes for the same input', async () => {
    const a = await hashSecret('same-input');
    const b = await hashSecret('same-input');
    expect(a).not.toBe(b);
  });
});
