'use client';

import { Bars3Icon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type NavBarItem = {
    name: string;
    href: string;
    isExternal?: boolean;
};

function NavBarLink(item: NavBarItem) {
    const pathname = usePathname();

    return (
        <Link
            href={item.href}
            passHref
            className={'transition-colors hover:text-purple-400' + (pathname === item.href ? ' underline' : '')}
            key={item.name}
        >
            {item.name}
        </Link>
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
                <div className="hidden flex-row items-center gap-4 md:flex">{items.map(NavBarLink)}</div>
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
                {items.map(NavBarLink)}
            </div>
        </nav>
    );
}
