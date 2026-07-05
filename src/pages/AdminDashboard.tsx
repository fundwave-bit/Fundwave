import { Link } from "react-router-dom"
import { trpc } from "@/lib/trpc"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Heart, HandHeart, ArrowLeftRight, Users, AlertCircle } from "lucide-react"

export function AdminDashboardPage() {
  const { data: stats } = trpc.admin.stats.useQuery()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Heart className="h-4 w-4"/>Campaigns</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.totalCampaigns || 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Users className="h-4 w-4"/>Users</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.totalUsers || 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><HandHeart className="h-4 w-4"/>Donations</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.totalDonations || 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><ArrowLeftRight className="h-4 w-4"/>Pending</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{(stats?.pendingDonations || 0) + (stats?.pendingWithdrawals || 0)}</div></CardContent></Card>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/admin/donations">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="pt-6 flex items-center justify-between">
              <div className="flex items-center gap-3"><AlertCircle className="h-5 w-5 text-orange-500"/><div><div className="font-semibold">Pending Donations</div><div className="text-sm text-muted-foreground">Verify payment proofs</div></div></div>
              <div className="text-2xl font-bold">{stats?.pendingDonations || 0}</div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/withdrawals">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="pt-6 flex items-center justify-between">
              <div className="flex items-center gap-3"><AlertCircle className="h-5 w-5 text-orange-500"/><div><div className="font-semibold">Pending Withdrawals</div><div className="text-sm text-muted-foreground">Approve withdrawal requests</div></div></div>
              <div className="text-2xl font-bold">{stats?.pendingWithdrawals || 0}</div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
