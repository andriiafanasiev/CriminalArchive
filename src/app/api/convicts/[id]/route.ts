import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const convictId = parseInt(params.id);

        const convict = await prisma.convict.findUnique({
            where: { id: convictId },
        });

        if (!convict) {
            return NextResponse.json(
                { error: 'Засудженого не знайдено' },
                { status: 404 }
            );
        }

        return NextResponse.json(convict);
    } catch (error) {
        console.error('Помилка при отриманні засудженого:', error);
        return NextResponse.json(
            { error: 'Помилка при отриманні засудженого' },
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
        const convictId = parseInt(params.id);

        const updatedConvict = await prisma.convict.update({
            where: { id: convictId },
            data: {
                fio: data.fio,
                birthDate: new Date(data.birthDate),
                address: data.address,
                contact: data.contact || null,
            },
        });

        return NextResponse.json(updatedConvict);
    } catch (error) {
        console.error('Помилка при оновленні засудженого:', error);
        return NextResponse.json(
            { error: 'Помилка при оновленні засудженого' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const convictId = parseInt(params.id);

        // Спочатку видаляємо пов'язані записи
        await prisma.sentence.deleteMany({
            where: { convictId },
        });

        await prisma.case.deleteMany({
            where: { convictId },
        });

        // Потім видаляємо самого засудженого
        await prisma.convict.delete({
            where: { id: convictId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Помилка при видаленні засудженого:', error);
        return NextResponse.json(
            { error: 'Помилка при видаленні засудженого' },
            { status: 500 }
        );
    }
}
