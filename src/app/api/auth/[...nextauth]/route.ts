import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const AuthOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.ACHIEVEMENT_DISCORD_CLIENT_ID!,
            clientSecret: process.env.ACHIEVEMENT_DISCORD_CLIENT_SECRET!,
        }),
    ],
};

const handler = NextAuth(AuthOptions);

export { handler as GET, handler as POST };
