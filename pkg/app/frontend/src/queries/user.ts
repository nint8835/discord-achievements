type User = {
    id: string;
    username: string;
    avatar_url: string;
};

export async function getCurrentUser(): Promise<User | null> {
    const response = await fetch('/auth/user');
    return await response.json();
}
