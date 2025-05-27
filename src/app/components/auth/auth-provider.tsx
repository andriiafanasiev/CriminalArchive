'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type User = {
    id: number;
    login: string;
    role: 'admin' | 'slidchiy';
    investigatorId: number | null;
    investigator: {
        id: number;
        fio: string;
        position: string;
    } | null;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Перевіряємо чи користувач авторизований
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Якщо користувач на сторінці входу, перенаправляємо його
            if (pathname === '/login') {
                if (parsedUser.role === 'admin') {
                    router.push('/cases');
                } else if (parsedUser.role === 'slidchiy') {
                    router.push('/investigators');
                }
            }
        }
        setLoading(false);
    }, [pathname, router]);

    useEffect(() => {
        // Перенаправляємо на сторінку входу, якщо користувач не авторизований
        if (!loading && !user && pathname !== '/login') {
            router.push('/login');
        }
    }, [loading, user, pathname, router]);

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
