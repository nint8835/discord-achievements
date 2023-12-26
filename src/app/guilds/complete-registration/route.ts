import type { NextRequest } from 'next/server';
import { AuthorizationCode, type AuthorizationTokenConfig } from 'simple-oauth2';

import db from '@/db';
import { guildMemberships, guilds } from '@/db/schema';
import { DiscordOAuthConfig, ssrGetCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const currentUser = await ssrGetCurrentUser();
    if (!currentUser) {
        return new Response('Unauthorized', { status: 403 });
    }

    const parsedUrl = request.nextUrl;
    const code = parsedUrl.searchParams.get('code');
    const state = parsedUrl.searchParams.get('state');
    const guildId = parsedUrl.searchParams.get('guild_id');

    if (!code || !state || state !== 'discord-achievements' || !guildId) {
        return new Response('Invalid request', { status: 400 });
    }

    const client = new AuthorizationCode(DiscordOAuthConfig);

    const tokenParams: AuthorizationTokenConfig = {
        code,
        scope: ['identify', 'guilds', 'bot'],
        redirect_uri: `${parsedUrl.origin}/guilds/complete-registration`,
    };
    const accessToken = await client.getToken(tokenParams);

    const guildsReq = await fetch('https://discord.com/api/v10/users/@me/guilds?limit=200', {
        headers: { Authorization: `Bearer ${accessToken.token.access_token}` },
    });
    const userGuilds = (await guildsReq.json()) as any[];

    const guild = userGuilds.find((guild) => guild.id === guildId);

    await db
        .insert(guilds)
        .values({
            id: guild.id,
            name: guild.name,
        })
        .onConflictDoUpdate({
            target: guilds.id,
            set: {
                name: guild.name,
            },
        });

    await db.insert(guildMemberships).values({ guildId, userId: currentUser.id }).onConflictDoNothing();

    const response = new Response(null, { status: 302 });
    response.headers.set('Location', `${parsedUrl.origin}/guilds/${guildId}`);

    return response;
}
