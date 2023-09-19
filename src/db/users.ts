import db from '.';
import { users } from './schema';

export async function createOrUpdateUser(data: { id: string; username: string; avatarUrl: string }): Promise<void> {
    await db
        .insert(users)
        .values(data)
        .onConflictDoUpdate({
            target: users.id,
            set: {
                username: data.username,
                avatarUrl: data.avatarUrl,
            },
        });
}
