import { router } from '../trpc'
import { authRouter } from './auth'
import { campaignRouter } from './campaign'
import { donationRouter } from './donation'
import { withdrawalRouter } from './withdrawal'
import { ledgerRouter } from './ledger'
import { adminRouter } from './admin'

export const appRouter = router({
  auth: authRouter,
  campaign: campaignRouter,
  donation: donationRouter,
  withdrawal: withdrawalRouter,
  ledger: ledgerRouter,
  admin: adminRouter,
})

export type AppRouter = typeof appRouter
