import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const articles = await prisma.crimeArticle.findMany({
            include: {
                caseLinks: {
                    include: {
                        case: {
                            include: {
                                convict: true,
                                investigator: true,
                            },
                        },
                    },
                },
            },
        });
        return NextResponse.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json(
            { error: 'Помилка при отриманні даних' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { number, description } = body;

        if (!number || !description) {
            return NextResponse.json(
                { error: "Номер та опис є обов'язковими полями" },
                { status: 400 }
            );
        }

        const article = await prisma.crimeArticle.create({
            data: {
                number,
                description,
            },
        });

        return NextResponse.json(article);
    } catch (error) {
        console.error('Помилка при створенні статті:', error);
        return NextResponse.json(
            { error: 'Помилка при створенні статті' },
            { status: 500 }
        );
    }
}
