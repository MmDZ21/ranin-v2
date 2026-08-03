import * as Joi from 'joi';

/**
 * Boot-time environment validation. Missing/invalid required vars fail fast at
 * startup (with all errors reported) instead of producing forgeable tokens or
 * runtime 500s. Defaults are applied for optional values.
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3333),
  CORS_ORIGINS: Joi.string().allow('').default(''),

  DATABASE_URL: Joi.string().required(),

  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  REFRESH_JWT_SECRET: Joi.string().min(32).required(),
  REFRESH_JWT_EXPIRES_IN: Joi.string().default('30d'),

  UPLOAD_PROVIDER: Joi.string().valid('liara', 'vercel-blob').default('liara'),
  LIARA_ENDPOINT: Joi.when('UPLOAD_PROVIDER', {
    is: 'liara',
    then: Joi.string().uri().required(),
    otherwise: Joi.string().uri().optional(),
  }),
  LIARA_BUCKET_NAME: Joi.when('UPLOAD_PROVIDER', {
    is: 'liara',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  LIARA_ACCESS_KEY: Joi.when('UPLOAD_PROVIDER', {
    is: 'liara',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  LIARA_SECRET_KEY: Joi.when('UPLOAD_PROVIDER', {
    is: 'liara',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
}).unknown(true);
