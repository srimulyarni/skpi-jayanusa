import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type PaginatedData = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    data: PaginatedData;
};

const PER_PAGE_OPTIONS = [10, 25, 50];

function getPageNumbers(current: number, last: number): (number | '...')[] {
    if (last <= 7) {
        return Array.from({ length: last }, (_, i) => i + 1);
    }

    const pages: (number | '...')[] = [1];

    if (current > 3) {
        pages.push('...');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < last - 2) {
        pages.push('...');
    }

    pages.push(last);

    return pages;
}

export function DataTablePagination({ data }: Props) {
    const from = data.total === 0 ? 0 : (data.current_page - 1) * data.per_page + 1;
    const to = Math.min(data.current_page * data.per_page, data.total);
    const pages = getPageNumbers(data.current_page, data.last_page);

    function goToPage(page: number) {
        const url = new URL(window.location.href);
        url.searchParams.set('page', String(page));
        url.searchParams.set('per_page', String(data.per_page));
        router.get(url.pathname + url.search, {}, { preserveState: true, preserveScroll: true, replace: true });
    }

    function changePerPage(value: string) {
        const url = new URL(window.location.href);
        url.searchParams.set('per_page', value);
        url.searchParams.set('page', '1');
        router.get(url.pathname + url.search, {}, { preserveState: true, preserveScroll: true, replace: true });
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>
                    {from}–{to} dari {data.total}
                </span>
                <div className="flex items-center gap-1.5">
                    <span className="text-xs">Per halaman</span>
                    <Select value={String(data.per_page)} onValueChange={changePerPage}>
                        <SelectTrigger className="h-8 w-[70px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {PER_PAGE_OPTIONS.map((n) => (
                                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={data.current_page <= 1}
                    onClick={() => goToPage(1)}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={data.current_page <= 1}
                    onClick={() => goToPage(data.current_page - 1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {pages.map((page, i) =>
                    page === '...' ? (
                        <span key={`ellipsis-${i}`} className="px-1.5 text-sm text-muted-foreground">...</span>
                    ) : (
                        <Button
                            key={page}
                            variant={page === data.current_page ? 'default' : 'outline'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => goToPage(page)}
                        >
                            {page}
                        </Button>
                    ),
                )}

                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={data.current_page >= data.last_page}
                    onClick={() => goToPage(data.current_page + 1)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={data.current_page >= data.last_page}
                    onClick={() => goToPage(data.last_page)}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
