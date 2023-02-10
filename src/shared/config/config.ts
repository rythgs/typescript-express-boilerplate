import path from 'path'

import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({
  path: path.join(__dirname, '../../../.env'),
})

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']),
  PORT: z.optional(z.preprocess(Number, z.number())).default(3000),
  // https://github.com/winstonjs/winston#logging
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
    .optional()
    .default('info'),
  JWT_PASSPHRASE: z.string(),
  JWT_ACCESS_TOKEN_PRIVATE_KEY: z.string(),
  JWT_ACCESS_TOKEN_PUBLIC_KEY: z.string(),
  JWT_REFRESH_TOKEN_PRIVATE_KEY: z.string(),
  JWT_REFRESH_TOKEN_PUBLIC_KEY: z.string(),
  JWT_ACCESS_TOKEN_EXPIRATION_MINUTES: z.preprocess(Number, z.number()),
  JWT_REFRESH_TOKEN_EXPIRATION_DAYS: z.preprocess(Number, z.number()),
  DB_HOST: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
})

const env = envSchema.parse(process.env)

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  db: {
    host: env.DB_HOST,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
  },
  logger: {
    level: env.LOG_LEVEL,
  },
  jwt: {
    passphrase: env.JWT_PASSPHRASE,
    accessTokenPrivateKey: env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
    accessTokenPublicKey: env.JWT_ACCESS_TOKEN_PUBLIC_KEY,
    refreshTokenPrivateKey: env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
    refreshTokenPublicKey: env.JWT_REFRESH_TOKEN_PUBLIC_KEY,
    accessTokenExpirationMinutes: env.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES,
    refreshTokenExpirationDays: env.JWT_REFRESH_TOKEN_EXPIRATION_DAYS,
  },
} as const
