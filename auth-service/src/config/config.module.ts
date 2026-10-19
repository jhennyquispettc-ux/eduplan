import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './services/app.config.js';
import { AuthConfig } from './services/auth.config.js';
import { ServicesConfig } from './services/services.config.js';
import { envValidation } from './env.validation.js';

const CONFIG_PROVIDERS = [AppConfig, AuthConfig, ServicesConfig];

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envValidation,
    }),
  ],
  providers: CONFIG_PROVIDERS,
  exports: CONFIG_PROVIDERS,
})
export class AppConfigModule {}
