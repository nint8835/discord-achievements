import ContextProvider from '@/components/contexts';
import Navbar from '@/components/navbar';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'discord-achievements',
    description: 'Earn custom achievements from participating in Discord servers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ContextProvider>
                    <Navbar />
                    {children}
                </ContextProvider>
            </body>
        </html>
    );
}
