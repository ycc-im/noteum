import { Injectable } from '@nestjs/common';
import { appRouter } from './router';

@Injectable()
export class TrpcService {
  getRouter() {
    return appRouter;
  }
}
