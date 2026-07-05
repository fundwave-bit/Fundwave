import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast"

const categories = ["Education", "Health", "Environment", "Community", "Technology", "Arts"]

export function CreateCampaignPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const createMutation = trpc.campaign.create.useMutation({
    onSuccess: () => { toast({ title: "Campaign created!" }); navigate("/dashboard/campaigns") },
    onError: (err) => { toast({ title: "Error", description: err.message, variant: "destructive" }) },
  })

  const [form, setForm] = useState({ slug: "", title: "", description: "", category: "", goal: "", bankName: "", bankAccount: "", bankHolder: "", endDate: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(form as any)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Campaign</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Slug</Label><Input required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="education-for-all" /></div>
            <div><Label>Title</Label><Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Campaign title" /></div>
            <div><Label>Description</Label><Textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe your campaign..." /></div>
            <div><Label>Category</Label><Select required value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option value="">Select...</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</Select></div>
            <div><Label>Goal (USD)</Label><Input required type="number" min="1" step="0.01" value={form.goal} onChange={e => setForm({...form, goal: e.target.value})} /></div>
            <div><Label>Bank Name</Label><Input value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})} /></div>
            <div><Label>Bank Account</Label><Input value={form.bankAccount} onChange={e => setForm({...form, bankAccount: e.target.value})} /></div>
            <div><Label>Account Holder</Label><Input value={form.bankHolder} onChange={e => setForm({...form, bankHolder: e.target.value})} /></div>
            <div><Label>End Date</Label><Input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} /></div>
            <Button type="submit" className="w-full" disabled={createMutation.isPending}>Create Campaign</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
