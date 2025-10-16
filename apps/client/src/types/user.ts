export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  preferences: UserPreferences
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