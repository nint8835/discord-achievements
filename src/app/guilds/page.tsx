import { and, eq, getTableColumns } from 'drizzle-orm';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';

import db from '@/db';
import { guildMemberships, guilds } from '@/db/schema';
import { ssrGetCurrentUser } from '@/lib/auth';

export async function generateMetadata() {
    const currentUser = await ssrGetCurrentUser();

    if (!currentUser) {
        redirect('/auth');
    }

    return {
        title: 'Guilds - discord-achievements',
    };
}

export default async function GuildsPage() {
    const currentUser = (await ssrGetCurrentUser())!;

    const currentUserGuilds = await db
        .select({ ...getTableColumns(guilds), admin: guildMemberships.admin })
        .from(guilds)
        .innerJoin(
            guildMemberships,
            and(eq(guilds.id, guildMemberships.guildId), eq(guildMemberships.userId, currentUser.id)),
        );

    return (
        <div className="space-y-4 p-4">
            <div className="flex flex-row items-center justify-between">
                <h2 className="text-2xl font-bold">Guilds</h2>
                <Button className="flex flex-row items-center justify-between" variant="secondary" asChild>
                    <a href="/guilds/begin-registration">
                        <Plus className="mr-2 h-4 w-4" /> Add Guild
                    </a>
                </Button>
            </div>
            <div>
                {currentUserGuilds.length !== 0 ? (
                    <ul className="list-inside list-disc">
                        {currentUserGuilds.map(({ id, name, admin }) => (
                            <li key={id}>
                                <Link href={`/guilds/${id}`} className="rounded-md p-2 transition-all hover:bg-accent">
                                    {name}
                                </Link>
                                {admin && (
                                    <span className="ml-2 text-sm text-muted-foreground" title="Guild Administrator">
                                        (Admin)
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center italic text-muted-foreground">
                        You are not a member of any registered guilds.
                    </div>
                )}
            </div>
        </div>
    );
}
