'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/app/components/ui/data-table';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/auth/auth-provider';
import { columns, Defendant } from './columns';

export default function DefendantsPage() {
    const [defendants, setDefendants] = useState<Defendant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const router = useRouter();

    const fetchDefendants = async () => {
        try {
            const response = await fetch('/api/convicts');
            if (!response.ok) {
                throw new Error('Помилка при отриманні даних');
            }
            const data = await response.json();
            setDefendants(data);
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

    useEffect(() => {
        fetchDefendants();
    }, []);

    const handleEdit = (row: Defendant) => {
        router.push(`/convicts/${row.id}/edit`);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Ви впевнені, що хочете видалити цього засудженого?'))
            return;

        try {
            const response = await fetch(`/api/convicts/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Помилка при видаленні засудженого');
            }

            await fetchDefendants();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Помилка при видаленні засудженого'
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

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Засуджені</h1>
                {user?.role === 'admin' && (
                    <Button
                        onClick={() => router.push('/convicts/new')}
                        className="bg-black text-white hover:bg-gray-800 px-6"
                    >
                        Додати засудженого
                    </Button>
                )}
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <DataTable
                    columns={columns}
                    data={defendants}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
