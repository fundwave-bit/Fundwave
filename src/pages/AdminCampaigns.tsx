import { trpc } from "@/lib/trpc"
import { Card, CardContent } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/toast"

export function AdminCampaignsPage() {
  const { data: campaigns, refetch } = trpc.campaign.adminList.useQuery()
  const updateMutation = trpc.campaign.updateStatus.useMutation({ onSuccess: () => refetch() })
  const { toast } = useToast()

  const handleStatusChange = (id: number, status: string) => {
    updateMutation.mutate({ id, status: status as any }, {
      onSuccess: () => { toast({ title: "Status updated" }) },
      onError: (err) => { toast({ title: "Error", description: err.message, variant: "destructive" }) },
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Campaigns</h1>
      <div className="space-y-4">
        {campaigns?.map((c) => (
          <Card key={c.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{c.title}</div>
                <Select value={c.status} onChange={e => handleStatusChange(c.id, e.target.value)} className="w-32">
                  <option value="active">active</option>
                  <option value="paused">paused</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground mb-2">{c.owner?.name || c.owner?.email}</div>
              <div className="flex items-center gap-4 text-sm">
                <span>{formatCurrency(c.raised)} / {formatCurrency(c.goal)}</span>
                <Badge>{c.category}</Badge>
                <span className="text-muted-foreground">{formatDate(c.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {campaigns?.length === 0 && <div className="text-center text-muted-foreground py-12">No campaigns.</div>}
      </div>
    </div>
  )
}
