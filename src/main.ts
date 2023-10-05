import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { testEnv } from './db/data-source';
// import { TypeOrmConfigService } from './db/typeOrmConfig.serivce';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  await app.listen(process.env.PORT);
}
bootstrap();
