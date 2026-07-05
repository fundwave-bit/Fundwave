import { trpc } from "@/lib/trpc"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"

export function DashboardDonationsPage() {
  const { data: donations } = trpc.donation.myDonations.useQuery()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Donations</h1>
      <div className="space-y-4">
        {donations?.map((d) => (
          <Card key={d.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{d.campaign?.title || "Unknown Campaign"}</div>
                <Badge variant={d.status === "approved" ? "default" : d.status === "rejected" ? "destructive" : "secondary"}>{d.status}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{formatDate(d.createdAt)}</span>
                <span className="font-bold text-lg">{formatCurrency(d.amount)}</span>
              </div>
              {d.message && <div className="text-sm text-muted-foreground mt-2">&ldquo;{d.message}&rdquo;</div>}
            </CardContent>
          </Card>
        ))}
        {donations?.length === 0 && <div className="text-center text-muted-foreground py-12">No donations yet.</div>}
      </div>
    </div>
  )
}
