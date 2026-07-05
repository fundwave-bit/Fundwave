import { useParams, Link } from "react-router-dom"
import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { formatCurrency, formatDate, formatRelativeDate } from "@/lib/utils"
import { ArrowLeft, Heart, Banknote, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/toast"

export function CampaignDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: campaign } = trpc.campaign.bySlug.useQuery({ slug: slug! })
  const { data: donations } = trpc.donation.byCampaign.useQuery({ campaignId: campaign?.id || 0 }, { enabled: !!campaign })
  const donateMutation = trpc.donation.create.useMutation()
  const { toast } = useToast()

  const [amount, setAmount] = useState("")
  const [donorName, setDonorName] = useState("")
  const [donorEmail, setDonorEmail] = useState("")
  const [proofRef, setProofRef] = useState("")
  const [message, setMessage] = useState("")

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!campaign) return
    donateMutation.mutate(
      { campaignId: campaign.id, amount, donorName: donorName || undefined, donorEmail: donorEmail || undefined, proofReference: proofRef || undefined, message: message || undefined },
      {
        onSuccess: () => {
          toast({ title: "Donation submitted!", description: "An admin will verify your payment." })
          setAmount(""); setDonorName(""); setDonorEmail(""); setProofRef(""); setMessage("")
        },
        onError: (err) => { toast({ title: "Error", description: err.message, variant: "destructive" }) },
      }
    )
  }

  if (!campaign) return <div className="container py-12 text-center">Loading...</div>

  const goal = Number(campaign.goal)
  const raised = Number(campaign.raised)
  const percent = goal > 0 ? Math.round((raised / goal) * 100) : 0

  return (
    <div className="container py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to campaigns
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {campaign.coverImage && (
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img src={campaign.coverImage} alt={campaign.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge>{campaign.category}</Badge>
              <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
            <p className="text-muted-foreground whitespace-pre-wrap">{campaign.description}</p>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-lg">Recent Donations</CardTitle></CardHeader>
            <CardContent>
              {donations && donations.length > 0 ? (
                <div className="space-y-4">
                  {donations.slice(0, 10).map((d) => (
                    <div key={d.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <div className="font-medium">{d.donorName || "Anonymous"}</div>
                        <div className="text-xs text-muted-foreground">{formatRelativeDate(d.createdAt)}</div>
                        {d.message && <div className="text-sm text-muted-foreground mt-1">&ldquo;{d.message}&rdquo;</div>}
                      </div>
                      <div className="font-semibold text-primary">{formatCurrency(d.amount)}</div>
                    </div>
                  ))}
                </div>
              ) : <div className="text-center text-muted-foreground py-4">No donations yet. Be the first!</div>}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold mb-1">{formatCurrency(raised)}</div>
              <div className="text-muted-foreground text-sm mb-4">raised of {formatCurrency(goal)} goal</div>
              <Progress value={percent} className="mb-2" />
              <div className="text-sm text-muted-foreground mb-6">{percent}% funded</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{donations?.length || 0} donors</span>
              </div>
              {campaign.endDate && <div className="text-sm text-muted-foreground mb-4">Ends {formatDate(campaign.endDate)}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Banknote className="h-5 w-5" /> Bank Transfer Details</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Bank:</span> {campaign.bankName || "N/A"}</div>
              <div><span className="text-muted-foreground">Account:</span> {campaign.bankAccount || "N/A"}</div>
              <div><span className="text-muted-foreground">Holder:</span> {campaign.bankHolder || "N/A"}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Heart className="h-5 w-5" /> Donate Now</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleDonate} className="space-y-4">
                <div><Label htmlFor="amount">Amount (USD)</Label><Input id="amount" type="number" min="1" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="50.00" /></div>
                <div><Label htmlFor="name">Your Name (optional)</Label><Input id="name" value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="John Doe" /></div>
                <div><Label htmlFor="email">Email (optional)</Label><Input id="email" type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} placeholder="john@example.com" /></div>
                <div><Label htmlFor="proof">Payment Proof Reference</Label><Input id="proof" value={proofRef} onChange={(e) => setProofRef(e.target.value)} placeholder="Transaction ID or receipt number" /></div>
                <div><Label htmlFor="message">Message (optional)</Label><Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Good luck!" /></div>
                <Button type="submit" className="w-full" disabled={donateMutation.isPending}>{donateMutation.isPending ? "Submitting..." : "Submit Donation"}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
