import { UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor, ErrorInterceptor } from '../interceptors';

/**
 * Base controller that applies common interceptors to all gRPC controllers
 */
@UseInterceptors(LoggingInterceptor, ErrorInterceptor)
export abstract class BaseController {
  /**
   * Common validation helper for request payloads
   */
  protected validateRequired<T>(data: T, requiredFields: (keyof T)[]): void {
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${String(field)}`);
      }
    }
  }

  /**
   * Common error handler for service layer errors
   */
  protected handleError(error: any, context: string): never {
    throw {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || `Error in ${context}`,
      details: error.details || {},
    };
  }
}