'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

type FormData = {
    fio: string;
    birthDate: string;
    address: string;
    contact: string;
};

type FormErrors = {
    [key: string]: string;
};

export default function NewConvictPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        fio: '',
        birthDate: '',
        address: '',
        contact: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.fio.trim()) {
            newErrors.fio = "ПІБ обов'язковий";
        }
        if (!formData.birthDate) {
            newErrors.birthDate = "Дата народження обов'язкова";
        }
        if (!formData.address.trim()) {
            newErrors.address = "Адреса обов'язкова";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/convicts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Помилка при створенні засудженого');
            }

            router.push('/convicts');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Сталася помилка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-3xl font-bold text-white mb-8">
                Додати нового засудженого
            </h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white p-6 rounded-lg shadow-lg"
            >
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="fio" className="text-black">
                            ПІБ
                        </Label>
                        <Input
                            id="fio"
                            type="text"
                            value={formData.fio}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    fio: e.target.value,
                                })
                            }
                            required
                            className="mt-1 bg-white text-black"
                        />
                        {errors.fio && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.fio}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="birthDate" className="text-black">
                            Дата народження
                        </Label>
                        <Input
                            id="birthDate"
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    birthDate: e.target.value,
                                })
                            }
                            required
                            className="mt-1 bg-white text-black"
                        />
                        {errors.birthDate && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.birthDate}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="address" className="text-black">
                            Адреса
                        </Label>
                        <Input
                            id="address"
                            type="text"
                            value={formData.address}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    address: e.target.value,
                                })
                            }
                            required
                            className="mt-1 bg-white text-black"
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.address}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="contact" className="text-black">
                            Контакт
                        </Label>
                        <Input
                            id="contact"
                            type="text"
                            value={formData.contact}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    contact: e.target.value,
                                })
                            }
                            className="mt-1 bg-white text-black"
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-100 text-black hover:bg-gray-200"
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
