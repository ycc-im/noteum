import { Injectable } from '@nestjs/common'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { DocumentPersistenceService } from './document-persistence.service'

@Injectable()
export class YjsService {
  private readonly documents = new Map<string, Y.Doc>()
  private readonly providers = new Map<string, WebsocketProvider>()

  constructor(
    private readonly documentPersistenceService: DocumentPersistenceService
  ) {}

  getDocument(documentId: string): Y.Doc {
    if (!this.documents.has(documentId)) {
      const doc = new Y.Doc()
      this.documents.set(documentId, doc)

      // Load persisted document if exists
      this.documentPersistenceService.loadDocument(doc, documentId)
    }

    return this.documents.get(documentId)!
  }

  createProvider(documentId: string, websocketUrl: string): WebsocketProvider {
    const doc = this.getDocument(documentId)

    const provider = new WebsocketProvider(websocketUrl, documentId, doc, {
      connect: true,
      // Add authentication headers if needed
      // parameters: {
      //   token: authToken,
      // },
    })

    // Handle provider events
    provider.on('status', (event: any) => {
      console.log(`WebSocket provider status for ${documentId}:`, event.status)
    })

    provider.on('sync', (isSynced: boolean) => {
      console.log(`Document ${documentId} sync status:`, isSynced)

      if (isSynced) {
        // Persist document when synchronized
        this.documentPersistenceService.saveDocument(doc, documentId)
      }
    })

    provider.on('connection-error', (error: any) => {
      console.error(`WebSocket connection error for ${documentId}:`, error)
    })

    this.providers.set(documentId, provider)
    return provider
  }

  getProvider(documentId: string): WebsocketProvider | undefined {
    return this.providers.get(documentId)
  }

  disconnectProvider(documentId: string): void {
    const provider = this.providers.get(documentId)
    if (provider) {
      provider.destroy()
      this.providers.delete(documentId)
    }
  }

  cleanup(): void {
    // Clean up all providers and documents
    for (const [documentId, provider] of this.providers.entries()) {
      try {
        provider.destroy()
        // Persist final document state
        const doc = this.documents.get(documentId)
        if (doc) {
          this.documentPersistenceService.saveDocument(doc, documentId)
        }
      } catch (error) {
        console.error(`Error cleaning up provider for ${documentId}:`, error)
      }
    }

    this.providers.clear()
    this.documents.clear()
  }
}
