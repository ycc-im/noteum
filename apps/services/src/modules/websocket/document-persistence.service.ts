import { Injectable } from '@nestjs/common'
import * as Y from 'yjs'
import { PrismaService } from '../database/prisma.service'

@Injectable()
export class DocumentPersistenceService {
  constructor(private readonly prisma: PrismaService) {}

  async saveDocument(doc: Y.Doc, documentId: string): Promise<void> {
    try {
      // Get document state as Uint8Array
      const state = Y.encodeStateAsUpdateV2(doc)

      // For now, we'll log the persistence
      // In a real implementation, this would save to the database
      console.log(`Persisting document ${documentId} (${state.length} bytes)`)

      // TODO: Implement actual database persistence when NoteSnapshot model is available
      // await this.prisma.noteSnapshot.create({
      //   documentId,
      //   snapshot: Buffer.from(state),
      //   version: doc.store.version,
      // })
    } catch (error) {
      console.error(`Error persisting document ${documentId}:`, error)
    }
  }

  async loadDocument(doc: Y.Doc, documentId: string): Promise<void> {
    try {
      // TODO: Implement database loading when NoteSnapshot model is available
      // const snapshot = await this.prisma.noteSnapshot.findFirst({
      //   where: { documentId },
      //   orderBy: { version: 'desc' },
      // })

      // if (snapshot && snapshot.snapshot) {
      //   const state = new Uint8Array(snapshot.snapshot)
      //   Y.applyUpdateV2(doc, state)
      //   console.log(`Loaded document ${documentId} from database`)
      // }

      console.log(`No persisted state found for document ${documentId}`)
    } catch (error) {
      console.error(`Error loading document ${documentId}:`, error)
    }
  }

  async saveUpdate(documentId: string, update: Uint8Array, origin: string): Promise<void> {
    try {
      // TODO: Implement update persistence when NoteUpdate model is available
      console.log(`Persisting update for document ${documentId} from ${origin} (${update.length} bytes)`)

      // await this.prisma.noteUpdate.create({
      //   documentId,
      //   update: Buffer.from(update),
      //   origin,
      //   timestamp: new Date(),
      //   updateType: 'CONTENT', // Determine type based on context
      // })
    } catch (error) {
      console.error(`Error persisting update for document ${documentId}:`, error)
    }
  }

  async createSnapshot(documentId: string, doc: Y.Doc): Promise<void> {
    try {
      const state = Y.encodeStateAsUpdateV2(doc)

      console.log(`Creating snapshot for document ${documentId} (${state.length} bytes)`)

      // TODO: Implement snapshot creation when model is available
      // await this.prisma.noteSnapshot.create({
      //   documentId,
      //   snapshot: Buffer.from(state),
      //   stateVector: Buffer.from(Y.encodeStateVector(doc)),
      //   version: doc.store.version,
      // })
    } catch (error) {
      console.error(`Error creating snapshot for document ${documentId}:`, error)
    }
  }
}