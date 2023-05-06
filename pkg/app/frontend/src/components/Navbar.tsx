import { Bars3Icon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

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
        >
            {item.name}
        </NavLink>
    );
}

function Navbar() {
    const items: NavBarItem[] = [
        {
            name: 'Home',
            href: '/',
        },
        {
            name: 'Login',
            href: '/auth/login',
            isExternal: true,
        },
        {
            name: 'Logout',
            href: '/auth/logout',
            isExternal: true,
        },
    ];

    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <nav className="bg-zinc-800 py-2 text-zinc-50">
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
