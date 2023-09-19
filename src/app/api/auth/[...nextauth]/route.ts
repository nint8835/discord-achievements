import { createOrUpdateUser } from '@/db/users';
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
    events: {
        signIn: async (message) => {
            return createOrUpdateUser({
                id: message.account?.providerAccountId!,
                username: message.profile?.name!,
                avatarUrl: message.profile?.image!,
            });
        },
    },
};

const handler = NextAuth(AuthOptions);

export { handler as GET, handler as POST };
