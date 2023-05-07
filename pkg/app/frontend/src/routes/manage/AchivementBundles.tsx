import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ownedBundleQuery } from '../../queries/achievement_bundles';

export default function ManageAchievementBundles() {
    const bundlesQuery = useQuery(ownedBundleQuery);

    return bundlesQuery.isLoading ? (
        <div>Placeholder - this is the manage achievement bundles page</div>
    ) : (
        <div>{JSON.stringify(bundlesQuery.data)}</div>
    );
}
