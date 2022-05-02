import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Filter
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
// Guard
import { ApiKeyGuard } from './common/guards/api-key.guard';
// Interceptor
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';

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

  // 測試Interceptor的lifetime
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );

  // Set OpenAPI specification property
  const options = new DocumentBuilder()
    .setTitle('Ilovecoffee')
    .setDescription('Coffee application')
    .setVersion('1.0.0')
    .build();
  // Create document
  const document = SwaggerModule.createDocument(app, options);
  // setup('RoutePathToSwaggerUI', 'APPInstance', 'DocumentObject');
  SwaggerModule.setup('api', app, document); // UI setup in http://localhost:3000/api

  await app.listen(3000);
}
bootstrap();
