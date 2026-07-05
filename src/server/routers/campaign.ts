import { router, publicProcedure, authedProcedure, adminProcedure } from '../trpc'
import { z } from 'zod'
import { campaigns, donations, users } from '../../db/schema'
import { eq, and, like, or, desc } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { generateSlug } from '../../lib/utils'

export const campaignRouter = router({
  list: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        status: z.enum(['active', 'paused', 'completed', 'cancelled']).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const conditions = [eq(campaigns.status, input.status || 'active')]

      if (input.search) {
        conditions.push(
          or(
            like(campaigns.title, `%${input.search}%`),
            like(campaigns.description, `%${input.search}%`)
          )
        )
      }

      if (input.category) {
        conditions.push(eq(campaigns.category, input.category))
      }

      return ctx.db.query.campaigns.findMany({
        where: and(...conditions),
        with: {
          owner: true,
        },
        orderBy: desc(campaigns.createdAt),
      })
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const campaign = await ctx.db.query.campaigns.findFirst({
        where: eq(campaigns.slug, input.slug),
        with: {
          owner: true,
          donations: {
            where: eq(donations.status, 'approved'),
            orderBy: desc(donations.createdAt),
          },
        },
      })

      if (!campaign) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return campaign
    }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const campaign = await ctx.db.query.campaigns.findFirst({
        where: eq(campaigns.id, input.id),
        with: {
          owner: true,
          donations: true,
        },
      })

      if (!campaign) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return campaign
    }),

  create: authedProcedure
    .input(
      z.object({
        slug: z.string(),
        title: z.string(),
        description: z.string(),
        category: z.string(),
        goal: z.string(),
        bankName: z.string().optional(),
        bankAccount: z.string().optional(),
        bankHolder: z.string().optional(),
        endDate: z.string().optional(),
        coverImage: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const existingSlug = await ctx.db.query.campaigns.findFirst({
        where: eq(campaigns.slug, input.slug),
      })

      if (existingSlug) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Slug already exists' })
      }

      const [campaign] = await ctx.db
        .insert(campaigns)
        .values({
          slug: input.slug,
          title: input.title,
          description: input.description,
          category: input.category,
          goal: input.goal,
          ownerId: ctx.user.id,
          bankName: input.bankName || null,
          bankAccount: input.bankAccount || null,
          bankHolder: input.bankHolder || null,
          endDate: input.endDate ? new Date(input.endDate) : null,
          coverImage: input.coverImage || null,
        })
        .$returningId()

      return campaign
    }),

  update: authedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        goal: z.string().optional(),
        bankName: z.string().optional(),
        bankAccount: z.string().optional(),
        bankHolder: z.string().optional(),
        endDate: z.string().optional(),
        coverImage: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const campaign = await ctx.db.query.campaigns.findFirst({
        where: eq(campaigns.id, input.id),
      })

      if (!campaign) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      if (campaign.ownerId !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      await ctx.db
        .update(campaigns)
        .set({
          title: input.title || campaign.title,
          description: input.description || campaign.description,
          category: input.category || campaign.category,
          goal: input.goal || campaign.goal,
          bankName: input.bankName !== undefined ? input.bankName || null : campaign.bankName,
          bankAccount: input.bankAccount !== undefined ? input.bankAccount || null : campaign.bankAccount,
          bankHolder: input.bankHolder !== undefined ? input.bankHolder || null : campaign.bankHolder,
          endDate: input.endDate ? new Date(input.endDate) : campaign.endDate,
          coverImage: input.coverImage !== undefined ? input.coverImage || null : campaign.coverImage,
        })
        .where(eq(campaigns.id, input.id))

      return { success: true }
    }),

  myCampaigns: authedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return ctx.db.query.campaigns.findMany({
      where: eq(campaigns.ownerId, ctx.user.id),
      with: {
        donations: true,
      },
      orderBy: desc(campaigns.createdAt),
    })
  }),

  delete: authedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const campaign = await ctx.db.query.campaigns.findFirst({
        where: eq(campaigns.id, input.id),
      })

      if (!campaign) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      if (campaign.ownerId !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      await ctx.db.delete(campaigns).where(eq(campaigns.id, input.id))
      return { success: true }
    }),

  adminList: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.campaigns.findMany({
      with: {
        owner: true,
        donations: true,
      },
      orderBy: desc(campaigns.createdAt),
    })
  }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(['active', 'paused', 'completed', 'cancelled']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(campaigns)
        .set({ status: input.status })
        .where(eq(campaigns.id, input.id))

      return { success: true }
    }),
})
