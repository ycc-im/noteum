import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  private readonly logger = new Logger(WebsocketGateway.name)

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized')
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`)

    // Send welcome message
    client.emit('connected', {
      status: 'connected',
      clientId: client.id,
      timestamp: new Date().toISOString(),
    })
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any) {
    this.logger.log(`Message from ${client.id}: ${payload}`)

    // Echo message back
    return {
      event: 'echo',
      data: {
        message: payload,
        clientId: client.id,
        timestamp: new Date().toISOString(),
      },
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, payload: { roomId: string }) {
    const { roomId } = payload
    client.join(roomId)
    this.logger.log(`Client ${client.id} joined room: ${roomId}`)

    client.emit('joined-room', { roomId, userId: client.id })
    client.to(roomId).emit('user-joined', { userId: client.id })
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(client: Socket, payload: { roomId: string }) {
    const { roomId } = payload
    client.leave(roomId)
    this.logger.log(`Client ${client.id} left room: ${roomId}`)

    client.to(roomId).emit('user-left', { userId: client.id })
  }
}