import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './services/app.config.js';
import { GatewayConfig } from './services/gateway.config.js';
import { envValidation } from './env.validation.js';

const CONFIG_PROVIDERS = [AppConfig, GatewayConfig];

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
