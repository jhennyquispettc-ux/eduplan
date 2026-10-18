import Joi from 'joi';
import { EnvironmentEnum } from '../shared/enums/environment.enum.js';

export const envValidation = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(EnvironmentEnum))
    .default(EnvironmentEnum.DEVELOPMENT),
  PORT: Joi.number().default(3002),
  API_PREFIX: Joi.string().default('api'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_LOGS: Joi.boolean().default(false),
});
