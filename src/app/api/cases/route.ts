import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const cases = await prisma.case.findMany({
            include: {
                convict: true,
                investigator: true,
                CaseLinks: {
                    include: {
                        article: true,
                    },
                },
            },
        });

        if (!Array.isArray(cases)) {
            return NextResponse.json(
                { error: 'Invalid data format' },
                { status: 500 }
            );
        }

        return NextResponse.json(cases);
    } catch (error) {
        console.error('Error fetching cases:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cases' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { ID_ZASUDZ, ID_SLIDCHY, STATUS_SPRAVY } = body;

        if (!ID_ZASUDZ || !ID_SLIDCHY || !STATUS_SPRAVY) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newCase = await prisma.case.create({
            data: {
                ID_ZASUDZ: parseInt(ID_ZASUDZ),
                ID_SLIDCHY: parseInt(ID_SLIDCHY),
                STATUS_SPRAVY,
            },
            include: {
                convict: true,
                investigator: true,
            },
        });

        return NextResponse.json(newCase);
    } catch (error) {
        console.error('Error creating case:', error);
        return NextResponse.json(
            { error: 'Failed to create case' },
            { status: 500 }
        );
    }
}
