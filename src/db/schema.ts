import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    displayName: text('display_name').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
    earnedAchievements: many(earnedAchievements),
    ownedAchievements: many(achievements),
    ownedAchievementBundles: many(achievementBundles),
}));

export const achievements = sqliteTable('achievements', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    ownerId: text('owner_id')
        .notNull()
        .references(() => users.id),

    name: text('name').notNull(),
    description: text('description'),
    unique: integer('unique', { mode: 'boolean' }).notNull().default(false),
    // TODO: Icon?

    guildId: text('guild_id').references(() => guilds.id),
    bundleId: integer('bundle_id', { mode: 'number' }).references(() => achievementBundles.id),
    // TODO: Integrations
});

export const achievementsRelations = relations(achievements, ({ one, many }) => ({
    usersEarned: many(earnedAchievements),
    owner: one(users, { fields: [achievements.ownerId], references: [users.id] }),
    guild: one(guilds, { fields: [achievements.guildId], references: [guilds.id] }),
    bundle: one(achievementBundles, { fields: [achievements.bundleId], references: [achievementBundles.id] }),
}));

export const earnedAchievements = sqliteTable(
    'earned_achievements',
    {
        achievementId: integer('achievement_id', { mode: 'number' })
            .notNull()
            .references(() => achievements.id),
        userId: text('user_id')
            .notNull()
            .references(() => users.id),
        earnedAt: integer('earned_at', { mode: 'timestamp' }).notNull(),
    },
    (table) => ({ pk: primaryKey({ columns: [table.achievementId, table.userId] }) }),
);

export const earnedAchievementsRelations = relations(earnedAchievements, ({ one }) => ({
    achievement: one(achievements, { fields: [earnedAchievements.achievementId], references: [achievements.id] }),
    user: one(users, { fields: [earnedAchievements.userId], references: [users.id] }),
}));

export const achievementBundles = sqliteTable('achievement_bundles', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),

    name: text('name').notNull(),
    description: text('description'),

    ownerId: text('owner_id')
        .notNull()
        .references(() => users.id),
    guildId: text('guild_id').references(() => guilds.id),
});

export const achievementBundlesRelations = relations(achievementBundles, ({ one, many }) => ({
    achievements: many(achievements),
    owner: one(users, { fields: [achievementBundles.ownerId], references: [users.id] }),
    guild: one(guilds, { fields: [achievementBundles.guildId], references: [guilds.id] }),
}));

export const guilds = sqliteTable('guilds', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
});

export const guildsRelations = relations(guilds, ({ one, many }) => ({
    achievements: many(achievements),
    achievementBundles: many(achievementBundles),
}));
