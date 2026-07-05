import { useCallback } from 'react'
import { trpc } from '@/lib/trpc'

export function useAuth() {
  const { data: user, isLoading } = trpc.auth.me.useQuery()
  const logoutMutation = trpc.auth.logout.useMutation()

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync()
    localStorage.removeItem('token')
    window.location.href = '/'
  }, [logoutMutation])

  return {
    user: user ?? null,
    isLoading,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }
}
