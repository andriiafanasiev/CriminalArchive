import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        console.log('Fetching convicts...');

        const convicts = await prisma.convict.findMany({
            include: {
                cases: {
                    include: {
                        caseLinks: {
                            include: {
                                article: true,
                            },
                        },
                    },
                },
                sentences: true,
            },
        });

        console.log('Convicts fetched successfully:', convicts.length);
        return NextResponse.json(convicts);
    } catch (error) {
        console.error('Detailed error in GET /api/convicts:', {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json(
            {
                error: 'Помилка при отриманні даних',
                details:
                    error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const convict = await prisma.convict.create({
            data: {
                fio: data.fio,
                birthDate: new Date(data.birthDate),
                address: data.address,
                contact: data.contact || null,
            },
        });
        return NextResponse.json(convict);
    } catch (error) {
        console.error('Помилка при створенні засудженого:', error);
        return NextResponse.json(
            { error: 'Помилка при створенні засудженого' },
            { status: 500 }
        );
    }
}
