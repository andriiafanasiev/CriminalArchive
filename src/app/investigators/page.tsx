'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/app/components/ui/data-table';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/auth/auth-provider';

type Investigator = {
    id: number;
    fio: string;
    position: string;
};

const columns = [
    {
        accessorKey: 'id',
        header: 'Номер',
    },
    {
        accessorKey: 'fio',
        header: 'ПІБ',
    },
    {
        accessorKey: 'position',
        header: 'Посада',
    },
];

export default function InvestigatorsPage() {
    const [investigators, setInvestigators] = useState<Investigator[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchInvestigators = async () => {
            try {
                const response = await fetch('/api/investigators');
                if (!response.ok) {
                    throw new Error('Помилка при завантаженні слідчих');
                }
                const data = await response.json();
                setInvestigators(data);
            } catch (error) {
                console.error('Помилка:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvestigators();
    }, []);

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

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Слідчі</h1>
                {user?.role === 'admin' && (
                    <Button
                        onClick={() => router.push('/investigators/new')}
                        className="bg-black text-white hover:bg-gray-800"
                    >
                        Додати слідчого
                    </Button>
                )}
            </div>
            <DataTable columns={columns} data={investigators} />
        </div>
    );
}
