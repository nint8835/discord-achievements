'use client';

import { Bars3Icon } from '@heroicons/react/24/solid';
import { signIn, signOut, useSession } from 'next-auth/react';
import { MouseEventHandler, useState } from 'react';
import NavLink from './navlink';

type NavBarItem = {
    name: string;
    href: string;
    isExternal?: boolean;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
};

function NavBarLink({ item }: { item: NavBarItem }) {
    const className = 'transition-colors hover:text-purple-400';

    return !item.isExternal ? (
        <NavLink url={item.href} matchPrefix className={className} activeClassName="underline">
            {item.name}
        </NavLink>
    ) : (
        <a href={item.href} className={className} onClick={item.onClick}>
            {item.name}
        </a>
    );
}

export default function Navbar() {
    const session = useSession();

    const items: NavBarItem[] = [
        {
            name: 'Home',
            href: '/',
        },
    ];

    if (session.status !== 'loading') {
        if (!session.data) {
            items.push({
                name: 'Login',
                href: '/api/auth/signin',
                isExternal: true,
                onClick: (e) => {
                    e.preventDefault();
                    signIn();
                },
            });
        } else {
            items.push({
                name: 'Manage',
                href: '/manage',
            });
            items.push({
                name: 'Logout',
                href: '/api/auth/signout',
                isExternal: true,
                onClick: (e) => {
                    e.preventDefault();
                    signOut();
                },
            });
        }
    }

    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <nav className="w-full bg-zinc-800 py-2 text-zinc-50">
            <div className="container mx-auto flex justify-between px-2">
                <div className="text-xl font-bold">
                    <a href="/">discord-achievements</a>
                </div>
                <div className="hidden flex-row items-center gap-4 md:flex">
                    {items.map((item) => (
                        <NavBarLink item={item} key={item.name} />
                    ))}
                </div>
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
                {items.map((item) => (
                    <NavBarLink item={item} key={item.name} />
                ))}
            </div>
        </nav>
    );
}
