import { ColumnDef } from '@tanstack/react-table';

export type Convict = {
    id: number;
    fio: string;
    birthDate: string;
    address: string;
    contact: string | null;
};

export const columns: ColumnDef<Convict>[] = [
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
        cell: ({ row }) => {
            const date = row.getValue('birthDate') as string;
            return date ? new Date(date).toLocaleDateString('uk-UA') : '-';
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
