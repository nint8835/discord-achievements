import type { Config } from 'drizzle-kit';

export default {
    schema: './src/db/schema.ts',
    driver: 'better-sqlite',
    dbCredentials: {
        url: 'achievements.sqlite',
    },
    out: './src/db/migrations',
} satisfies Config;
