import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  // CanActivate interface must return boolean True allowed / False Denied
  canActivate(
    context: ExecutionContext, // inherits the ArgumentsHost
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('Authorization'); // 取得標頭"權限"欄位值
    return authHeader === process.env.API_KEY;
  }
}
