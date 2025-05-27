import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const sentences = await prisma.sentence.findMany({
            include: {
                convict: true,
                case: {
                    include: {
                        investigator: true,
                        caseLinks: {
                            include: {
                                article: true,
                            },
                        },
                    },
                },
            },
        });
        return NextResponse.json(sentences);
    } catch (err) {
        console.error('Error fetching sentences:', err);
        return NextResponse.json(
            { error: 'Помилка при отриманні даних' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const sentence = await prisma.sentence.create({
            data: {
                convictId: data.convictId,
                caseId: data.caseId,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                termYears: data.termYears,
                type: data.type,
                location: data.location,
            },
            include: {
                convict: true,
                case: {
                    include: {
                        investigator: true,
                        caseLinks: {
                            include: {
                                article: true,
                            },
                        },
                    },
                },
            },
        });
        return NextResponse.json(sentence);
    } catch (err) {
        console.error('Error creating sentence:', err);
        return NextResponse.json(
            { error: 'Помилка при створенні вироку' },
            { status: 500 }
        );
    }
}
