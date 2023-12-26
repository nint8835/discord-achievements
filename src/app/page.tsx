import { getIronSession } from 'iron-session';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { SessionOptions } from '@/lib/auth';

export const metadata: Metadata = {
    title: 'discord-achievements',
};

export default async function Home() {
    const session = await getIronSession(cookies(), SessionOptions);

    return (
        <div>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
    );
}
