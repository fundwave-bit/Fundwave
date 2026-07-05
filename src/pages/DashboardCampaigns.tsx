import { Link } from "react-router-dom"
import { trpc } from "@/lib/trpc"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { PlusCircle, ArrowRight } from "lucide-react"

export function DashboardCampaignsPage() {
  const { data: campaigns } = trpc.campaign.myCampaigns.useQuery()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Campaigns</h1>
        <Button asChild><Link to="/dashboard/campaigns/new"><PlusCircle className="h-4 w-4 mr-2"/>New</Link></Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {campaigns?.map((c) => {
          const goal = Number(c.goal)
          const raised = Number(c.raised)
          const percent = goal > 0 ? Math.round((raised / goal) * 100) : 0
          return (
            <Card key={c.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant={c.status === "active" ? "default" : "secondary"}>{c.status}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</span>
                </div>
                <CardTitle className="text-lg">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>{formatCurrency(raised)} raised</span>
                  <span className="text-muted-foreground">of {formatCurrency(goal)}</span>
                </div>
                <Progress value={percent} />
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to={`/dashboard/campaigns/${c.id}`}>Manage <ArrowRight className="h-4 w-4 ml-2"/></Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {campaigns?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No campaigns yet. <Link to="/dashboard/campaigns/new" className="text-primary underline">Create one</Link>
        </div>
      )}
    </div>
  )
}
