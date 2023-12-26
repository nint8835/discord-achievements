import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { AuthorizationCode } from 'simple-oauth2';

import { createOrUpdateUser } from '@/db/utils';
import { DiscordOAuthConfig, SessionData, SessionOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const parsedUrl = request.nextUrl;
    const code = parsedUrl.searchParams.get('code');
    const state = parsedUrl.searchParams.get('state');

    if (!code || !state || state !== 'discord-achievements') {
        return new Response('Invalid request', { status: 400 });
    }

    const client = new AuthorizationCode(DiscordOAuthConfig);

    const tokenParams = {
        code,
        scope: 'identify',
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

    return response;
}
