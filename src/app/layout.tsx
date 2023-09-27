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
            <body className="min-h-screen">
                <ContextProvider>
                    <div className="flex min-h-screen flex-col">
                        <Navbar />
                        <div className="flex flex-1">{children}</div>
                    </div>
                </ContextProvider>
            </body>
        </html>
    );
}
