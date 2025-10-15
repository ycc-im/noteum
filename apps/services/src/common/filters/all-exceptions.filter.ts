import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common'
import type { Request, Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status: number
    let message: string = 'Unknown error'
    let details: any

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message
        details =
          (exceptionResponse as any).details ||
          (exceptionResponse as any).errors
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      message = exception.message
      details = exception.stack
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      message = 'Internal server error'
      details = exception
    }

    // 记录错误日志
    const errorLog = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ip: request.ip,
      userAgent: request.get('User-Agent'),
      message,
      details,
    }

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      JSON.stringify(errorLog, null, 2)
    )

    // 返回统一的错误响应格式
    const errorResponse = {
      success: false,
      statusCode: status,
      message,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    response.status(status).json(errorResponse)
  }
}
