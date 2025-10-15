import { Request } from 'express'
import { PrismaService } from '../database/prisma.service'

export interface Context {
  req: Request
  prisma: PrismaService
  user?: {
    id: string
    email: string
    username: string
    role: string
    profile?: any
  }
}