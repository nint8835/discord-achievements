import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    avatarUrl: text('avatar_url').notNull(),
});

export const achievementBundles = sqliteTable('achievement_bundles', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    imageUrl: text('image_url'),
    ownerId: text('owner_id')
        .notNull()
        .references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const achievements = sqliteTable('achievements', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    imageUrl: text('image_url'),
    isUnique: integer('is_unique', { mode: 'boolean' }).notNull(),
    bundleId: integer('bundle_id').references(() => achievementBundles.id),
    ownerId: text('owner_id')
        .notNull()
        .references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const earnedAchievements = sqliteTable('earned_achievements', {
    id: integer('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    achievementId: integer('achievement_id')
        .notNull()
        .references(() => achievements.id),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const integrations = sqliteTable('integrations', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    ownerId: text('owner_id')
        .notNull()
        .references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const integrationPermissions = sqliteTable('integration_permissions', {
    id: integer('id').primaryKey(),
    integrationId: integer('integration_id')
        .notNull()
        .references(() => integrations.id),
    achievementBundleId: integer('achievement_bundle_id').references(() => achievementBundles.id),
    achievementId: integer('achievement_id').references(() => achievements.id),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});
