'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth/auth-provider';
import { Button } from './ui/button';

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // Не показуємо навігацію на сторінці логіну
    if (pathname === '/login') {
        return null;
    }

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link
                                href="/"
                                className="text-xl font-bold text-blue-500"
                            >
                                Архів карного розшуку
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8 sm:items-center">
                            <Link
                                href="/cases"
                                className={`text-gray-800 hover:text-gray-300 ${
                                    pathname === '/cases'
                                        ? 'text-blue-700 font-semibold'
                                        : ''
                                }`}
                            >
                                Справи
                            </Link>
                            <Link
                                href="/defendants"
                                className={`text-gray-800 hover:text-gray-300 ${
                                    pathname === '/defendants'
                                        ? 'text-blue-700 font-semibold'
                                        : ''
                                }`}
                            >
                                Засуджені
                            </Link>
                            <Link
                                href="/investigators"
                                className={`text-gray-800 hover:text-gray-300 ${
                                    pathname === '/investigators'
                                        ? 'text-blue-700 font-semibold'
                                        : ''
                                }`}
                            >
                                Слідчі
                            </Link>
                            <Link
                                href="/articles"
                                className={`text-gray-800 hover:text-gray-300 ${
                                    pathname === '/articles'
                                        ? 'text-blue-700 font-semibold'
                                        : ''
                                }`}
                            >
                                Статті
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {user && (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                    {user.role === 'admin'
                                        ? 'Адміністратор'
                                        : user.investigator?.fio}
                                </span>
                                <Button
                                    onClick={logout}
                                    variant="outline"
                                    className="text-sm"
                                >
                                    Вийти
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
