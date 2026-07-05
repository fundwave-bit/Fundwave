import { Link, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Heart, Menu, X } from "lucide-react"
import { useState } from "react"

export function PublicLayout() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Heart className="h-6 w-6 text-primary" />
            FundWave
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary">Home</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary">Dashboard</Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="text-sm font-medium hover:text-primary">Admin</Link>
                )}
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button size="sm" asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            )}
          </nav>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t px-4 py-4 space-y-3">
            <Link to="/" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Admin</Link>
                )}
                <button className="text-sm font-medium text-destructive" onClick={() => { logout(); setMobileOpen(false) }}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Get Started</Link>
            )}
          </div>
        )}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FundWave. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
