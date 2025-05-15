import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Система управління справами',
    description: 'Система управління справами та підсудними',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="uk">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen  bg-center bg-no-repeat bg-fixed`}
                style={{
                    backgroundImage: 'url("/assets/justice-bg.jpeg")',
                }}
            >
                <div className="min-h-screen bg-black/50">
                    <Navbar />
                    <main className="container mx-auto px-4 py-8">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
