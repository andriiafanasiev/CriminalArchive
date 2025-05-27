import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'Не вказано ID користувача' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId),
            },
            include: {
                investigator: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Користувача не знайдено' },
                { status: 404 }
            );
        }

        // Повертаємо дані користувача без пароля
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Помилка при перевірці авторизації:', error);
        return NextResponse.json(
            { error: 'Помилка при перевірці авторизації' },
            { status: 500 }
        );
    }
}
