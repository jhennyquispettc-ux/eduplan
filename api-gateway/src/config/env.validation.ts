import Joi from 'joi';
import { EnvironmentEnum } from '../shared/enums/environment.enum.js';

export const envValidation = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(EnvironmentEnum))
    .default(EnvironmentEnum.DEVELOPMENT),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api'),
  CORS_ORIGINS: Joi.string().default('*'),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),

  AUTH_SERVICE_URL: Joi.string().uri().required(),
  COURSES_SERVICE_URL: Joi.string().uri().required(),
  PROXY_TIMEOUT_MS: Joi.number().integer().min(1000).default(10000),

  THROTTLE_TTL_MS: Joi.number().integer().min(1000).default(60000),
  THROTTLE_LIMIT: Joi.number().integer().min(1).default(100),
  THROTTLE_AUTH_LIMIT: Joi.number().integer().min(1).default(10),
});
