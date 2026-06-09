import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey?: string;
    searchPlaceholder?: string;
};

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    searchPlaceholder = 'Cari...',
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: { sorting, columnFilters },
        initialState: { pagination: { pageSize: 15 } },
    });

    return (
        <div className="space-y-4">
            {searchKey && (
                <Input
                    placeholder={searchPlaceholder}
                    value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
                    onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
                    className="max-w-sm"
                />
            )}

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} data
                </p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Sebelumnya
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Berikutnya
                    </Button>
                </div>
            </div>
        </div>
    );
}
