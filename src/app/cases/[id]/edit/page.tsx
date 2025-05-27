'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/app/components/ui/select';

interface Case {
    id: number;
    convictId: number;
    investigatorId: number;
    status: 'active' | 'closed' | 'pending';
    convict: {
        id: number;
        fio: string;
    };
    investigator: {
        id: number;
        fio: string;
    };
    sentence?: {
        type: string;
        startDate?: string;
        endDate?: string;
        termYears?: string;
        location?: string;
        fineStatus?: string;
    };
}

interface Convict {
    id: number;
    fio: string;
}

interface Investigator {
    id: number;
    fio: string;
}

export default function EditCasePage({ params }: { params: { id: string } }) {
    const [caseData, setCaseData] = useState<Case | null>(null);
    const [convicts, setConvicts] = useState<Convict[]>([]);
    const [investigators, setInvestigators] = useState<Investigator[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [caseResponse, convictsResponse, investigatorsResponse] =
                    await Promise.all([
                        fetch(`/api/cases/${params.id}`),
                        fetch('/api/convicts'),
                        fetch('/api/investigators'),
                    ]);

                if (
                    !caseResponse.ok ||
                    !convictsResponse.ok ||
                    !investigatorsResponse.ok
                ) {
                    throw new Error('Помилка при отриманні даних');
                }

                const [caseData, convictsData, investigatorsData] =
                    await Promise.all([
                        caseResponse.json(),
                        convictsResponse.json(),
                        investigatorsResponse.json(),
                    ]);

                setCaseData(caseData);
                setConvicts(convictsData);
                setInvestigators(investigatorsData);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Помилка при завантаженні даних'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!caseData) return;

        try {
            const response = await fetch(`/api/cases/${params.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    convictId: caseData.convictId,
                    investigatorId: caseData.investigatorId,
                    status: caseData.status,
                    sentence: caseData.sentence
                        ? {
                              type: caseData.sentence.type,
                              startDate: caseData.sentence.startDate,
                              endDate: caseData.sentence.endDate,
                              termYears: caseData.sentence.termYears,
                              location: caseData.sentence.location,
                              fineStatus: caseData.sentence.fineStatus,
                          }
                        : undefined,
                }),
            });

            if (!response.ok) {
                throw new Error('Помилка при оновленні даних');
            }

            router.push('/cases');
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Помилка при оновленні даних'
            );
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Завантаження...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                {error}
            </div>
        );
    }

    if (!caseData) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                Справу не знайдено
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">
                    Редагування справи
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-lg shadow-lg p-6 space-y-4 text-black"
                >
                    <div className="space-y-2">
                        <Label htmlFor="convict" className="text-black">
                            Засуджений
                        </Label>
                        <Select
                            value={caseData.convictId.toString()}
                            onValueChange={(value) =>
                                setCaseData({
                                    ...caseData,
                                    convictId: parseInt(value),
                                })
                            }
                        >
                            <SelectTrigger className="bg-white text-black border-gray-300">
                                <SelectValue placeholder="Виберіть засудженого" />
                            </SelectTrigger>
                            <SelectContent>
                                {convicts.map((convict) => (
                                    <SelectItem
                                        key={convict.id}
                                        value={convict.id.toString()}
                                        className="text-black"
                                    >
                                        {convict.fio}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="investigator" className="text-black">
                            Слідчий
                        </Label>
                        <Select
                            value={caseData.investigatorId.toString()}
                            onValueChange={(value) =>
                                setCaseData({
                                    ...caseData,
                                    investigatorId: parseInt(value),
                                })
                            }
                        >
                            <SelectTrigger className="bg-white text-black border-gray-300">
                                <SelectValue placeholder="Виберіть слідчого" />
                            </SelectTrigger>
                            <SelectContent>
                                {investigators.map((investigator) => (
                                    <SelectItem
                                        key={investigator.id}
                                        value={investigator.id.toString()}
                                        className="text-black"
                                    >
                                        {investigator.fio}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-black">
                            Статус
                        </Label>
                        <Select
                            value={caseData.status}
                            onValueChange={(
                                value: 'active' | 'closed' | 'pending'
                            ) =>
                                setCaseData({
                                    ...caseData,
                                    status: value,
                                })
                            }
                        >
                            <SelectTrigger className="bg-white text-black border-gray-300">
                                <SelectValue placeholder="Виберіть статус" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    value="active"
                                    className="text-black"
                                >
                                    Активна
                                </SelectItem>
                                <SelectItem
                                    value="closed"
                                    className="text-black"
                                >
                                    Закрита
                                </SelectItem>
                                <SelectItem
                                    value="pending"
                                    className="text-black"
                                >
                                    Очікує розгляду
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="border-t pt-6">
                        <h2 className="text-lg font-semibold mb-4 text-black">
                            Вирок
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="sentenceType"
                                    className="text-black"
                                >
                                    Тип вироку
                                </Label>
                                <Select
                                    value={caseData.sentence?.type || ''}
                                    onValueChange={(value) =>
                                        setCaseData({
                                            ...caseData,
                                            sentence: {
                                                ...caseData.sentence,
                                                type: value,
                                            },
                                        })
                                    }
                                >
                                    <SelectTrigger className="bg-white text-black border-gray-300">
                                        <SelectValue placeholder="Виберіть тип вироку" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="imprisonment"
                                            className="text-black"
                                        >
                                            Позбавлення волі
                                        </SelectItem>
                                        <SelectItem
                                            value="conditional"
                                            className="text-black"
                                        >
                                            Умовне
                                        </SelectItem>
                                        <SelectItem
                                            value="fine"
                                            className="text-black"
                                        >
                                            Штраф
                                        </SelectItem>
                                        <SelectItem
                                            value="correctional"
                                            className="text-black"
                                        >
                                            Виправні роботи
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {caseData.sentence?.type && (
                                <>
                                    <div>
                                        <Label
                                            htmlFor="startDate"
                                            className="text-black"
                                        >
                                            {caseData.sentence?.type === 'fine'
                                                ? 'Дата вироку'
                                                : 'Дата початку'}
                                        </Label>
                                        <Input
                                            id="startDate"
                                            type="date"
                                            value={
                                                caseData.sentence?.startDate ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                setCaseData({
                                                    ...caseData,
                                                    sentence: {
                                                        type:
                                                            caseData.sentence
                                                                ?.type || '',
                                                        startDate:
                                                            e.target.value,
                                                        endDate:
                                                            caseData.sentence
                                                                ?.endDate || '',
                                                        termYears:
                                                            caseData.sentence
                                                                ?.termYears ||
                                                            '',
                                                        location:
                                                            caseData.sentence
                                                                ?.location ||
                                                            '',
                                                        fineStatus:
                                                            caseData.sentence
                                                                ?.fineStatus,
                                                    },
                                                })
                                            }
                                            className="bg-white text-black"
                                        />
                                    </div>

                                    {caseData.sentence?.type ===
                                        'imprisonment' && (
                                        <div>
                                            <Label
                                                htmlFor="endDate"
                                                className="text-black"
                                            >
                                                Дата закінчення
                                            </Label>
                                            <Input
                                                id="endDate"
                                                type="date"
                                                value={
                                                    caseData.sentence
                                                        ?.endDate || ''
                                                }
                                                onChange={(e) =>
                                                    setCaseData({
                                                        ...caseData,
                                                        sentence: {
                                                            type:
                                                                caseData
                                                                    .sentence
                                                                    ?.type ||
                                                                '',
                                                            startDate:
                                                                caseData
                                                                    .sentence
                                                                    ?.startDate ||
                                                                '',
                                                            endDate:
                                                                e.target.value,
                                                            termYears:
                                                                caseData
                                                                    .sentence
                                                                    ?.termYears ||
                                                                '',
                                                            location:
                                                                caseData
                                                                    .sentence
                                                                    ?.location ||
                                                                '',
                                                            fineStatus:
                                                                caseData
                                                                    .sentence
                                                                    ?.fineStatus,
                                                        },
                                                    })
                                                }
                                                className="bg-white text-black"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <Label
                                            htmlFor="termYears"
                                            className="text-black"
                                        >
                                            {caseData.sentence?.type === 'fine'
                                                ? 'Сума штрафу'
                                                : 'Термін (роки)'}
                                        </Label>
                                        <Input
                                            id="termYears"
                                            type="number"
                                            value={
                                                caseData.sentence?.termYears ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                setCaseData({
                                                    ...caseData,
                                                    sentence: {
                                                        type:
                                                            caseData.sentence
                                                                ?.type || '',
                                                        startDate:
                                                            caseData.sentence
                                                                ?.startDate ||
                                                            '',
                                                        endDate:
                                                            caseData.sentence
                                                                ?.endDate || '',
                                                        termYears:
                                                            e.target.value,
                                                        location:
                                                            caseData.sentence
                                                                ?.location ||
                                                            '',
                                                        fineStatus:
                                                            caseData.sentence
                                                                ?.fineStatus,
                                                    },
                                                })
                                            }
                                            className="bg-white text-black"
                                        />
                                    </div>

                                    {caseData.sentence?.type ===
                                        'imprisonment' && (
                                        <div>
                                            <Label
                                                htmlFor="location"
                                                className="text-black"
                                            >
                                                Місце відбування покарання
                                            </Label>
                                            <Input
                                                id="location"
                                                type="text"
                                                value={
                                                    caseData.sentence
                                                        ?.location || ''
                                                }
                                                onChange={(e) =>
                                                    setCaseData({
                                                        ...caseData,
                                                        sentence: {
                                                            type:
                                                                caseData
                                                                    .sentence
                                                                    ?.type ||
                                                                '',
                                                            startDate:
                                                                caseData
                                                                    .sentence
                                                                    ?.startDate ||
                                                                '',
                                                            endDate:
                                                                caseData
                                                                    .sentence
                                                                    ?.endDate ||
                                                                '',
                                                            termYears:
                                                                caseData
                                                                    .sentence
                                                                    ?.termYears ||
                                                                '',
                                                            location:
                                                                e.target.value,
                                                            fineStatus:
                                                                caseData
                                                                    .sentence
                                                                    ?.fineStatus,
                                                        },
                                                    })
                                                }
                                                className="bg-white text-black"
                                            />
                                        </div>
                                    )}

                                    {caseData.sentence?.type === 'fine' && (
                                        <div>
                                            <Label
                                                htmlFor="fineStatus"
                                                className="text-black"
                                            >
                                                Статус штрафу
                                            </Label>
                                            <Select
                                                value={
                                                    caseData.sentence
                                                        ?.fineStatus || ''
                                                }
                                                onValueChange={(value) =>
                                                    setCaseData({
                                                        ...caseData,
                                                        sentence: {
                                                            type:
                                                                caseData
                                                                    .sentence
                                                                    ?.type ||
                                                                '',
                                                            startDate:
                                                                caseData
                                                                    .sentence
                                                                    ?.startDate ||
                                                                '',
                                                            endDate:
                                                                caseData
                                                                    .sentence
                                                                    ?.endDate ||
                                                                '',
                                                            termYears:
                                                                caseData
                                                                    .sentence
                                                                    ?.termYears ||
                                                                '',
                                                            location:
                                                                caseData
                                                                    .sentence
                                                                    ?.location ||
                                                                '',
                                                            fineStatus: value,
                                                        },
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="bg-white text-black border-gray-300">
                                                    <SelectValue placeholder="Оберіть статус штрафу" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value="paid"
                                                        className="text-black"
                                                    >
                                                        Сплачено
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="pending"
                                                        className="text-black"
                                                    >
                                                        Очікує сплати
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-gray-500 text-white hover:bg-gray-600"
                        >
                            Скасувати
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gray-800 text-white hover:bg-gray-900"
                        >
                            Зберегти
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
