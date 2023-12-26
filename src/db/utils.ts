import { and, eq, inArray, notInArray, sql } from 'drizzle-orm';

import db from './db';
import { guildMemberships, guilds, users } from './schema';

export async function createOrUpdateUser(data: {
    id: string;
    displayName: string;
}): Promise<typeof users.$inferSelect> {
    return db
        .insert(users)
        .values(data)
        .onConflictDoUpdate({
            target: users.id,
            set: {
                displayName: data.displayName,
            },
        })
        .returning()
        .get();
}

export async function syncUserGuilds(userId: string, userGuilds: { id: string; permissions: string }[]): Promise<void> {
    const guildIds = userGuilds.map(({ id }) => id);

    await db
        .delete(guildMemberships)
        .where(and(eq(guildMemberships.userId, userId), notInArray(guildMemberships.guildId, guildIds)));

    const registeredGuildIds = (await db.select().from(guilds).where(inArray(guilds.id, guildIds))).map(({ id }) => id);
    if (registeredGuildIds.length === 0) {
        return;
    }

    const values = userGuilds
        .map(({ id, permissions }) => ({
            guildId: id,
            userId,
            admin: (parseInt(permissions) & (1 << 3)) !== 0,
        }))
        .filter(({ guildId }) => registeredGuildIds.includes(guildId));

    await db
        .insert(guildMemberships)
        .values(values)
        .onConflictDoUpdate({
            target: [guildMemberships.guildId, guildMemberships.userId],
            set: {
                admin: sql`excluded.admin`,
            },
        });
}
