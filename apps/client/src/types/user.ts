export interface User {
  id: string
  email: string
  username: string
  displayName?: string
  role: 'ADMIN' | 'USER' | 'VIEWER'
  avatar?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  preferences?: UserPreferences
  profile?: {
    firstName?: string
    lastName?: string
    displayName?: string
    bio?: string
    avatar?: string
  }
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    mentions: boolean
    collaboration: boolean
  }
  editor: {
    fontSize: number
    fontFamily: string
    tabSize: number
    wordWrap: boolean
  }
}

export interface UpdateUserRequest {
  name?: string
  avatar?: string
  preferences?: Partial<UserPreferences>
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    username: string
    displayName?: string
    role: 'ADMIN' | 'USER' | 'VIEWER'
  }
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface AuthError {
  message: string
  code?: string
}