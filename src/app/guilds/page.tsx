import { and, eq, getTableColumns } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import db from '@/db';
import { guildMemberships, guilds } from '@/db/schema';
import { ssrGetCurrentUser } from '@/lib/auth';

export default async function GuildsPage() {
    const currentUser = await ssrGetCurrentUser();

    if (!currentUser) {
        redirect('/auth');
    }

    const currentUserGuilds = await db
        .select({ ...getTableColumns(guilds) })
        .from(guilds)
        .innerJoin(
            guildMemberships,
            and(eq(guilds.id, guildMemberships.guildId), eq(guildMemberships.userId, currentUser.id)),
        );

    return (
        <div>
            <pre>{JSON.stringify(currentUserGuilds, null, 2)}</pre>
        </div>
    );
}
