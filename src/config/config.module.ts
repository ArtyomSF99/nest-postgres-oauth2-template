import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { BackendConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
  ],
  providers: [ConfigService, BackendConfigService],
  exports: [ConfigService, BackendConfigService],
})
export class BackendConfigModule {}
