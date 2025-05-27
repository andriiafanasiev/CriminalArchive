import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { login, password } = await request.json();

        const user = await prisma.user.findUnique({
            where: {
                login,
            },
            include: {
                investigator: true,
            },
        });

        if (!user || user.password !== password) {
            return NextResponse.json(
                { error: 'Невірний логін або пароль' },
                { status: 401 }
            );
        }

        // Повертаємо дані користувача без пароля
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Помилка при авторизації:', error);
        return NextResponse.json(
            { error: 'Помилка при авторизації' },
            { status: 500 }
        );
    }
}
