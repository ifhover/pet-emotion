import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, tap } from 'rxjs/operators';

// 定义一个标准化的响应接口
export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler) {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        if (['string', 'number', 'boolean'].includes(typeof data)) {
          response.header('Content-Type', 'application/json');
          return JSON.stringify(data);
        }
        return data;
      }),
    );
  }
}
