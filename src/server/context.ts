import type { inferAsyncReturnType } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import { decodeToken } from '../lib/utils'

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const token = opts?.req.headers.get('authorization')?.split(' ')[1]
  let user = null

  if (token) {
    const decoded = decodeToken(token)
    if (decoded) {
      const [foundUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1)
      user = foundUser || null
    }
  }

  return {
    user,
    db,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
