import { Link, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Heart, HandHeart, ArrowLeftRight, PlusCircle, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/campaigns", label: "My Campaigns", icon: Heart },
  { href: "/dashboard/donations", label: "My Donations", icon: HandHeart },
  { href: "/dashboard/withdrawals", label: "Withdrawals", icon: ArrowLeftRight },
]

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Heart className="h-6 w-6 text-primary" />
            FundWave
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user.name || user.email}</span>
            <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>
      <div className="flex-1 container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <Link
                to="/dashboard/campaigns/new"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted whitespace-nowrap"
              >
                <PlusCircle className="h-4 w-4" />
                New Campaign
              </Link>
              <Link
                to="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted whitespace-nowrap"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Site
              </Link>
            </nav>
          </aside>
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
