import { redirect } from '@tanstack/react-router'
import { authClient } from '../client'

export async function requireAuth({ location }: any) {
  const session = await authClient.getSession()

  if (!session) {
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
    })
  }

  return session
}

export function optionalAuth() {
  const session = authClient.getSession()
  return session || null
}
