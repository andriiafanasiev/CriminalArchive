import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        console.log('Fetching investigators...');
        const investigators = await prisma.investigator.findMany({
            orderBy: {
                fio: 'asc',
            },
        });

        console.log(
            'Investigators fetched successfully:',
            investigators.length
        );
        return NextResponse.json(investigators);
    } catch (error) {
        console.error('Помилка при отриманні слідчих:', error);
        return NextResponse.json(
            { error: 'Помилка при отриманні слідчих' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fio, position } = body;

        if (!fio || !position) {
            return NextResponse.json(
                { error: "ПІБ та посада є обов'язковими полями" },
                { status: 400 }
            );
        }

        const investigator = await prisma.investigator.create({
            data: {
                fio,
                position,
            },
        });

        return NextResponse.json(investigator);
    } catch (error) {
        console.error('Помилка при створенні слідчого:', error);
        return NextResponse.json(
            { error: 'Помилка при створенні слідчого' },
            { status: 500 }
        );
    }
}
