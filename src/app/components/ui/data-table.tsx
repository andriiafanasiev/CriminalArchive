'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';

import { Button } from '@/app/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/app/components/auth/auth-provider';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onEdit?: (row: TData) => void;
    onDelete?: (id: number) => void;
    onStatusChange?: (id: number, newStatus: string) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onEdit,
    onDelete,
    onStatusChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: 'id',
            desc: false,
        },
    ]);
    const { user } = useAuth();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    });

    return (
        <div>
            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="bg-gray-50"
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="font-semibold"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                                {user?.role === 'admin' &&
                                    (onEdit || onDelete || onStatusChange) && (
                                        <TableHead className="text-right">
                                            Дії
                                        </TableHead>
                                    )}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                    className="hover:bg-gray-50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                    {user?.role === 'admin' &&
                                        (onEdit ||
                                            onDelete ||
                                            onStatusChange) && (
                                            <TableCell className="text-right space-x-2">
                                                {onEdit && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            onEdit(row.original)
                                                        }
                                                        className="hover:bg-gray-100"
                                                    >
                                                        <Pencil className="h-4 w-4 text-gray-800" />
                                                    </Button>
                                                )}
                                                {onDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            onDelete(
                                                                (
                                                                    row.original as any
                                                                ).id
                                                            )
                                                        }
                                                        className="hover:bg-gray-100"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-gray-800" />
                                                    </Button>
                                                )}
                                                {onStatusChange &&
                                                    (row.original as any)
                                                        .status ===
                                                        'active' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                onStatusChange(
                                                                    (
                                                                        row.original as any
                                                                    ).id,
                                                                    'closed'
                                                                )
                                                            }
                                                            className="hover:bg-gray-100"
                                                        >
                                                            <CheckCircle className="h-4 w-4 text-gray-800" />
                                                        </Button>
                                                    )}
                                            </TableCell>
                                        )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        columns.length +
                                        (user?.role === 'admin' ? 1 : 0)
                                    }
                                    className="h-24 text-center"
                                >
                                    Немає даних
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {table.getPageCount() > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="bg-gray-800 text-white hover:bg-gray-900"
                    >
                        Попередня
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="bg-gray-800 text-white hover:bg-gray-900"
                    >
                        Наступна
                    </Button>
                </div>
            )}
        </div>
    );
}
