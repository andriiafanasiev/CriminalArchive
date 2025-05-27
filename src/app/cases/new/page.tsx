'use client';

import { useState, useEffect } from 'react';
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

type Defendant = {
    id: number;
    fio: string;
};

type Investigator = {
    id: number;
    fio: string;
};

type FormErrors = {
    defendantId?: string;
    investigatorId?: string;
    status?: string;
    sentence?: {
        type?: string;
        startDate?: string;
        endDate?: string;
        termYears?: string;
        location?: string;
        fineStatus?: string;
    };
};

const initialFormData = {
    defendantId: '',
    investigatorId: '',
    status: 'active',
    sentence: {
        type: '',
        startDate: '',
        endDate: '',
        termYears: '',
        location: '',
        fineStatus: '',
    },
};

export default function NewCasePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [defendants, setDefendants] = useState<Defendant[]>([]);
    const [investigators, setInvestigators] = useState<Investigator[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [defendantsRes, investigatorsRes] = await Promise.all([
                    fetch('/api/convicts'),
                    fetch('/api/investigators'),
                ]);

                const [defendantsData, investigatorsData] = await Promise.all([
                    defendantsRes.json(),
                    investigatorsRes.json(),
                ]);

                if (defendantsData.error || investigatorsData.error) {
                    throw new Error(
                        defendantsData.error || investigatorsData.error
                    );
                }

                setDefendants(defendantsData);
                setInvestigators(investigatorsData);
            } catch (error) {
                console.error('Помилка:', error);
                alert(
                    error instanceof Error
                        ? error.message
                        : 'Помилка при завантаженні даних'
                );
            }
        };

        fetchData();
    }, []);

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!formData.defendantId) {
            newErrors.defendantId = 'Оберіть засудженого';
        }

        if (!formData.investigatorId) {
            newErrors.investigatorId = 'Оберіть слідчого';
        }

        // Перевіряємо поля вироку тільки якщо є хоча б одне заповнене поле
        const hasAnySentenceField = Object.values(formData.sentence).some(
            (value) => value !== ''
        );
        if (hasAnySentenceField) {
            if (!formData.sentence.type) {
                newErrors.sentence = {
                    ...newErrors.sentence,
                    type: 'Оберіть тип покарання',
                };
            } else {
                // Валідація в залежності від типу покарання
                switch (formData.sentence.type) {
                    case 'imprisonment':
                        if (!formData.sentence.startDate) {
                            newErrors.sentence = {
                                ...newErrors.sentence,
                                startDate: 'Вкажіть дату початку',
                            };
                        }
                        if (!formData.sentence.termYears) {
                            newErrors.sentence = {
                                ...newErrors.sentence,
                                termYears: 'Вкажіть термін у роках',
                            };
                        }
                        if (!formData.sentence.location) {
                            newErrors.sentence = {
                                ...newErrors.sentence,
                                location: 'Вкажіть місце покарання',
                            };
                        }
                        break;
                    case 'correctional':
                        if (!formData.sentence.startDate) {
                            newErrors.sentence = {
                                ...newErrors.sentence,
                                startDate: 'Вкажіть дату початку',
                            };
                        }
                        if (!formData.sentence.termYears) {
                            newErrors.sentence = {
                                ...newErrors.sentence,
                                termYears: 'Вкажіть термін у роках',
                            };
                        }
                        break;
                    case 'conditional':
                        if (!formData.sentence.startDate) {
                            newErrors.sentence = {
                                ...newErrors.sentence,
                                startDate: 'Вкажіть дату початку',
                            };
                        }
                        if (!formData.sentence.termYears) {
                            newErrors.sentence = {
                                ...newErrors.sentence,
                                termYears: 'Вкажіть термін випробування',
                            };
                        }
                        break;
                    case 'fine':
                        if (!formData.sentence.termYears) {
                            newErrors.sentence = {
                                ...newErrors.sentence,
                                termYears: 'Вкажіть суму штрафу',
                            };
                        }
                        if (!formData.sentence.fineStatus) {
                            newErrors.sentence = {
                                ...newErrors.sentence,
                                fineStatus: 'Оберіть статус штрафу',
                            };
                        }
                        break;
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/cases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || 'Помилка при створенні справи'
                );
            }

            router.push('/cases');
        } catch (error) {
            console.error('Помилка:', error);
            alert(
                error instanceof Error
                    ? error.message
                    : 'Помилка при створенні справи'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Нова справа</h1>
            {loading ? (
                <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-white rounded-lg shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <p className="text-white">Завантаження...</p>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-white p-6 rounded-lg shadow-md"
                >
                    <div className="space-y-4">
                        <div>
                            <Label
                                htmlFor="defendantId"
                                className="text-gray-900"
                            >
                                Засуджений
                            </Label>
                            <Select
                                value={formData.defendantId}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        defendantId: value,
                                    })
                                }
                            >
                                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                                    <SelectValue placeholder="Виберіть засудженого" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {defendants.map((defendant) => (
                                        <SelectItem
                                            key={defendant.id}
                                            value={defendant.id.toString()}
                                            className="text-gray-900"
                                        >
                                            {defendant.fio}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.defendantId && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.defendantId}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label
                                htmlFor="investigatorId"
                                className="text-gray-900"
                            >
                                Слідчий
                            </Label>
                            <Select
                                value={formData.investigatorId}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        investigatorId: value,
                                    })
                                }
                            >
                                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                                    <SelectValue placeholder="Виберіть слідчого" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {investigators.map((investigator) => (
                                        <SelectItem
                                            key={investigator.id}
                                            value={investigator.id.toString()}
                                            className="text-gray-900"
                                        >
                                            {investigator.fio}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.investigatorId && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.investigatorId}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="status" className="text-gray-900">
                                Статус
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, status: value })
                                }
                            >
                                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                                    <SelectValue placeholder="Виберіть статус" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem
                                        value="active"
                                        className="text-gray-900"
                                    >
                                        Активна
                                    </SelectItem>
                                    <SelectItem
                                        value="closed"
                                        className="text-gray-900"
                                    >
                                        Закрита
                                    </SelectItem>
                                    <SelectItem
                                        value="pending"
                                        className="text-gray-900"
                                    >
                                        Очікує розгляду
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div className="border-t pt-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900">
                                Вирок (необов&apos;язково)
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <Label
                                        htmlFor="sentenceType"
                                        className="text-gray-900"
                                    >
                                        Тип покарання
                                    </Label>
                                    <Select
                                        value={formData.sentence.type}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                sentence: {
                                                    ...formData.sentence,
                                                    type: value,
                                                },
                                            })
                                        }
                                    >
                                        <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                                            <SelectValue placeholder="Виберіть тип покарання" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem
                                                value="imprisonment"
                                                className="text-gray-900"
                                            >
                                                Позбавлення волі
                                            </SelectItem>
                                            <SelectItem
                                                value="correctional"
                                                className="text-gray-900"
                                            >
                                                Виправні роботи
                                            </SelectItem>
                                            <SelectItem
                                                value="conditional"
                                                className="text-gray-900"
                                            >
                                                Умовне
                                            </SelectItem>
                                            <SelectItem
                                                value="fine"
                                                className="text-gray-900"
                                            >
                                                Штраф
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.sentence?.type && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.sentence.type}
                                        </p>
                                    )}
                                </div>

                                {formData.sentence.type && (
                                    <>
                                        <div>
                                            <Label
                                                htmlFor="startDate"
                                                className="text-gray-900"
                                            >
                                                {formData.sentence.type ===
                                                'fine'
                                                    ? 'Дата вироку'
                                                    : 'Дата початку'}
                                            </Label>
                                            <Input
                                                id="startDate"
                                                type="date"
                                                value={
                                                    formData.sentence.startDate
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        sentence: {
                                                            ...formData.sentence,
                                                            startDate:
                                                                e.target.value,
                                                        },
                                                    })
                                                }
                                                className="bg-white text-gray-900"
                                            />
                                            {errors.sentence?.startDate && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.sentence.startDate}
                                                </p>
                                            )}
                                        </div>

                                        {formData.sentence.type !== 'fine' && (
                                            <div>
                                                <Label
                                                    htmlFor="endDate"
                                                    className="text-gray-900"
                                                >
                                                    Дата закінчення
                                                </Label>
                                                <Input
                                                    id="endDate"
                                                    type="date"
                                                    value={
                                                        formData.sentence
                                                            .endDate
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            sentence: {
                                                                ...formData.sentence,
                                                                endDate:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }
                                                    className="bg-white text-gray-900"
                                                />
                                                {errors.sentence?.endDate && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors.sentence
                                                                .endDate
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <div>
                                            <Label
                                                htmlFor="termYears"
                                                className="text-gray-900"
                                            >
                                                {formData.sentence.type ===
                                                'fine'
                                                    ? 'Сума штрафу'
                                                    : 'Термін (роки)'}
                                            </Label>
                                            <Input
                                                id="termYears"
                                                type="number"
                                                value={
                                                    formData.sentence.termYears
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        sentence: {
                                                            ...formData.sentence,
                                                            termYears:
                                                                e.target.value,
                                                        },
                                                    })
                                                }
                                                className="bg-white text-gray-900"
                                            />
                                            {errors.sentence?.termYears && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.sentence.termYears}
                                                </p>
                                            )}
                                        </div>

                                        {formData.sentence.type !== 'fine' && (
                                            <div>
                                                <Label
                                                    htmlFor="location"
                                                    className="text-gray-900"
                                                >
                                                    Місце покарання
                                                </Label>
                                                <Input
                                                    id="location"
                                                    type="text"
                                                    value={
                                                        formData.sentence
                                                            .location
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            sentence: {
                                                                ...formData.sentence,
                                                                location:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }
                                                    className="bg-white text-gray-900"
                                                />
                                                {errors.sentence?.location && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors.sentence
                                                                .location
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {formData.sentence.type === 'fine' && (
                                            <div>
                                                <Label
                                                    htmlFor="fineStatus"
                                                    className="text-gray-900"
                                                >
                                                    Статус штрафу
                                                </Label>
                                                <Select
                                                    value={
                                                        formData.sentence
                                                            .fineStatus
                                                    }
                                                    onValueChange={(value) =>
                                                        setFormData({
                                                            ...formData,
                                                            sentence: {
                                                                ...formData.sentence,
                                                                fineStatus:
                                                                    value,
                                                            },
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                                                        <SelectValue placeholder="Оберіть статус штрафу" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectItem
                                                            value="paid"
                                                            className="text-gray-900"
                                                        >
                                                            Сплачено
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="unpaid"
                                                            className="text-gray-900"
                                                        >
                                                            Не сплачено
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.sentence
                                                    ?.fineStatus && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors.sentence
                                                                .fineStatus
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-black text-white hover:bg-blue-700"
                        >
                            Скасувати
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {loading ? 'Збереження...' : 'Зберегти'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
