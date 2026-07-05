import { useParams } from "react-router-dom"
import { trpc } from "@/lib/trpc"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useState } from "react"
import { useToast } from "@/components/ui/toast"

export function DashboardCampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const campaignId = Number(id)
  const { data: campaign } = trpc.campaign.byId.useQuery({ id: campaignId })
  const { data: donations } = trpc.donation.byCampaign.useQuery({ campaignId })
  const { data: withdrawals } = trpc.withdrawal.byCampaign.useQuery({ campaignId })
  const withdrawMutation = trpc.withdrawal.create.useMutation()
  const { toast } = useToast()

  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawReason, setWithdrawReason] = useState("")

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    withdrawMutation.mutate({ campaignId, amount: withdrawAmount, reason: withdrawReason }, {
      onSuccess: () => { toast({ title: "Withdrawal requested" }); setWithdrawAmount(""); setWithdrawReason("") },
      onError: (err) => { toast({ title: "Error", description: err.message, variant: "destructive" }) },
    })
  }

  if (!campaign) return <div className="py-12 text-center">Loading...</div>

  const goal = Number(campaign.goal)
  const raised = Number(campaign.raised)
  const percent = goal > 0 ? Math.round((raised / goal) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{campaign.title}</h1>
        <Badge>{campaign.status}</Badge>
      </div>
      <div className="text-2xl font-bold">{formatCurrency(raised)} <span className="text-base font-normal text-muted-foreground">of {formatCurrency(goal)}</span></div>
      <Progress value={percent} />
      <Tabs defaultValue="donations">
        <TabsList>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="donations">
          <Card>
            <CardHeader><CardTitle>Donations</CardTitle></CardHeader>
            <CardContent>
              {donations?.length ? donations.map(d => (
                <div key={d.id} className="flex justify-between py-2 border-b"><div>{d.donorName || "Anonymous"}</div><div className="font-medium">{formatCurrency(d.amount)}</div></div>
              )) : <div className="text-muted-foreground">No donations yet.</div>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="withdrawals">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Request Withdrawal</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleWithdraw} className="space-y-3">
                  <div><Label>Amount</Label><Input type="number" required value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} /></div>
                  <div><Label>Reason</Label><Textarea value={withdrawReason} onChange={e => setWithdrawReason(e.target.value)} /></div>
                  <Button type="submit" disabled={withdrawMutation.isPending}>Request</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>History</CardTitle></CardHeader>
              <CardContent>
                {withdrawals?.length ? withdrawals.map(w => (
                  <div key={w.id} className="flex justify-between py-2 border-b">
                    <div>{formatDate(w.createdAt)}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant={w.status === "completed" ? "default" : w.status === "rejected" ? "destructive" : "secondary"}>{w.status}</Badge>
                      <span className="font-medium">{formatCurrency(w.amount)}</span>
                    </div>
                  </div>
                )) : <div className="text-muted-foreground">No withdrawals.</div>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardContent className="pt-6 space-y-2 text-sm">
              <div><span className="text-muted-foreground">Bank:</span> {campaign.bankName || "N/A"}</div>
              <div><span className="text-muted-foreground">Account:</span> {campaign.bankAccount || "N/A"}</div>
              <div><span className="text-muted-foreground">Holder:</span> {campaign.bankHolder || "N/A"}</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
