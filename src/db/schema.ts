import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    avatarUrl: text('avatar_url').notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
    achievementBundles: many(achievementBundles),
    achievements: many(achievements),
    earnedAchievements: many(earnedAchievements),
}));

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

export const achievementBundleRelations = relations(achievementBundles, ({ one, many }) => ({
    owner: one(users, {
        fields: [achievementBundles.ownerId],
        references: [users.id],
    }),
    achievements: many(achievements),
    integrationPermissions: many(integrationPermissions),
}));

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

export const achievementRelations = relations(achievements, ({ one, many }) => ({
    bundle: one(achievementBundles, {
        fields: [achievements.bundleId],
        references: [achievementBundles.id],
    }),
    owner: one(users, {
        fields: [achievements.ownerId],
        references: [users.id],
    }),
    earnedBy: many(earnedAchievements),
    integrationPermissions: many(integrationPermissions),
}));

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

export const earnedAchievementRelations = relations(earnedAchievements, ({ one }) => ({
    user: one(users, {
        fields: [earnedAchievements.userId],
        references: [users.id],
    }),
    achievement: one(achievements, {
        fields: [earnedAchievements.achievementId],
        references: [achievements.id],
    }),
}));

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

export const integrationRelations = relations(integrations, ({ one, many }) => ({
    owner: one(users, {
        fields: [integrations.ownerId],
        references: [users.id],
    }),
    permissions: many(integrationPermissions),
}));

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

export const integrationPermissionRelations = relations(integrationPermissions, ({ one }) => ({
    integration: one(integrations, {
        fields: [integrationPermissions.integrationId],
        references: [integrations.id],
    }),
    achievementBundle: one(achievementBundles, {
        fields: [integrationPermissions.achievementBundleId],
        references: [achievementBundles.id],
    }),
    achievement: one(achievements, {
        fields: [integrationPermissions.achievementId],
        references: [achievements.id],
    }),
}));
