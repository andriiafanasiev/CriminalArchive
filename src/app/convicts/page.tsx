'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/app/components/ui/data-table';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';

type Convict = {
    id: number;
    fio: string;
    birthDate: string;
    address: string;
    contact: string | null;
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
        accessorKey: 'birthDate',
        header: 'Дата народження',
        cell: ({ row }: { row: any }) => {
            const date = row.getValue('birthDate');
            return date ? new Date(date).toLocaleDateString() : '-';
        },
    },
    {
        accessorKey: 'address',
        header: 'Адреса',
    },
    {
        accessorKey: 'contact',
        header: 'Контакт',
    },
];

export default function ConvictsPage() {
    const [convicts, setConvicts] = useState<Convict[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchConvicts = async () => {
            try {
                const response = await fetch('/api/convicts');
                if (!response.ok) {
                    throw new Error('Помилка при завантаженні засуджених');
                }
                const data = await response.json();
                setConvicts(data);
            } catch (error) {
                console.error('Помилка:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConvicts();
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
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Засуджені</h1>
                <Button
                    onClick={() => router.push('/convicts/new')}
                    className="bg-black text-white hover:bg-gray-800 px-6"
                >
                    Додати засудженого
                </Button>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <DataTable columns={columns} data={convicts} />
            </div>
        </div>
    );
}
