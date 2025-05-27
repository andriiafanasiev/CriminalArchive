'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/app/components/ui/data-table';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/auth/auth-provider';
import { columns, Case } from './columns';
import { Input } from '@/app/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/app/components/ui/select';

export default function CasesPage() {
    const [cases, setCases] = useState<Case[]>([]);
    const [filteredCases, setFilteredCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sentenceTypeFilter, setSentenceTypeFilter] = useState<string>('all');
    const { user } = useAuth();
    const router = useRouter();

    const fetchCases = async () => {
        try {
            const response = await fetch('/api/cases');
            if (!response.ok) {
                throw new Error('Помилка при отриманні даних');
            }
            const data = await response.json();
            setCases(data);
            setFilteredCases(data);
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
        fetchCases();
    }, []);

    useEffect(() => {
        let filtered = [...cases];

        // Фільтрація за пошуковим запитом
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (case_) =>
                    case_.convictName.toLowerCase().includes(query) ||
                    case_.investigatorName.toLowerCase().includes(query) ||
                    case_.id.toString().includes(query)
            );
        }

        // Фільтрація за статусом
        if (statusFilter !== 'all') {
            filtered = filtered.filter(
                (case_) => case_.status === statusFilter
            );
        }

        // Фільтрація за типом вироку
        if (sentenceTypeFilter !== 'all') {
            filtered = filtered.filter(
                (case_) => case_.sentence?.type === sentenceTypeFilter
            );
        }

        setFilteredCases(filtered);
    }, [searchQuery, statusFilter, sentenceTypeFilter, cases]);

    const handleEdit = (row: Case) => {
        router.push(`/cases/${row.id}/edit`);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Ви впевнені, що хочете видалити цю справу?')) return;

        try {
            const response = await fetch(`/api/cases/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Помилка при видаленні справи');
            }

            await fetchCases();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Помилка при видаленні справи'
            );
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            const response = await fetch(`/api/cases/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Помилка при оновленні статусу справи');
            }

            await fetchCases();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Помилка при оновленні статусу справи'
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
                <h1 className="text-3xl font-bold text-white">Справи</h1>
                {user?.role === 'admin' && (
                    <Button
                        onClick={() => router.push('/cases/new')}
                        className="bg-black text-white hover:bg-gray-800 px-6"
                    >
                        Додати справу
                    </Button>
                )}
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Пошук за номером, засудженим або слідчим..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white text-black placeholder:text-gray-500"
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[200px] bg-white text-black">
                            <SelectValue placeholder="Фільтр за статусом" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" className="text-black">
                                Всі статуси
                            </SelectItem>
                            <SelectItem value="active" className="text-black">
                                Активні
                            </SelectItem>
                            <SelectItem value="closed" className="text-black">
                                Закриті
                            </SelectItem>
                            <SelectItem value="pending" className="text-black">
                                Очікують розгляду
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={sentenceTypeFilter}
                        onValueChange={setSentenceTypeFilter}
                    >
                        <SelectTrigger className="w-[200px] bg-white text-black">
                            <SelectValue placeholder="Фільтр за вироком" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" className="text-black">
                                Всі вироки
                            </SelectItem>
                            <SelectItem
                                value="imprisonment"
                                className="text-black"
                            >
                                Позбавлення волі
                            </SelectItem>
                            <SelectItem
                                value="conditional"
                                className="text-black"
                            >
                                Умовне
                            </SelectItem>
                            <SelectItem value="fine" className="text-black">
                                Штраф
                            </SelectItem>
                            <SelectItem
                                value="correctional"
                                className="text-black"
                            >
                                Виправні роботи
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DataTable
                    columns={columns}
                    data={filteredCases}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                />
            </div>
        </div>
    );
}
