import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/toast"

export function AdminDonationsPage() {
  const { data: pending, refetch } = trpc.donation.pending.useQuery()
  const verifyMutation = trpc.donation.verify.useMutation({ onSuccess: () => refetch() })
  const { toast } = useToast()
  const [note, setNote] = useState("")
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const handleVerify = (id: number, status: "approved" | "rejected") => {
    verifyMutation.mutate({ id, status, reviewNote: note || undefined }, {
      onSuccess: () => { toast({ title: `Donation ${status}` }); setNote(""); setExpandedId(null) },
      onError: (err) => { toast({ title: "Error", description: err.message, variant: "destructive" }) },
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Verify Donations</h1>
      <div className="space-y-4">
        {pending?.map((d) => (
          <Card key={d.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{d.campaign?.title}</div>
                <Badge variant="secondary">{d.status}</Badge>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
                <div><span className="text-muted-foreground">Amount:</span> {formatCurrency(d.amount)}</div>
                <div><span className="text-muted-foreground">Donor:</span> {d.donorName || "Anonymous"}</div>
                <div><span className="text-muted-foreground">Email:</span> {d.donorEmail || "N/A"}</div>
                <div><span className="text-muted-foreground">Date:</span> {formatDate(d.createdAt)}</div>
                <div className="sm:col-span-2"><span className="text-muted-foreground">Proof:</span> {d.proofReference || "None"}</div>
                {d.message && <div className="sm:col-span-2"><span className="text-muted-foreground">Message:</span> {d.message}</div>}
              </div>
              {expandedId === d.id && (
                <>
                  <Textarea placeholder="Review note (optional)" value={note} onChange={e => setNote(e.target.value)} className="mb-3" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleVerify(d.id, "approved")} disabled={verifyMutation.isPending}>Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleVerify(d.id, "rejected")} disabled={verifyMutation.isPending}>Reject</Button>
                    <Button size="sm" variant="outline" onClick={() => setExpandedId(null)}>Cancel</Button>
                  </div>
                </>
              )}
              {expandedId !== d.id && (
                <Button size="sm" onClick={() => setExpandedId(d.id)}>Review</Button>
              )}
            </CardContent>
          </Card>
        ))}
        {pending?.length === 0 && <div className="text-center text-muted-foreground py-12">No pending donations.</div>}
      </div>
    </div>
  )
}
