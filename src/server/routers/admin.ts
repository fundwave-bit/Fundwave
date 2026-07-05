import { router, adminProcedure } from '../trpc'
import { users, campaigns, donations, withdrawals } from '../../db/schema'
import { eq, count, sum } from 'drizzle-orm'

export const adminRouter = router({
  stats: adminProcedure.query(async ({ ctx }) => {
    const [userCount] = await ctx.db.select({ count: count() }).from(users)
    const [campaignCount] = await ctx.db.select({ count: count() }).from(campaigns)
    const [donationCount] = await ctx.db.select({ count: count() }).from(donations)
    const [pendingDonations] = await ctx.db
      .select({ count: count() })
      .from(donations)
      .where(eq(donations.status, 'pending'))
    const [pendingWithdrawals] = await ctx.db
      .select({ count: count() })
      .from(withdrawals)
      .where(eq(withdrawals.status, 'pending'))

    return {
      totalUsers: userCount.count,
      totalCampaigns: campaignCount.count,
      totalDonations: donationCount.count,
      pendingDonations: pendingDonations.count,
      pendingWithdrawals: pendingWithdrawals.count,
    }
  }),
})
