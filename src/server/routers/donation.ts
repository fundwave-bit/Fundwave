import { router, publicProcedure, authedProcedure, adminProcedure } from '../trpc'
import { z } from 'zod'
import { donations, campaigns, ledger } from '../../db/schema'
import { eq, desc } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'

export const donationRouter = router({
  create: publicProcedure
    .input(
      z.object({
        campaignId: z.number(),
        amount: z.string(),
        donorName: z.string().optional(),
        donorEmail: z.string().email().optional(),
        proofReference: z.string().optional(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const campaign = await ctx.db.query.campaigns.findFirst({
        where: eq(campaigns.id, input.campaignId),
      })

      if (!campaign) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const [donation] = await ctx.db
        .insert(donations)
        .values({
          campaignId: input.campaignId,
          donorId: ctx.user?.id || null,
          donorName: input.donorName || null,
          donorEmail: input.donorEmail || null,
          amount: input.amount,
          proofReference: input.proofReference || null,
          message: input.message || null,
        })
        .$returningId()

      return donation
    }),

  myDonations: authedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return ctx.db.query.donations.findMany({
      where: eq(donations.donorId, ctx.user.id),
      with: {
        campaign: true,
      },
      orderBy: desc(donations.createdAt),
    })
  }),

  byCampaign: publicProcedure
    .input(z.object({ campaignId: z.number() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.query.donations.findMany({
        where: eq(donations.campaignId, input.campaignId),
        orderBy: desc(donations.createdAt),
      })
    }),

  pending: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.donations.findMany({
      where: eq(donations.status, 'pending'),
      with: {
        campaign: true,
      },
      orderBy: desc(donations.createdAt),
    })
  }),

  verify: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(['approved', 'rejected']),
        reviewNote: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const donation = await ctx.db.query.donations.findFirst({
        where: eq(donations.id, input.id),
      })

      if (!donation) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      await ctx.db
        .update(donations)
        .set({
          status: input.status,
          reviewNote: input.reviewNote || null,
          reviewedBy: ctx.user.id,
          reviewedAt: new Date(),
        })
        .where(eq(donations.id, input.id))

      if (input.status === 'approved') {
        const campaign = await ctx.db.query.campaigns.findFirst({
          where: eq(campaigns.id, donation.campaignId),
        })

        if (!campaign) {
          throw new TRPCError({ code: 'NOT_FOUND' })
        }

        const newRaised = (parseFloat(campaign.raised) + parseFloat(donation.amount)).toString()

        await ctx.db
          .update(campaigns)
          .set({ raised: newRaised })
          .where(eq(campaigns.id, donation.campaignId))

        await ctx.db.insert(ledger).values({
          type: 'donation',
          referenceId: input.id,
          campaignId: donation.campaignId,
          amount: donation.amount,
          description: `Donation from ${donation.donorName || 'anonymous'}`,
        })
      }

      return { success: true }
    }),
})
