import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 檢查Request資料完整性
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 限制response，只回傳DTO規定的內容
      transform: true, // 自動轉換 request Params, Body的型別成DTO規定的型別
      forbidNonWhitelisted: true, // 抵擋request，如果request body有DTO規定外的欄位，request被攔截
    }),
  );

  await app.listen(3000);
}
bootstrap();
