import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  // Every custom middleware must implement NestMiddleware interface
  // Every custom middleware must provide a 'use method'
  use(req: any, res: any, next: () => void) {
    // req is from pervious middleware or request arguments
    // res is this middleware want to pass to the next middleware arguments
    // next() is a method, called the next middleware
    console.time('Request-response time');
    console.log('hi from next middleware');
    res.on('finish', () => console.timeEnd('Request-response time'));
    // always call next(), otherwise the request will all hanging
    next();
  }
}
