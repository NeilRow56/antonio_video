import {
  pgTable,
  uuid,
  timestamp,
  text,
  uniqueIndex,
  integer,
  pgEnum
} from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'

import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema
} from 'drizzle-zod'

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

// Not needed for this project
export const userRelations = relations(users, ({ many }) => ({
  video: many(videos)
}))

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  t => [uniqueIndex('name_idx').on(t.name)]
)

// Not needed for this project
export const categoryRelations = relations(categories, ({ many }) => ({
  video: many(videos)
}))

export const videoVisibility = pgEnum('video_visibility', ['private', 'public'])

export const videos = pgTable('videos', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  muxStatus: text('mux_status'),
  muxAssetId: text('mux_asset_id').unique(),
  muxUploadId: text('mux_upload_id').unique(),
  muxPlaybackId: text('mux_playback_id').unique(),
  muxTrackId: text('mux_track_id').unique(),
  muxTrackStatus: text('mux_track_status'),
  thumbnailUrl: text('thumbnail_url'),
  thumbnailKey: text('thumbnail_key'),
  previewUrl: text('preview_url'),
  previewKey: text('preview_key'),
  duration: integer('duration').default(0).notNull(),
  visibility: videoVisibility('visibility').default('private').notNull(),
  userId: uuid('user_id')
    .references(() => users.id, {
      onDelete: 'cascade'
    })
    .notNull(),
  categoryId: uuid('category_id').references(() => categories.id, {
    onDelete: 'set null'
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

export const videoInsertSchema = createInsertSchema(videos)
export const videoUpdateSchema = createUpdateSchema(videos)
export const videoSelectSchema = createSelectSchema(videos)

// Not needed for this project
export const videoRelations = relations(videos, ({ one }) => ({
  user: one(users, {
    fields: [videos.userId],
    references: [users.id]
  }),
  category: one(categories, {
    fields: [videos.categoryId],
    references: [categories.id]
  })
}))
