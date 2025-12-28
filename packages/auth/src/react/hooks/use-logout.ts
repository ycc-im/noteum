import { useMutation } from '@tanstack/react-query'
import { authClient } from '../client'

export function useLogout() {
  const mutation = useMutation({
    mutationFn: (options?: { allDevices?: boolean }) =>
      authClient.signOut(options),
  })

  return {
    logout: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
  }
}
