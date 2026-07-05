import { router, adminProcedure } from '../trpc'
import { ledger, campaigns } from '../../db/schema'
import { desc, sum } from 'drizzle-orm'

export const ledgerRouter = router({
  list: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.ledger.findMany({
      with: {
        campaign: true,
      },
      orderBy: desc(ledger.createdAt),
    })
  }),

  stats: adminProcedure.query(async ({ ctx }) => {
    const donations = await ctx.db
      .select()
      .from(ledger)
      .where(ledger.type === 'donation')

    const withdrawals = await ctx.db
      .select()
      .from(ledger)
      .where(ledger.type === 'withdrawal')

    const totalIn = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0)
    const totalOut = withdrawals.reduce((sum, w) => sum + parseFloat(w.amount), 0)

    return {
      totalIn: totalIn.toString(),
      totalOut: totalOut.toString(),
      balance: (totalIn - totalOut).toString(),
      count: donations.length + withdrawals.length,
    }
  }),
})
