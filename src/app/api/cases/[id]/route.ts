import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const caseId = parseInt(params.id);

        const caseData = await prisma.case.findUnique({
            where: { id: caseId },
            include: {
                convict: {
                    select: {
                        id: true,
                        fio: true,
                    },
                },
                investigator: {
                    select: {
                        id: true,
                        fio: true,
                    },
                },
            },
        });

        if (!caseData) {
            return NextResponse.json(
                { error: 'Справу не знайдено' },
                { status: 404 }
            );
        }

        return NextResponse.json(caseData);
    } catch (error) {
        console.error('Помилка при отриманні справи:', error);
        return NextResponse.json(
            { error: 'Помилка при отриманні справи' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();
        const caseId = parseInt(params.id);

        const updatedCase = await prisma.case.update({
            where: { id: caseId },
            data: {
                convictId: data.convictId,
                investigatorId: data.investigatorId,
                status: data.status,
            },
        });

        return NextResponse.json(updatedCase);
    } catch (error) {
        console.error('Помилка при оновленні справи:', error);
        return NextResponse.json(
            { error: 'Помилка при оновленні справи' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const caseId = parseInt(params.id);

        // Спочатку видаляємо пов'язані записи
        await prisma.caseLink.deleteMany({
            where: { caseId },
        });

        await prisma.sentence.deleteMany({
            where: { caseId },
        });

        // Потім видаляємо саму справу
        await prisma.case.delete({
            where: { id: caseId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Помилка при видаленні справи:', error);
        return NextResponse.json(
            { error: 'Помилка при видаленні справи' },
            { status: 500 }
        );
    }
}
