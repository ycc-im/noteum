import { useMutation } from '@tanstack/react-query'
import { authClient } from '../client'

export function useLogin() {
  const mutation = useMutation({
    mutationFn: (credentials: {
      email: string
      password: string
      username?: string
    }) => authClient.signIn(credentials),
  })

  return {
    login: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  }
}
