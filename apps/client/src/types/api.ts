export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  message?: string
  meta?: {
    pagination?: PaginationMeta
    timestamp: string
    requestId: string
  }
}

export interface ApiError {
  code: string
  message: string
  details?: any
  stack?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    pagination: PaginationMeta
    timestamp: string
    requestId: string
  }
}

export interface ListParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface CreateResponse<T> extends ApiResponse<T> {
  meta: {
    createdAt: string
    requestId: string
    timestamp: string
  }
}

export interface UpdateResponse<T> extends ApiResponse<T> {
  meta: {
    updatedAt: string
    requestId: string
    timestamp: string
  }
}

export interface DeleteResponse extends ApiResponse {
  meta: {
    deletedAt: string
    requestId: string
    timestamp: string
  }
}
