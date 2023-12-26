import { type SessionOptions as IronSessionOptions, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import type { ModuleOptions } from 'simple-oauth2';

import db from '@/db';
import { users } from '@/db/schema';

export const DiscordOAuthConfig: ModuleOptions<'client_id'> = {
    client: {
        id: process.env.DISCORD_CLIENT_ID!,
        secret: process.env.DISCORD_CLIENT_SECRET!,
    },
    auth: {
        tokenHost: 'https://discord.com',
        authorizePath: '/oauth2/authorize',
        tokenPath: '/api/oauth2/token',
    },
};

export const SessionOptions: IronSessionOptions = {
    password: process.env.SESSION_SECRET!,
    cookieName: 'session',
    ttl: 0,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};

export type SessionData = {
    user?: string;
};

export type SessionUser = typeof users.$inferSelect;

export async function ssrGetCurrentUser(): Promise<null | SessionUser> {
    const session = await getIronSession<SessionData>(cookies(), SessionOptions);

    if (!session.user) {
        return null;
    }

    const user = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.id, session.user!) });

    if (!user) {
        return null;
    }

    return user;
}
