import { mysqlTable, serial, varchar, text, decimal, timestamp, int, mysqlEnum, index } from 'drizzle-orm/mysql-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = mysqlTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }),
    avatar: varchar('avatar', { length: 500 }),
    role: mysqlEnum('role', ['user', 'admin']).default('user'),
    createdAt: timestamp('createdAt').defaultNow(),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
  })
)

// Campaigns table
export const campaigns = mysqlTable(
  'campaigns',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    category: varchar('category', { length: 100 }).notNull(),
    goal: decimal('goal', { precision: 12, scale: 2 }).notNull(),
    raised: decimal('raised', { precision: 12, scale: 2 }).default('0'),
    coverImage: varchar('coverImage', { length: 500 }),
    bankName: varchar('bankName', { length: 255 }),
    bankAccount: varchar('bankAccount', { length: 255 }),
    bankHolder: varchar('bankHolder', { length: 255 }),
    endDate: timestamp('endDate'),
    status: mysqlEnum('status', ['active', 'paused', 'completed', 'cancelled']).default('active'),
    ownerId: int('ownerId').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
  },
  (table) => ({
    slugIdx: index('slug_idx').on(table.slug),
    ownerIdIdx: index('ownerId_idx').on(table.ownerId),
    statusIdx: index('status_idx').on(table.status),
  })
)

// Donations table
export const donations = mysqlTable(
  'donations',
  {
    id: serial('id').primaryKey(),
    campaignId: int('campaignId').notNull(),
    donorId: int('donorId'),
    donorName: varchar('donorName', { length: 255 }),
    donorEmail: varchar('donorEmail', { length: 255 }),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    proofReference: varchar('proofReference', { length: 500 }),
    message: text('message'),
    status: mysqlEnum('status', ['pending', 'approved', 'rejected']).default('pending'),
    reviewNote: text('reviewNote'),
    reviewedBy: int('reviewedBy'),
    reviewedAt: timestamp('reviewedAt'),
    createdAt: timestamp('createdAt').defaultNow(),
  },
  (table) => ({
    campaignIdIdx: index('campaignId_idx').on(table.campaignId),
    statusIdx: index('donation_status_idx').on(table.status),
  })
)

// Withdrawals table
export const withdrawals = mysqlTable(
  'withdrawals',
  {
    id: serial('id').primaryKey(),
    campaignId: int('campaignId').notNull(),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    reason: text('reason'),
    status: mysqlEnum('status', ['pending', 'approved', 'completed', 'rejected']).default('pending'),
    reviewNote: text('reviewNote'),
    reviewedBy: int('reviewedBy'),
    reviewedAt: timestamp('reviewedAt'),
    createdAt: timestamp('createdAt').defaultNow(),
  },
  (table) => ({
    campaignIdIdx: index('withdrawal_campaignId_idx').on(table.campaignId),
    statusIdx: index('withdrawal_status_idx').on(table.status),
  })
)

// Ledger table
export const ledger = mysqlTable(
  'ledger',
  {
    id: serial('id').primaryKey(),
    type: mysqlEnum('type', ['donation', 'withdrawal', 'refund', 'adjustment']).notNull(),
    referenceId: int('referenceId').notNull(),
    campaignId: int('campaignId'),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    description: text('description'),
    createdAt: timestamp('createdAt').defaultNow(),
  },
  (table) => ({
    campaignIdIdx: index('ledger_campaignId_idx').on(table.campaignId),
  })
)

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  campaigns: many(campaigns),
  donations: many(donations),
}))

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  owner: one(users, {
    fields: [campaigns.ownerId],
    references: [users.id],
  }),
  donations: many(donations),
  withdrawals: many(withdrawals),
  ledger: many(ledger),
}))

export const donationsRelations = relations(donations, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [donations.campaignId],
    references: [campaigns.id],
  }),
  donor: one(users, {
    fields: [donations.donorId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [donations.reviewedBy],
    references: [users.id],
  }),
}))

export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [withdrawals.campaignId],
    references: [campaigns.id],
  }),
  reviewer: one(users, {
    fields: [withdrawals.reviewedBy],
    references: [users.id],
  }),
}))

export const ledgerRelations = relations(ledger, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [ledger.campaignId],
    references: [campaigns.id],
  }),
}))
