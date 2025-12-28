import { useQuery, useMutation } from '@tanstack/react-query'
import { authClient } from '../client'

export function useAuth() {
  const sessionQuery = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: () => authClient.getSession(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: {
      email: string
      password: string
      username?: string
    }) => authClient.signIn(credentials),
    onSuccess: () => {
      sessionQuery.refetch()
    },
  })

  const logoutMutation = useMutation({
    mutationFn: (options?: { allDevices?: boolean }) =>
      authClient.signOut(options),
    onSuccess: () => {
      sessionQuery.refetch()
    },
  })

  return {
    session: sessionQuery.data,
    user: sessionQuery.data?.user,
    isAuthenticated: !!sessionQuery.data,
    isLoading:
      sessionQuery.isLoading ||
      loginMutation.isPending ||
      logoutMutation.isPending,

    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    error: sessionQuery.error || loginMutation.error,
  }
}
