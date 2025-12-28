import { useMutation } from '@tanstack/react-query'
import { authClient } from '../client'

export function useSignUp() {
  const mutation = useMutation({
    mutationFn: (data: {
      email: string
      password: string
      username?: string
      name?: string
    }) => authClient.signUp(data),
  })

  return {
    signUp: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  }
}
