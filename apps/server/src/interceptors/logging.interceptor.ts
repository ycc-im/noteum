import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToRpc().getData();
    const handler = context.getHandler().name;
    const controller = context.getClass().name;

    this.logger.log(
      `Incoming gRPC call: ${controller}.${handler} - Data: ${JSON.stringify(request)}`,
    );

    return next.handle().pipe(
      tap((response) => {
        const duration = Date.now() - now;
        this.logger.log(
          `Outgoing gRPC response: ${controller}.${handler} - Duration: ${duration}ms - Response: ${JSON.stringify(response)}`,
        );
      }),
      catchError((error) => {
        const duration = Date.now() - now;
        this.logger.error(
          `gRPC call failed: ${controller}.${handler} - Duration: ${duration}ms - Error: ${error.message}`,
          error.stack,
        );
        throw error;
      }),
    );
  }
}
