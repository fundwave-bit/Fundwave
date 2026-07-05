import { useCallback } from "react"
import { trpc } from "@/lib/trpc"

export function useAuth() {
  const utils = trpc.useUtils()
  const { data: user, isLoading } = trpc.auth.me.useQuery()
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      localStorage.removeItem("token")
      utils.auth.me.invalidate()
      window.location.href = "/"
    },
  })

  const logout = useCallback(() => {
    logoutMutation.mutate()
  }, [logoutMutation])

  return { user, isLoading, logout }
}
