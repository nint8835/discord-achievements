import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    displayName: text('display_name').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
    earnedAchievements: many(earnedAchievements),
}));

export const achievements = sqliteTable('achievements', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    unique: integer('unique', { mode: 'boolean' }).default(false),
    // TODO: Who / what owns an achievement?
    // TOOD: Associate achievements to either a guild or an integration
    // TODO: Actual display fields (name, description, maybe icon, etc.)
});

export const achievementsRelations = relations(achievements, ({ many }) => ({
    usersEarned: many(earnedAchievements),
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
