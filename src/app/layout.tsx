import ContextProvider from '@/components/contexts';
import Navbar from '@/components/navbar';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'discord-achievements',
    description: 'Earn custom achievements from participating in Discord servers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <ContextProvider>
                    <Navbar />
                    {children}
                </ContextProvider>
            </body>
        </html>
    );
}
