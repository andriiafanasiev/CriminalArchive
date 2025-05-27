'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/app/components/ui/data-table';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/auth/auth-provider';
import { columns, Convict } from './columns';
import { Input } from '@/app/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/app/components/ui/select';

export default function ConvictsPage() {
    const [convicts, setConvicts] = useState<Convict[]>([]);
    const [filteredConvicts, setFilteredConvicts] = useState<Convict[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [ageFilter, setAgeFilter] = useState<string>('all');
    const { user } = useAuth();
    const router = useRouter();

    const fetchConvicts = async () => {
        try {
            const response = await fetch('/api/convicts');
            if (!response.ok) {
                throw new Error('Помилка при отриманні даних');
            }
            const data = await response.json();
            setConvicts(data);
            setFilteredConvicts(data);
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
        fetchConvicts();
    }, []);

    useEffect(() => {
        let filtered = convicts;

        // Пошук
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (convict) =>
                    convict.fio.toLowerCase().includes(query) ||
                    convict.address.toLowerCase().includes(query) ||
                    convict.contact?.toLowerCase().includes(query) ||
                    convict.id.toString().includes(query)
            );
        }

        // Фільтр за віком
        if (ageFilter !== 'all') {
            const today = new Date();
            filtered = filtered.filter((convict) => {
                const birthDate = new Date(convict.birthDate);
                const age = today.getFullYear() - birthDate.getFullYear();

                switch (ageFilter) {
                    case 'under18':
                        return age < 18;
                    case '18to30':
                        return age >= 18 && age <= 30;
                    case '31to50':
                        return age > 30 && age <= 50;
                    case 'over50':
                        return age > 50;
                    default:
                        return true;
                }
            });
        }

        console.log('Filtered convicts:', filtered);
        setFilteredConvicts(filtered);
    }, [searchQuery, ageFilter, convicts]);

    const handleEdit = (row: Convict) => {
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

            await fetchConvicts();
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
                <div className="flex gap-4 mb-4">
                    <Input
                        placeholder="Пошук за ПІБ, адресою, контактом або ID..."
                        value={searchQuery}
                        onChange={(e) => {
                            console.log(
                                'Search query changed:',
                                e.target.value
                            );
                            setSearchQuery(e.target.value);
                        }}
                        className="bg-white text-black placeholder:text-gray-500"
                    />
                    <Select
                        value={ageFilter}
                        onValueChange={(value) => {
                            console.log('Age filter changed:', value);
                            setAgeFilter(value);
                        }}
                    >
                        <SelectTrigger className="w-[200px] bg-white text-black">
                            <SelectValue placeholder="Вік" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Всі віки</SelectItem>
                            <SelectItem value="under18">До 18 років</SelectItem>
                            <SelectItem value="18to30">18-30 років</SelectItem>
                            <SelectItem value="31to50">31-50 років</SelectItem>
                            <SelectItem value="over50">
                                Понад 50 років
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DataTable
                    columns={columns}
                    data={filteredConvicts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
