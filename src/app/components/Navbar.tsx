'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="bg-white text-black">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="text-xl font-bold text-blue-500"
                        >
                            Архів Карного розшуку
                        </Link>
                    </div>
                    <div className="flex space-x-4">
                        <Link
                            href="/cases"
                            className={`hover:text-gray-300 ${
                                pathname === '/cases'
                                    ? 'text-blue-500 font-semibold'
                                    : ''
                            }`}
                        >
                            Справи
                        </Link>
                        <Link
                            href="/defendants"
                            className={`hover:text-gray-300 ${
                                pathname === '/defendants'
                                    ? 'text-blue-500 font-semibold'
                                    : ''
                            }`}
                        >
                            Підсудні
                        </Link>
                        <Link
                            href="/investigators"
                            className={`hover:text-gray-300 ${
                                pathname === '/investigators'
                                    ? 'text-blue-500 font-semibold'
                                    : ''
                            }`}
                        >
                            Слідчі
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
