import { ColumnDef } from '@tanstack/react-table';

export type Defendant = {
    id: number;
    fio: string;
    birthDate: string;
    address: string;
    contact: string | null;
};

export const columns: ColumnDef<Defendant>[] = [
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
