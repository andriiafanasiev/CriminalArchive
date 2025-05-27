import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            include: {
                investigator: true,
            },
        });
        return NextResponse.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        return NextResponse.json(
            { error: 'Помилка при отриманні даних' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                login: data.login,
                password: hashedPassword,
                role: data.role,
                investigatorId: data.investigatorId,
            },
            include: {
                investigator: true,
            },
        });

        const userResponse = {
            id: user.id,
            login: user.login,
            role: user.role,
            investigatorId: user.investigatorId,
            investigator: user.investigator,
        };

        return NextResponse.json(userResponse);
    } catch (err) {
        console.error('Error creating user:', err);
        return NextResponse.json(
            { error: 'Помилка при створенні користувача' },
            { status: 500 }
        );
    }
}
