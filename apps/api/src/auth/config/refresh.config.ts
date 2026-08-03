import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

const parseExpiresIn = (value?: string): number | undefined => {
  if (!value) {
    return undefined;
  }

  const match = value.trim().match(/^(\d+)([smhd])?$/i);
  if (!match) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : undefined;
  }

  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) {
    return undefined;
  }

  const unit = match[2]?.toLowerCase();
  switch (unit) {
    case 'm':
      return amount * 60;
    case 'h':
      return amount * 60 * 60;
    case 'd':
      return amount * 60 * 60 * 24;
    case 's':
    default:
      return amount;
  }
};

export default registerAs(
  'refresh-jwt',
  (): JwtSignOptions => ({
    secret: process.env.REFRESH_JWT_SECRET,
    expiresIn: parseExpiresIn(process.env.REFRESH_JWT_EXPIRES_IN),
  }),
);
