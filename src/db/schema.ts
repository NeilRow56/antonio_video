import {
  pgTable,
  uuid,
  timestamp,
  text,
  uniqueIndex
} from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkId: text('clerk_id').unique().notNull(),
    name: text('name').notNull(),
    // TODO: Add banner fields
    imageUrl: text('image_url').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  t => [uniqueIndex('clerk_id_idx').on(t.clerkId)]
)
