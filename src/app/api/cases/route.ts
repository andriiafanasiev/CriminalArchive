import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
    Case,
    Convict,
    Investigator,
    Sentence,
    CaseLink,
} from '@prisma/client';

type CaseWithRelations = Case & {
    convict: Convict;
    investigator: Investigator;
    sentences: Sentence[];
    caseLinks: CaseLink[];
};

export async function GET() {
    try {
        const cases = await prisma.case.findMany({
            include: {
                convict: true,
                investigator: true,
                sentences: true,
                caseLinks: true,
            },
        });

        // Трансформуємо дані для відображення
        const transformedCases = cases.map((case_: CaseWithRelations) => ({
            id: case_.id,
            convictId: case_.convictId,
            investigatorId: case_.investigatorId,
            status: case_.status,
            convictName: case_.convict.fio,
            investigatorName: case_.investigator.fio,
            date: case_.caseLinks[0]?.date.toISOString() || null,
            sentence: case_.sentences[0]
                ? {
                      type: case_.sentences[0].type,
                      startDate: case_.sentences[0].startDate.toISOString(),
                      endDate:
                          case_.sentences[0].endDate?.toISOString() || null,
                      termYears: case_.sentences[0].termYears,
                      location: case_.sentences[0].location,
                  }
                : null,
        }));

        return NextResponse.json(transformedCases);
    } catch (error) {
        console.error('Помилка при отриманні справ:', error);
        return NextResponse.json(
            { error: 'Помилка при отриманні справ' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { defendantId, investigatorId, status, sentence } = data;

        const newCase = await prisma.case.create({
            data: {
                status,
                convictId: parseInt(defendantId),
                investigatorId: parseInt(investigatorId),
                caseLinks: {
                    create: {
                        date: new Date(),
                        articleId: 1, // Тимчасово, потім треба буде додати вибір статті
                    },
                },
                sentences: sentence
                    ? {
                          create: {
                              type: sentence.type,
                              startDate: new Date(sentence.startDate),
                              endDate: sentence.endDate
                                  ? new Date(sentence.endDate)
                                  : null,
                              termYears: sentence.termYears
                                  ? parseInt(sentence.termYears)
                                  : null,
                              location: sentence.location,
                              convictId: parseInt(defendantId),
                          },
                      }
                    : undefined,
            },
            include: {
                convict: true,
                investigator: true,
                sentences: true,
                caseLinks: true,
            },
        });

        return NextResponse.json(newCase);
    } catch (error) {
        console.error('Помилка при створенні справи:', error);
        return NextResponse.json(
            { error: 'Помилка при створенні справи' },
            { status: 500 }
        );
    }
}
