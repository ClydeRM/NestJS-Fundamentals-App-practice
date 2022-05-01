import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
// Custom Guard
import { ApiKeyGuard } from './guards/api-key.guard';
// Custom middleware
import { LoggingMiddleware } from './middlewares/logging.middleware';

@Module({
  imports: [ConfigModule],
  providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class CommonModule implements NestModule {
  // Every custom middleware inject in Module must implement NestModule interface
  // Every custom middleware must provide a 'configure()' method
  configure(consumer: MiddlewareConsumer) {
    // consumer provides a set of useful methods to tie middleware to "specific routes"
    consumer.apply(LoggingMiddleware).forRoutes('*'); // * represent all route
    // consumer.apply(LoggingMiddleware).exclude('coffees').forRoutes('*'); // exclude all /coffees routes
    // consumer
    //   .apply(LoggingMiddleware)
    //   .forRoutes({ path: 'coffees', method: RequestMethod.GET }); // specify GET /coffees routes
  }
}
