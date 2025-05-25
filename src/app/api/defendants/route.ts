import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const convicts = await prisma.convict.findMany({
            include: {
                Cases: true,
            },
        });

        if (!Array.isArray(convicts)) {
            return NextResponse.json(
                { error: 'Invalid data format' },
                { status: 500 }
            );
        }

        return NextResponse.json(convicts);
    } catch (error) {
        console.error('Error fetching convicts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch convicts' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { FIO_ZASUDZ, DATE_NARODZH, ADRESS_ZASUDZ, CONTACT_ZASUDZ } =
            body;

        if (!FIO_ZASUDZ || !ADRESS_ZASUDZ) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newConvict = await prisma.convict.create({
            data: {
                FIO_ZASUDZ,
                DATE_NARODZH: DATE_NARODZH ? new Date(DATE_NARODZH) : null,
                ADRESS_ZASUDZ,
                CONTACT_ZASUDZ,
            },
        });

        return NextResponse.json(newConvict);
    } catch (error) {
        console.error('Error creating convict:', error);
        return NextResponse.json(
            { error: 'Failed to create convict' },
            { status: 500 }
        );
    }
}
