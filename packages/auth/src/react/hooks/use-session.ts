import { useQuery } from '@tanstack/react-query'
import { authClient } from '../client'

export function useSession(options?: { force?: boolean }) {
  const query = useQuery({
    queryKey: ['auth', 'session', options],
    queryFn: () => authClient.getSession(options),
    staleTime: 1000 * 60 * 5,
  })

  return {
    session: query.data,
    user: query.data?.user,
    isAuthenticated: !!query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
