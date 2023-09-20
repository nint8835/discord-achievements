import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import db from '@/db';
import { getServerSession } from 'next-auth';

export default async function ManageAchievementBundles() {
    const session = await getServerSession(AuthOptions);
    const ownedBundles = await db.query.achievementBundles.findMany({
        where: (achievementBundles, { eq }) => eq(achievementBundles.ownerId, session!.user.id),
    });

    return (
        <div className="flex h-full flex-1 items-center justify-center">{JSON.stringify(ownedBundles, null, 2)}</div>
    );
}
