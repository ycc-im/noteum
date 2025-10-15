import type {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response<T> {
  success: boolean
  statusCode: number
  message: string
  data?: T
  meta?: {
    timestamp: string
    path: string
    duration?: number
  }
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    const now = Date.now()
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    return next.handle().pipe(
      map(data => ({
        success: true,
        statusCode: response.statusCode || 200,
        message: this.getSuccessMessage(request.method, request.route?.path),
        data,
        meta: {
          timestamp: new Date().toISOString(),
          path: request.url,
          duration: Date.now() - now,
        },
      }))
    )
  }

  private getSuccessMessage(method: string, path?: string): string {
    const messages: Record<string, string> = {
      GET: 'Data retrieved successfully',
      POST: 'Resource created successfully',
      PUT: 'Resource updated successfully',
      PATCH: 'Resource updated successfully',
      DELETE: 'Resource deleted successfully',
    }

    return messages[method] || 'Operation completed successfully'
  }
}
