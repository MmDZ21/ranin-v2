import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

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
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET,
    signOptions: {
      // Never allow a non-expiring access token — default to 15 minutes.
      expiresIn: parseExpiresIn(process.env.JWT_EXPIRES_IN) ?? 900,
    },
  }),
);
