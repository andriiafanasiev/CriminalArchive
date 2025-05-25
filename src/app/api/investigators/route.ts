import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const investigators = await prisma.investigator.findMany({
            include: {
                Cases: true,
            },
        });

        if (!Array.isArray(investigators)) {
            return NextResponse.json(
                { error: 'Invalid data format' },
                { status: 500 }
            );
        }

        return NextResponse.json(investigators);
    } catch (error) {
        console.error('Error fetching investigators:', error);
        return NextResponse.json(
            { error: 'Failed to fetch investigators' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { FIO_SLIDCHY, POSADA_SLIDCHY } = body;

        if (!FIO_SLIDCHY || !POSADA_SLIDCHY) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newInvestigator = await prisma.investigator.create({
            data: {
                FIO_SLIDCHY,
                POSADA_SLIDCHY,
            },
        });

        return NextResponse.json(newInvestigator);
    } catch (error) {
        console.error('Error creating investigator:', error);
        return NextResponse.json(
            { error: 'Failed to create investigator' },
            { status: 500 }
        );
    }
}
