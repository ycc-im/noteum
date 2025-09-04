import { Injectable } from '@nestjs/common';
import { appRouter } from './trpc.router';

@Injectable()
export class TrpcService {
  getRouter() {
    return appRouter;
  }
}