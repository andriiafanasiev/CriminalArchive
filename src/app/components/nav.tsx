'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from './auth/auth-provider';

export function Nav() {
    const pathname = usePathname();
    const { user } = useAuth();

    const links = [
        { href: '/cases', label: 'Справи' },
        { href: '/convicts', label: 'Засуджені' },
        { href: '/investigators', label: 'Слідчі' },
        { href: '/articles', label: 'Статті' },
    ];

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link
                                href="/"
                                className="text-xl font-bold text-gray-900"
                            >
                                Судова система
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                                        pathname === link.href
                                            ? 'border-black text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <span className="text-sm text-gray-500">
                                {user.role === 'admin'
                                    ? 'Адміністратор'
                                    : 'Слідчий'}
                            </span>
                        ) : (
                            <Link
                                href="/login"
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Увійти
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
