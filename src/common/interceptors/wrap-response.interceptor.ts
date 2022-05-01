import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

// Wrap Req and Res stream, allow us to decide execute the route or not
@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  // Every CustomInterceptor must implement NestInterceptor interface
  // Every CustomInterceptor must have one intercept method
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Every intercept method must return a 'Observable' from Rxjs library
    // CallHandler interface implement handle method. Call it can invoke the route handler method, If don't not invoke
    // console.log('Before...'); // Execute it before the route handler be called

    // return next.handle().pipe(tap((data) => console.log('After...', data))); // Execute it after the route handler be called
    // tap() invokes an anonymous logging function upon graceful termination of the Observable stream
    // data => ... is the response we send back to the router handler

    return next.handle().pipe(map((data) => ({ data })));
    // map() takes a value from the stream and returns a modified one
    // wrap response data in a object
  }
}
