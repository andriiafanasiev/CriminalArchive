'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface Convict {
    id: number;
    fio: string;
    birthDate: string;
    address: string;
    contact: string | null;
}

export default function EditConvictPage({
    params,
}: {
    params: { id: string };
}) {
    const [convict, setConvict] = useState<Convict | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchConvict = async () => {
            try {
                const response = await fetch(`/api/convicts/${params.id}`);
                if (!response.ok) {
                    throw new Error('Помилка при отриманні даних');
                }
                const data = await response.json();
                setConvict(data);
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

        fetchConvict();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!convict) return;

        try {
            const response = await fetch(`/api/convicts/${params.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(convict),
            });

            if (!response.ok) {
                throw new Error('Помилка при оновленні даних');
            }

            router.push('/convicts');
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
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white">Завантаження...</span>
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

    if (!convict) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                Засудженого не знайдено
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">
                    Редагування засудженого
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-lg shadow-lg p-6 space-y-4 text-black"
                >
                    <div className="space-y-2">
                        <Label htmlFor="fio" className="text-black">
                            ПІБ
                        </Label>
                        <Input
                            id="fio"
                            value={convict.fio}
                            onChange={(e) =>
                                setConvict({ ...convict, fio: e.target.value })
                            }
                            required
                            className="bg-white text-black border-gray-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="birthDate" className="text-black">
                            Дата народження
                        </Label>
                        <Input
                            id="birthDate"
                            type="date"
                            value={convict.birthDate.split('T')[0]}
                            onChange={(e) =>
                                setConvict({
                                    ...convict,
                                    birthDate: e.target.value,
                                })
                            }
                            required
                            className="bg-white text-black border-gray-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-black">
                            Адреса
                        </Label>
                        <Input
                            id="address"
                            value={convict.address}
                            onChange={(e) =>
                                setConvict({
                                    ...convict,
                                    address: e.target.value,
                                })
                            }
                            required
                            className="bg-white text-black border-gray-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact" className="text-black">
                            Контакт
                        </Label>
                        <Input
                            id="contact"
                            value={convict.contact || ''}
                            onChange={(e) =>
                                setConvict({
                                    ...convict,
                                    contact: e.target.value,
                                })
                            }
                            className="bg-white text-black border-gray-300"
                        />
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
