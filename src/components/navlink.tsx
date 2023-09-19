'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({
    children,
    url,
    className,
    activeClassName,
    inactiveClassName = '',
    matchPrefix = false,
    prefetch = false,
}: {
    children: React.ReactNode;
    url: string;
    className: string;
    activeClassName: string;
    inactiveClassName?: string;
    matchPrefix?: boolean;
    prefetch?: boolean;
}) {
    const pathname = usePathname();
    let linkClassName = className;

    if (pathname === url || (matchPrefix && pathname.startsWith(url + '/'))) {
        linkClassName += ' ' + activeClassName;
    } else {
        linkClassName += ' ' + inactiveClassName;
    }

    return (
        <Link href={url} className={linkClassName} prefetch={prefetch}>
            {children}
        </Link>
    );
}
