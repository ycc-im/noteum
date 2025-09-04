import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    // Convert HTTP exceptions to gRPC exceptions
    if (exception.status) {
      const grpcError = new RpcException({
        code: this.httpToGrpcCode(exception.status),
        message: exception.message || 'Internal server error',
        details: exception.response?.message || exception.message,
      });
      return throwError(() => grpcError);
    }

    // Handle validation errors
    if (exception.message && Array.isArray(exception.message)) {
      const grpcError = new RpcException({
        code: 3, // INVALID_ARGUMENT
        message: 'Validation failed',
        details: exception.message.join(', '),
      });
      return throwError(() => grpcError);
    }

    // Default error handling
    const grpcError = new RpcException({
      code: 13, // INTERNAL
      message: exception.message || 'Internal server error',
    });

    return throwError(() => grpcError);
  }

  private httpToGrpcCode(httpStatus: number): number {
    const codeMap: Record<number, number> = {
      400: 3,  // INVALID_ARGUMENT
      401: 16, // UNAUTHENTICATED
      403: 7,  // PERMISSION_DENIED
      404: 5,  // NOT_FOUND
      409: 6,  // ALREADY_EXISTS
      500: 13, // INTERNAL
      501: 12, // UNIMPLEMENTED
      503: 14, // UNAVAILABLE
    };

    return codeMap[httpStatus] || 13; // Default to INTERNAL
  }
}