import { and, eq, getTableColumns } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';

import db from '@/db';
import { guildMemberships, guilds } from '@/db/schema';
import { ssrGetCurrentUser } from '@/lib/auth';

type Params = {
    params: {
        id: string;
    };
};

export async function generateMetadata({ params }: Params) {
    const currentUser = await ssrGetCurrentUser();

    if (!currentUser) {
        redirect('/auth');
    }

    const guild = db
        .select({ ...getTableColumns(guilds) })
        .from(guilds)
        .where(eq(guilds.id, params.id))
        .innerJoin(
            guildMemberships,
            and(eq(guilds.id, guildMemberships.guildId), eq(guildMemberships.userId, currentUser.id)),
        )
        .get();

    if (!guild) {
        notFound();
    }

    return {
        title: `${guild.name} - discord-achievements`,
    };
}

export default async function GuildPage({ params }: Params) {}
