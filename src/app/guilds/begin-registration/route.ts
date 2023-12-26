import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { AuthorizationCode } from 'simple-oauth2';

import { DiscordOAuthConfig } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const client = new AuthorizationCode(DiscordOAuthConfig);

    redirect(
        client.authorizeURL({
            scope: ['identify', 'guilds', 'bot'],
            redirect_uri: `${request.nextUrl.origin}/guilds/complete-registration`,
            state: 'discord-achievements',
        }),
    );
}
