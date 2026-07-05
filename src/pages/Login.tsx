import { useState } from "react"
import { Link } from "react-router-dom"
import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Heart } from "lucide-react"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("token", data.token)
      window.location.href = "/dashboard"
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ email, name: name || undefined })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Welcome to FundWave</CardTitle>
          <CardDescription>Sign in or create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
            <div><Label htmlFor="name">Name (optional)</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></div>
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>{loginMutation.isPending ? "Signing in..." : "Continue"}</Button>
            {loginMutation.isError && <div className="text-sm text-destructive text-center">{loginMutation.error.message}</div>}
          </form>
          <div className="mt-4 text-center text-sm"><Link to="/" className="text-muted-foreground hover:text-foreground">Back to home</Link></div>
        </CardContent>
      </Card>
    </div>
  )
}
