import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        this.logger.error(`gRPC Error: ${error.message}`, error.stack);

        // Convert various error types to gRPC exceptions
        if (error instanceof RpcException) {
          return throwError(() => error);
        }

        // Handle validation errors
        if (error.name === 'ValidationError' || error.code === 'VALIDATION_ERROR') {
          return throwError(() => new RpcException({
            code: 3, // INVALID_ARGUMENT
            message: error.message || 'Validation failed',
            details: error.details || [],
          }));
        }

        // Handle not found errors
        if (error.name === 'NotFoundError' || error.code === 'NOT_FOUND') {
          return throwError(() => new RpcException({
            code: 5, // NOT_FOUND
            message: error.message || 'Resource not found',
          }));
        }

        // Handle permission errors
        if (error.name === 'UnauthorizedError' || error.code === 'UNAUTHORIZED') {
          return throwError(() => new RpcException({
            code: 7, // PERMISSION_DENIED
            message: error.message || 'Permission denied',
          }));
        }

        // Handle database errors
        if (error.code === 'DATABASE_ERROR' || error.name === 'DatabaseError') {
          return throwError(() => new RpcException({
            code: 13, // INTERNAL
            message: 'Internal server error',
          }));
        }

        // Default error handling
        return throwError(() => new RpcException({
          code: 13, // INTERNAL
          message: 'Internal server error',
        }));
      })
    );
  }
}