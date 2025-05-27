'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

export default function NewDefendantPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fio: '',
        birthDate: '',
        address: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/defendants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Помилка при створенні засудженого');
            }

            router.push('/defendants');
        } catch (error) {
            console.error('Помилка:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Новий засуджений</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="fio">ПІБ</Label>
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
                        />
                    </div>

                    <div>
                        <Label htmlFor="birthDate">Дата народження</Label>
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
                        />
                    </div>

                    <div>
                        <Label htmlFor="address">Адреса</Label>
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
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Скасувати
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Збереження...' : 'Зберегти'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
