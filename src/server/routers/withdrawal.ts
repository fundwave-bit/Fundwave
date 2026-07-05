import { router, authedProcedure, adminProcedure } from '../trpc'
import { z } from 'zod'
import { withdrawals, campaigns, ledger } from '../../db/schema'
import { eq, desc } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'

export const withdrawalRouter = router({
  create: authedProcedure
    .input(
      z.object({
        campaignId: z.number(),
        amount: z.string(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const campaign = await ctx.db.query.campaigns.findFirst({
        where: eq(campaigns.id, input.campaignId),
      })

      if (!campaign) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      if (campaign.ownerId !== ctx.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      const [withdrawal] = await ctx.db
        .insert(withdrawals)
        .values({
          campaignId: input.campaignId,
          amount: input.amount,
          reason: input.reason || null,
        })
        .$returningId()

      return withdrawal
    }),

  myWithdrawals: authedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return ctx.db.query.withdrawals.findMany({
      where: eq(campaigns.ownerId, ctx.user.id),
      with: {
        campaign: true,
      },
      orderBy: desc(withdrawals.createdAt),
    })
  }),

  byCampaign: authedProcedure
    .input(z.object({ campaignId: z.number() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.query.withdrawals.findMany({
        where: eq(withdrawals.campaignId, input.campaignId),
        orderBy: desc(withdrawals.createdAt),
      })
    }),

  pending: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.withdrawals.findMany({
      where: eq(withdrawals.status, 'pending'),
      with: {
        campaign: true,
      },
      orderBy: desc(withdrawals.createdAt),
    })
  }),

  all: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.withdrawals.findMany({
      with: {
        campaign: true,
      },
      orderBy: desc(withdrawals.createdAt),
    })
  }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(['approved', 'completed', 'rejected']),
        reviewNote: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const withdrawal = await ctx.db.query.withdrawals.findFirst({
        where: eq(withdrawals.id, input.id),
      })

      if (!withdrawal) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      await ctx.db
        .update(withdrawals)
        .set({
          status: input.status,
          reviewNote: input.reviewNote || null,
          reviewedBy: ctx.user.id,
          reviewedAt: new Date(),
        })
        .where(eq(withdrawals.id, input.id))

      if (input.status === 'completed') {
        await ctx.db.insert(ledger).values({
          type: 'withdrawal',
          referenceId: input.id,
          campaignId: withdrawal.campaignId,
          amount: withdrawal.amount,
          description: `Withdrawal for campaign ${withdrawal.campaignId}`,
        })
      }

      return { success: true }
    }),
})
