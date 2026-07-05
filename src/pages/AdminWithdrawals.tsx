import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/toast"

export function AdminWithdrawalsPage() {
  const { data: all, refetch } = trpc.withdrawal.all.useQuery()
  const updateMutation = trpc.withdrawal.updateStatus.useMutation({ onSuccess: () => refetch() })
  const { toast } = useToast()
  const [note, setNote] = useState("")
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const handleUpdate = (id: number, status: "approved" | "completed" | "rejected") => {
    updateMutation.mutate({ id, status, reviewNote: note || undefined }, {
      onSuccess: () => { toast({ title: `Withdrawal ${status}` }); setNote(""); setExpandedId(null) },
      onError: (err) => { toast({ title: "Error", description: err.message, variant: "destructive" }) },
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Withdrawals</h1>
      <div className="space-y-4">
        {all?.map((w) => (
          <Card key={w.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{w.campaign?.title}</div>
                <Badge variant={w.status === "completed" ? "default" : w.status === "rejected" ? "destructive" : "secondary"}>{w.status}</Badge>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
                <div><span className="text-muted-foreground">Amount:</span> {formatCurrency(w.amount)}</div>
                <div><span className="text-muted-foreground">Date:</span> {formatDate(w.createdAt)}</div>
                {w.reason && <div className="sm:col-span-2"><span className="text-muted-foreground">Reason:</span> {w.reason}</div>}
              </div>
              {expandedId === w.id && (
                <>
                  <Textarea placeholder="Review note (optional)" value={note} onChange={e => setNote(e.target.value)} className="mb-3" />
                  {w.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdate(w.id, "approved")}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleUpdate(w.id, "rejected")}>Reject</Button>
                      <Button size="sm" variant="outline" onClick={() => setExpandedId(null)}>Cancel</Button>
                    </div>
                  )}
                  {w.status === "approved" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdate(w.id, "completed")}>Mark Completed</Button>
                      <Button size="sm" variant="outline" onClick={() => setExpandedId(null)}>Cancel</Button>
                    </div>
                  )}
                </>
              )}
              {expandedId !== w.id && (
                <Button size="sm" onClick={() => setExpandedId(w.id)}>Review</Button>
              )}
            </CardContent>
          </Card>
        ))}
        {all?.length === 0 && <div className="text-center text-muted-foreground py-12">No withdrawals.</div>}
      </div>
    </div>
  )
}
