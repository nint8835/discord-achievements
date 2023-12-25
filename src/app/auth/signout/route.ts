import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { SessionData, SessionOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const response = new Response(null, {
        status: 302,
    });
    response.headers.set('Location', request.nextUrl.origin);

    const session = await getIronSession<SessionData>(cookies(), SessionOptions);
    session.user = undefined;
    await session.save();

    return response;
}
