import { trpc } from "@/lib/trpc"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"

export function AdminLedgerPage() {
  const { data: entries } = trpc.ledger.list.useQuery()
  const { data: stats } = trpc.ledger.stats.useQuery()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Financial Ledger</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total In</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{formatCurrency(stats?.totalIn || 0)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Out</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{formatCurrency(stats?.totalOut || 0)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Balance</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(stats?.balance || 0)}</div></CardContent></Card>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries?.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{formatDate(e.createdAt)}</TableCell>
                  <TableCell><Badge variant={e.type === "donation" ? "default" : e.type === "withdrawal" ? "destructive" : "secondary"}>{e.type}</Badge></TableCell>
                  <TableCell>{e.campaign?.title || "N/A"}</TableCell>
                  <TableCell>{formatCurrency(e.amount)}</TableCell>
                  <TableCell className="max-w-xs truncate">{e.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {entries?.length === 0 && <div className="text-center text-muted-foreground py-8">No ledger entries.</div>}
        </CardContent>
      </Card>
    </div>
  )
}
