import type { QueryClient } from '@tanstack/react-query';
type AchievementBundle = {
    id: number;
    name: string;
    description: string | null;
    image_url: string | null;
    owner_id: string;
    created_at: string;
    updated_at: string;
};

export async function getOwnedBundles(): Promise<AchievementBundle[]> {
    const response = await fetch('/achievement-bundles/owned');

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}

export const ownedBundleQuery = { queryKey: ['bundles', 'owned'], queryFn: getOwnedBundles };

export function ownedBundleLoader(queryClient: QueryClient) {
    return async () => queryClient.ensureQueryData(ownedBundleQuery);
}
