import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import db from '@/db';
import { possessiveString } from '@/lib/utils';

type Props = {
    params: {
        id: string;
    };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const user = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.id, params.id) });

    if (!user) {
        notFound();
    }

    return {
        title: `${possessiveString(user.displayName)} profile - discord-achievements`,
    };
}

export default async function ProfilePage({ params }: Props) {
    const user = (await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, params.id),
        with: {
            earnedAchievements: {
                with: {
                    achievement: true,
                },
            },
        },
    }))!;

    return (
        <div>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    );
}
