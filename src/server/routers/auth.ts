import { router, publicProcedure, authedProcedure } from '../trpc'
import { z } from 'zod'
import { users } from '../../db/schema'
import { db } from '../../db'
import { eq } from 'drizzle-orm'
import { encodeToken } from '../../lib/utils'
import { TRPCError } from '@trpc/server'

export const authRouter = router({
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user || null
  }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let user = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      })

      if (!user) {
        const [newUser] = await ctx.db
          .insert(users)
          .values({
            email: input.email,
            name: input.name || null,
          })
          .$returningId()
        user = { id: newUser.id, email: input.email, name: input.name || null, avatar: null, role: 'user', createdAt: new Date() }
      }

      const token = encodeToken(user.id)
      return {
        user,
        token,
      }
    }),

  logout: publicProcedure.mutation(() => {
    return { success: true }
  }),
})
