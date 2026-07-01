import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PaginationLink = { url: string | null; label: string; active: boolean };

type PaginatedData = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
};

type Props = {
    data: PaginatedData;
};

export function DataTablePagination({ data }: Props) {
    if (data.last_page <= 1) {
return null;
}

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Menampilkan {(data.current_page - 1) * data.per_page + 1}–{Math.min(data.current_page * data.per_page, data.total)} dari {data.total} data
            </div>
            <div className="flex gap-1">
                {data.links.map((link, index) => {
                    if (link.label === '&laquo; Previous') {
                        return (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true, replace: true })}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        );
                    }

                    if (link.label === 'Next &raquo;') {
                        return (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true, replace: true })}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        );
                    }

                    return (
                        <Button
                            key={index}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true, replace: true })}
                        >
                            {link.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
