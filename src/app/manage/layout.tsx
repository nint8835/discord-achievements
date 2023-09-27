import NavLink from '@/components/navlink';

type SidebarLinkItem = {
    name: string;
    url: string;
};

function SidebarLink({ item }: { item: SidebarLinkItem }) {
    return (
        <NavLink
            url={item.url}
            className="rounded-md p-2 transition-colors hover:bg-purple-200 hover:text-zinc-800"
            activeClassName="bg-zinc-400 text-zinc-800"
            inactiveClassName="text-zinc-200"
        >
            {item.name}
        </NavLink>
    );
}

export default function ManageLayout({ children }: { children: React.ReactNode }) {
    const sidebarLinks: SidebarLinkItem[] = [
        {
            name: 'Achievements',
            url: '/manage/achievements',
        },
        {
            name: 'Achievement Bundles',
            url: '/manage/achievement-bundles',
        },
        {
            name: 'Integrations',
            url: '/manage/integrations',
        },
    ];

    return (
        <div className="flex w-full flex-col md:flex-row">
            <div className="flex flex-row gap-2 bg-zinc-700 p-4 md:w-52 md:flex-col">
                {sidebarLinks.map((item) => (
                    <SidebarLink key={item.url} item={item} />
                ))}
            </div>
            <div className="flex-1">{children}</div>
        </div>
    );
}
