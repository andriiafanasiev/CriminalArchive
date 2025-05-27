import { ColumnDef } from '@tanstack/react-table';

export type Investigator = {
    id: number;
    fio: string;
    position: string;
};

export const columns: ColumnDef<Investigator>[] = [
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
