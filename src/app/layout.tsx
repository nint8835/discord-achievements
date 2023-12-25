import { Inter } from 'next/font/google';

import Navbar from '@/components/navbar';

import { ssrGetCurrentUser } from '@/lib/auth';

import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-sans',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const currentUser = await ssrGetCurrentUser();

    return (
        <html lang="en" className={inter.variable}>
            <body className="dark h-screen">
                <div className="h-full">
                    <Navbar currentUser={currentUser} />
                    <div className="h-[calc(100vh_-_3rem)] overflow-scroll">{children}</div>
                </div>
            </body>
        </html>
    );
}
