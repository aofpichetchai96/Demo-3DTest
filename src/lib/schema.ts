import { pgTable, text, timestamp, uuid, integer, jsonb, boolean, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'), // user, admin
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// Collections table (saved shoe designs)
export const collections = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  colors: jsonb('colors').notNull(), // { primary: '#color', secondary: '#color', accent: '#color' }
  size: varchar('size', { length: 10 }).notNull(),
  notes: text('notes'),
  tags: jsonb('tags'), // Array of tags for categorization
  isPublic: boolean('is_public').notNull().default(false),
  views: integer('views').notNull().default(0),
  likes: integer('likes').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// Quotes table (price quotes for custom orders)
export const quotes = pgTable('quotes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  collectionId: uuid('collection_id').references(() => collections.id),
  quantity: integer('quantity').notNull(),
  unitPrice: integer('unit_price'), // Price in cents
  totalPrice: integer('total_price'), // Total price in cents
  currency: varchar('currency', { length: 3 }).notNull().default('THB'),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, approved, rejected, expired
  validUntil: timestamp('valid_until'),
  requirements: text('requirements'), // Special requirements or modifications
  adminNotes: text('admin_notes'), // Internal notes for admins
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// Orders table (confirmed orders)
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  quoteId: uuid('quote_id').references(() => quotes.id),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, processing, manufacturing, shipped, delivered, cancelled
  totalAmount: integer('total_amount').notNull(), // Amount in cents
  currency: varchar('currency', { length: 3 }).notNull().default('THB'),
  shippingAddress: jsonb('shipping_address').notNull(),
  estimatedDelivery: timestamp('estimated_delivery'),
  actualDelivery: timestamp('actual_delivery'),
  trackingNumber: varchar('tracking_number', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  collections: many(collections),
  quotes: many(quotes),
  orders: many(orders)
}))

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, {
    fields: [collections.userId],
    references: [users.id]
  }),
  quotes: many(quotes)
}))

export const quotesRelations = relations(quotes, ({ one }) => ({
  user: one(users, {
    fields: [quotes.userId],
    references: [users.id]
  }),
  collection: one(collections, {
    fields: [quotes.collectionId],
    references: [collections.id]
  }),
  order: one(orders, {
    fields: [quotes.id],
    references: [orders.quoteId]
  })
}))

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id]
  }),
  quote: one(quotes, {
    fields: [orders.quoteId],
    references: [quotes.id]
  })
}))

// Export types for TypeScript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Collection = typeof collections.$inferSelect
export type NewCollection = typeof collections.$inferInsert
export type Quote = typeof quotes.$inferSelect
export type NewQuote = typeof quotes.$inferInsert
export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
