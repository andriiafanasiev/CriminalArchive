'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/app/components/ui/data-table';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/auth/auth-provider';
import { columns, Investigator } from './columns';
import { Input } from '@/app/components/ui/input';

export default function InvestigatorsPage() {
    const [investigators, setInvestigators] = useState<Investigator[]>([]);
    const [filteredInvestigators, setFilteredInvestigators] = useState<
        Investigator[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();
    const router = useRouter();

    const fetchInvestigators = async () => {
        try {
            const response = await fetch('/api/investigators');
            if (!response.ok) {
                throw new Error('Помилка при отриманні даних');
            }
            const data = await response.json();
            setInvestigators(data);
            setFilteredInvestigators(data);
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
        fetchInvestigators();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const filtered = investigators.filter(
                (investigator) =>
                    investigator.fio.toLowerCase().includes(query) ||
                    investigator.position.toLowerCase().includes(query) ||
                    investigator.id.toString().includes(query)
            );
            setFilteredInvestigators(filtered);
        } else {
            setFilteredInvestigators(investigators);
        }
    }, [searchQuery, investigators]);

    const handleEdit = (row: Investigator) => {
        router.push(`/investigators/${row.id}/edit`);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Ви впевнені, що хочете видалити цього слідчого?')) return;

        try {
            const response = await fetch(`/api/investigators/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Помилка при видаленні слідчого');
            }

            await fetchInvestigators();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Помилка при видаленні слідчого'
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
                <h1 className="text-3xl font-bold text-white">Слідчі</h1>
                {user?.role === 'admin' && (
                    <Button
                        onClick={() => router.push('/investigators/new')}
                        className="bg-black text-white hover:bg-gray-800 px-6"
                    >
                        Додати слідчого
                    </Button>
                )}
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-4">
                    <Input
                        placeholder="Пошук за ПІБ, посадою або ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white text-black placeholder:text-gray-500"
                    />
                </div>
                <DataTable
                    columns={columns}
                    data={filteredInvestigators}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
