import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class BackendConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return Number(this.configService.get<number>('nodeConfiguration.port'));
  }

  get typeormConfigOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<string>('database.type'),
      host: this.configService.get<string>('database.host'),
      port: Number(this.configService.get<number>('database.port')),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
      logging: ['error'],
      logger: 'simple-console',
      maxQueryExecutionTime: 1000,
    } as TypeOrmModuleOptions;
  }

  get jwt() {
    return {
      accessTokenSecret: this.configService.get<string>(
        'jwt.accessTokenSecret',
      ),
      accessTokenTime: this.configService.get<string>('jwt.accessTokenTime'),
      refreshTokenSecret: this.configService.get<string>(
        'jwt.refreshTokenSecret',
      ),
      refreshTokenTime: this.configService.get<string>('jwt.refreshTokenTime'),
    };
  }
}
