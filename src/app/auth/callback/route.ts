import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { AuthorizationCode, type AuthorizationTokenConfig } from 'simple-oauth2';

import { createOrUpdateUser, syncUserGuilds } from '@/db/utils';
import { DiscordOAuthConfig, SessionData, SessionOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const parsedUrl = request.nextUrl;
    const code = parsedUrl.searchParams.get('code');
    const state = parsedUrl.searchParams.get('state');

    if (!code || !state || state !== 'discord-achievements') {
        return new Response('Invalid request', { status: 400 });
    }

    const client = new AuthorizationCode(DiscordOAuthConfig);

    const tokenParams: AuthorizationTokenConfig = {
        code,
        scope: ['identify', 'guilds'],
        redirect_uri: `${parsedUrl.origin}/auth/callback`,
    };
    const accessToken = await client.getToken(tokenParams);

    const userReq = await fetch('https://discord.com/api/v10/users/@me', {
        headers: {
            Authorization: `Bearer ${accessToken.token.access_token}`,
        },
    });
    const userData = await userReq.json();

    const user = await createOrUpdateUser({
        id: userData.id,
        displayName: userData.global_name || userData.username,
    });

    const response = new Response(null, { status: 302 });
    response.headers.set('Location', parsedUrl.origin);

    const session = await getIronSession<SessionData>(cookies(), SessionOptions);
    session.user = user.id;
    await session.save();

    const guildsReq = await fetch('https://discord.com/api/v10/users/@me/guilds?limit=200', {
        headers: {
            Authorization: `Bearer ${accessToken.token.access_token}`,
        },
    });
    const guildsData = await guildsReq.json();

    const guildsArray = guildsData.map((guild: any) => guild.id);

    await syncUserGuilds(user.id, guildsArray);

    return response;
}
