import { and, eq, inArray, notInArray } from 'drizzle-orm';

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

export async function syncUserGuilds(userId: string, userGuilds: string[]): Promise<void> {
    await db
        .delete(guildMemberships)
        .where(and(eq(guildMemberships.userId, userId), notInArray(guildMemberships.guildId, userGuilds)));

    const registeredGuildIds = await db.select().from(guilds).where(inArray(guilds.id, userGuilds));
    if (registeredGuildIds.length === 0) {
        return;
    }

    await db
        .insert(guildMemberships)
        .values(registeredGuildIds.map(({ id: guildId }) => ({ guildId, userId })))
        .onConflictDoNothing();
}
