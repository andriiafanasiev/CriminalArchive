'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/app/components/ui/data-table';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/auth/auth-provider';

type Article = {
    id: number;
    number: string;
    description: string;
};

const columns = [
    {
        accessorKey: 'id',
        header: 'Номер',
    },
    {
        accessorKey: 'number',
        header: 'Номер статті',
    },
    {
        accessorKey: 'description',
        header: 'Опис',
        cell: ({ row }: any) => {
            const description = row.getValue('description');
            return description.length > 100
                ? `${description.substring(0, 100)}...`
                : description;
        },
    },
];

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('/api/articles');
                if (!response.ok) {
                    throw new Error('Помилка при завантаженні статей');
                }
                const data = await response.json();
                setArticles(data);
            } catch (error) {
                console.error('Помилка:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
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
                <h1 className="text-2xl font-bold">Статті</h1>
                {user?.role === 'admin' && (
                    <Button
                        onClick={() => router.push('/articles/new')}
                        className="bg-black text-white hover:bg-gray-800"
                    >
                        Додати статтю
                    </Button>
                )}
            </div>
            <DataTable columns={columns} data={articles} />
        </div>
    );
}
