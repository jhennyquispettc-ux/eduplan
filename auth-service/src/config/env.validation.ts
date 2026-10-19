import Joi from 'joi';
import { EnvironmentEnum } from '../shared/enums/environment.enum.js';

export const envValidation = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(EnvironmentEnum))
    .default(EnvironmentEnum.DEVELOPMENT),
  PORT: Joi.number().default(3001),
  API_PREFIX: Joi.string().default('api'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_LOGS: Joi.boolean().default(false),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  REFRESH_TOKEN_TTL_DAYS: Joi.number().integer().min(1).default(7),
  BCRYPT_ROUNDS: Joi.number().integer().min(10).max(15).default(12),

  COURSES_SERVICE_URL: Joi.string().uri().required(),
});
