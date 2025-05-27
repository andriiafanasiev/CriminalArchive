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

const investigatorPositions = [
    'Старший слідчий',
    'Слідчий',
    'Начальник слідства',
];

type FormData = {
    fio: string;
    position: string;
};

type FormErrors = {
    fio?: string;
    position?: string;
};

export default function NewInvestigatorPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        fio: '',
        position: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        setMounted(true);
    }, []);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.fio.trim()) {
            newErrors.fio = "ПІБ обов'язковий";
        }
        if (!formData.position) {
            newErrors.position = "Посада обов'язкова";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/investigators', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Помилка при створенні слідчого');
            }

            router.push('/investigators');
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Помилка при створенні слідчого'
            );
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">
                    Додати слідчого
                </h1>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="fio"
                                className="text-sm font-medium text-gray-900"
                            >
                                ПІБ
                            </Label>
                            <Input
                                id="fio"
                                value={formData.fio}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        fio: e.target.value,
                                    })
                                }
                                placeholder="Введіть ПІБ слідчого"
                                className="w-full text-gray-900 bg-white"
                            />
                            {errors.fio && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.fio}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="position"
                                className="text-sm font-medium text-gray-900"
                            >
                                Посада
                            </Label>
                            <Select
                                value={formData.position}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        position: value,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full text-gray-900">
                                    <SelectValue placeholder="Виберіть посаду" />
                                </SelectTrigger>
                                <SelectContent>
                                    {investigatorPositions.map((position) => (
                                        <SelectItem
                                            key={position}
                                            value={position}
                                            className="text-gray-900"
                                        >
                                            {position}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.position && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.position}
                                </p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={loading}
                            className="px-6"
                        >
                            Скасувати
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white hover:bg-blue-700 px-6"
                        >
                            {loading ? 'Збереження...' : 'Зберегти'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
