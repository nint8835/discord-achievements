import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

const handler = NextAuth({
    providers: [
        DiscordProvider({
            clientId: process.env.ACHIEVEMENT_DISCORD_CLIENT_ID!,
            clientSecret: process.env.ACHIEVEMENT_DISCORD_CLIENT_SECRET!,
        }),
    ],
});

export { handler as GET, handler as POST };
