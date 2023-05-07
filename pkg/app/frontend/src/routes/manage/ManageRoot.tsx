import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

type SidebarLinkItem = {
    name: string;
    url: string;
};

function SidebarLink(item: SidebarLinkItem) {
    return (
        <NavLink
            to={item.url}
            className={({ isActive, isPending }) =>
                'rounded-md p-2 transition-colors hover:bg-purple-200 hover:text-zinc-800' +
                (isActive ? ' bg-zinc-400 text-zinc-800' : ' text-zinc-200')
            }
        >
            {item.name}
        </NavLink>
    );
}

export default function ManageRoot() {
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
        <div className="flex h-full flex-col md:flex-row">
            <div className="flex w-full flex-row gap-2 bg-zinc-700 p-4 md:h-full md:w-52 md:flex-col">
                {sidebarLinks.map(SidebarLink)}
            </div>
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}
