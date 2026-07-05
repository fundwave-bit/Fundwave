import { trpc } from "@/lib/trpc"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"

export function DashboardWithdrawalsPage() {
  const { data: withdrawals } = trpc.withdrawal.myWithdrawals.useQuery()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Withdrawals</h1>
      <div className="space-y-4">
        {withdrawals?.map((w) => (
          <Card key={w.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{w.campaign?.title || "Unknown Campaign"}</div>
                <Badge variant={w.status === "completed" ? "default" : w.status === "rejected" ? "destructive" : "secondary"}>{w.status}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{formatDate(w.createdAt)}</span>
                <span className="font-bold text-lg">{formatCurrency(w.amount)}</span>
              </div>
              {w.reason && <div className="text-sm text-muted-foreground mt-2">{w.reason}</div>}
            </CardContent>
          </Card>
        ))}
        {withdrawals?.length === 0 && <div className="text-center text-muted-foreground py-12">No withdrawals yet.</div>}
      </div>
    </div>
  )
}
