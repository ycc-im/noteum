import { Module } from '@nestjs/common'
import { WebsocketGateway } from './websocket.gateway'
import { YjsService } from './yjs.service'
import { DocumentPersistenceService } from './document-persistence.service'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [WebsocketGateway, YjsService, DocumentPersistenceService],
  exports: [WebsocketGateway, YjsService, DocumentPersistenceService],
})
export class WebsocketModule {}
