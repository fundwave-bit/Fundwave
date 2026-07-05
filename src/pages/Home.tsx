import { Link } from "react-router-dom"
import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Heart, Search, Shield, FileText, Lock, ArrowRight } from "lucide-react"
import { useState } from "react"

const categories = ["All", "Education", "Health", "Environment", "Community", "Technology", "Arts"]

export function HomePage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const { data: campaigns } = trpc.campaign.list.useQuery({
    search: search || undefined,
    category: category === "All" ? undefined : category,
  })

  return (
    <div>
      <section className="py-20 md:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Make a Difference with <span className="text-primary">FundWave</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A transparent crowdfunding platform connecting passionate donors with meaningful causes.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/dashboard/campaigns/new">Start a Campaign</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="#campaigns">Explore Campaigns</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Search, title: "Browse", desc: "Explore verified campaigns" },
              { icon: Heart, title: "Choose", desc: "Select a cause that resonates" },
              { icon: ArrowRight, title: "Transfer", desc: "Send funds via bank transfer" },
              { icon: Shield, title: "Verify", desc: "Upload proof for verification" },
            ].map((step) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Verified Donations</h3>
                <p className="text-sm text-muted-foreground">Every donation is manually verified.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FileText className="h-8 w-8 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Transparent Ledger</h3>
                <p className="text-sm text-muted-foreground">Full financial audit trail.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Lock className="h-8 w-8 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Secure Withdrawals</h3>
                <p className="text-sm text-muted-foreground">Multi-step approval process.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="campaigns" className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Active Campaigns</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full sm:w-48">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns?.map((campaign) => {
              const goal = Number(campaign.goal)
              const raised = Number(campaign.raised)
              const percent = goal > 0 ? Math.round((raised / goal) * 100) : 0
              return (
                <Card key={campaign.id} className="overflow-hidden">
                  {campaign.coverImage && (
                    <div className="aspect-video bg-muted">
                      <img src={campaign.coverImage} alt={campaign.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{campaign.category}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(campaign.createdAt)}</span>
                    </div>
                    <CardTitle className="text-lg">
                      <Link to={`/campaign/${campaign.slug}`} className="hover:text-primary transition-colors">{campaign.title}</Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{campaign.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{formatCurrency(raised)}</span>
                        <span className="text-muted-foreground">of {formatCurrency(goal)}</span>
                      </div>
                      <Progress value={percent} />
                      <div className="text-xs text-muted-foreground">{percent}% funded</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          {campaigns?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No campaigns found. <Link to="/dashboard/campaigns/new" className="text-primary underline">Create one</Link>!
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
