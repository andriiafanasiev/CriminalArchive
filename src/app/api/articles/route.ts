import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const articles = await prisma.crimeArticle.findMany({
            include: {
                CaseLinks: {
                    include: {
                        case: true,
                    },
                },
            },
        });
        return NextResponse.json(articles);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch articles' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { NUMBER_STATYA, DESCRIPTION_STATYA } = body;

        const newArticle = await prisma.crimeArticle.create({
            data: {
                NUMBER_STATYA,
                DESCRIPTION_STATYA,
            },
        });

        return NextResponse.json(newArticle);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create article' },
            { status: 500 }
        );
    }
}
