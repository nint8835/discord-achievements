import { type SessionOptions as IronSessionOptions, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import type { ModuleOptions } from 'simple-oauth2';

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
    user?: any;
};

export async function ssrGetCurrentUser(): Promise<null | string> {
    const session = await getIronSession<SessionData>(cookies(), SessionOptions);

    if (!session.user) {
        return null;
    }

    return session.user.username;
}
