'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';

type FormData = {
    number: string;
    description: string;
};

type FormErrors = {
    number?: string;
    description?: string;
};

export default function NewArticlePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<FormData>({
        number: '',
        description: '',
    });

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.number) newErrors.number = "Номер статті обов'язковий";
        if (!formData.description) newErrors.description = "Опис обов'язковий";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Помилка при створенні статті');
            }

            router.push('/articles');
        } catch (error) {
            console.error('Помилка:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Додати статтю</h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white p-6 rounded-lg shadow-md"
            >
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="number" className="text-gray-900">
                            Номер статті
                        </Label>
                        <Input
                            id="number"
                            value={formData.number}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    number: e.target.value,
                                })
                            }
                            className="bg-white text-gray-900"
                            required
                        />
                        {errors.number && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.number}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-gray-900">
                            Опис
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            className="bg-white text-gray-900"
                            required
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.description}
                            </p>
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
                        disabled={loading}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {loading ? 'Збереження...' : 'Зберегти'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
