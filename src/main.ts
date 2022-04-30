import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 檢查Request資料完整性
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 限制request，只傳入DTO規定的內容
      transform: true, // 自動轉換 request Body, 將Body的型別成DTO的類別物件，會輕微影響效能
      forbidNonWhitelisted: true, // 抵擋request，如果request body有DTO規定外的欄位，request被攔截
      transformOptions: {
        enableImplicitConversion: true, // 不需要在額外標示@Type， ValidationPipe會依據原設定資料型態去驗證
      },
    }),
  );

  // 處理錯誤跟回覆錯誤訊息
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
