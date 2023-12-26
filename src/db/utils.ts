import db from './db';
import { users } from './schema';

export async function createOrUpdateUser(data: {
    id: string;
    displayName: string;
}): Promise<typeof users.$inferSelect> {
    return db
        .insert(users)
        .values(data)
        .onConflictDoUpdate({
            target: users.id,
            set: {
                displayName: data.displayName,
            },
        })
        .returning()
        .get();
}
