import { Bars3Icon } from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getCurrentUser } from '../queries/user';

type NavBarItem = {
    name: string;
    href: string;
    isExternal?: boolean;
};

function navBarLink(item: NavBarItem) {
    return (
        <NavLink
            to={item.href}
            className={({ isActive, isPending }) =>
                'transition-colors hover:text-purple-400' + (isActive ? ' underline' : '')
            }
            reloadDocument={item.isExternal}
            key={item.name}
        >
            {item.name}
        </NavLink>
    );
}

function Navbar() {
    const currentUserQuery = useQuery({ queryKey: ['currentUser'], queryFn: getCurrentUser });

    const items: NavBarItem[] = [
        {
            name: 'Home',
            href: '/',
        },
    ];

    if (currentUserQuery.isFetched) {
        if (!currentUserQuery.data) {
            items.push({
                name: 'Login',
                href: '/auth/login',
                isExternal: true,
            });
        } else {
            items.push({
                name: 'Manage',
                href: '/manage',
            });
            items.push({
                name: 'Logout',
                href: '/auth/logout',
                isExternal: true,
            });
        }
    }

    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <nav className="fixed w-full bg-zinc-800 py-2 text-zinc-50">
            <div className="container mx-auto flex justify-between px-2">
                <div className="text-xl font-bold">
                    <a href="/">discord-achievements</a>
                </div>
                <div className="hidden flex-row items-center gap-4 md:flex">{items.map(navBarLink)}</div>
                <div className="flex md:hidden">
                    <button
                        onClick={() => {
                            setShowMobileMenu(!showMobileMenu);
                        }}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </div>
            </div>
            <div className={`${showMobileMenu ? 'flex' : 'hidden'} flex-col gap-2 px-2 pt-2 md:hidden `}>
                {items.map(navBarLink)}
            </div>
        </nav>
    );
}

export default Navbar;
