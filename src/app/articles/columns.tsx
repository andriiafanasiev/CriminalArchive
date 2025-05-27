import { ColumnDef } from '@tanstack/react-table';

export type Article = {
    id: number;
    number: string;
    description: string;
};

export const columns: ColumnDef<Article>[] = [
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
    },
];
