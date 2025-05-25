import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const articles = await prisma.crimeArticle.findMany();

        if (!Array.isArray(articles)) {
            return NextResponse.json(
                { error: 'Invalid data format' },
                { status: 500 }
            );
        }

        return NextResponse.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
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

        if (!NUMBER_STATYA) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newArticle = await prisma.crimeArticle.create({
            data: {
                NUMBER_STATYA,
                DESCRIPTION_STATYA,
            },
        });

        return NextResponse.json(newArticle);
    } catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json(
            { error: 'Failed to create article' },
            { status: 500 }
        );
    }
}
