import { Link } from "react-router-dom"
import { trpc } from "@/lib/trpc"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Heart, HandHeart, ArrowLeftRight, PlusCircle } from "lucide-react"

export function DashboardPage() {
  const { data: myCampaigns } = trpc.campaign.myCampaigns.useQuery()
  const { data: myDonations } = trpc.donation.myDonations.useQuery()
  const totalRaised = myCampaigns?.reduce((sum, c) => sum + Number(c.raised), 0) || 0

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Campaigns</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{myCampaigns?.length || 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Raised</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(totalRaised)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Donations Made</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{myDonations?.length || 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Donated</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(myDonations?.reduce((s, d) => s + Number(d.amount), 0) || 0)}</div></CardContent></Card>
      </div>
      <div className="flex gap-3">
        <Button asChild><Link to="/dashboard/campaigns/new"><PlusCircle className="h-4 w-4 mr-2"/>New Campaign</Link></Button>
        <Button variant="outline" asChild><Link to="/dashboard/campaigns"><Heart className="h-4 w-4 mr-2"/>My Campaigns</Link></Button>
      </div>
    </div>
  )
}
