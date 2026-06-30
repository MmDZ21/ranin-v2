import { argon2id, hash, verify, type Options } from 'argon2';

// OWASP-aligned argon2id parameters, used for both passwords and refresh tokens.
const OPTIONS: Options = {
  type: argon2id,
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
};

export const hashSecret = (secret: string): Promise<string> =>
  hash(secret, OPTIONS);

export const verifySecret = (
  digest: string,
  secret: string,
): Promise<boolean> => verify(digest, secret);
