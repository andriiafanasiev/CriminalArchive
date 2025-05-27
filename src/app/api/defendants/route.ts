import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const defendants = await prisma.convict.findMany({
            orderBy: {
                fio: 'asc',
            },
        });

        return NextResponse.json(defendants);
    } catch (error) {
        console.error('Помилка при отриманні засуджених:', error);
        return NextResponse.json(
            { error: 'Помилка при отриманні засуджених' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { fio, birthDate, address, contact } = data;

        const defendant = await prisma.convict.create({
            data: {
                fio,
                birthDate: birthDate ? new Date(birthDate) : null,
                address,
                contact,
            },
        });

        return NextResponse.json(defendant);
    } catch (error) {
        console.error('Помилка при створенні засудженого:', error);
        return NextResponse.json(
            { error: 'Помилка при створенні засудженого' },
            { status: 500 }
        );
    }
}
