import { createAuthClient } from '../client'
import type { AuthClientConfig } from '../client/types'

export function createReactAuthClient(config: AuthClientConfig = {}) {
  return createAuthClient(config)
}

export const authClient = createReactAuthClient()
