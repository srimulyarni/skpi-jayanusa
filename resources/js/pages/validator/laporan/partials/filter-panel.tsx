import { router } from '@inertiajs/react';
import { Calendar, Filter, Printer, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FilterValues = {
    dari?: string;
    sampai?: string;
    kode?: string;
    [key: string]: string | undefined;
};

type Preset = { label: string; dari: string; sampai: string };

function getPresets(): Preset[] {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDayOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const lastDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDayOfMonth.getDate()).padStart(2, '0')}`;

    const semester = month < 6 ? 1 : 2;
    const semStart = semester === 1 ? `${year}-01-01` : `${year}-07-01`;
    const semEnd = semester === 1 ? `${year}-06-30` : `${year}-12-31`;

    return [
        { label: 'Bulan Ini', dari: firstDayOfMonth, sampai: lastDayStr },
        { label: `Semester ${semester}`, dari: semStart, sampai: semEnd },
        { label: `Tahun ${year}`, dari: `${year}-01-01`, sampai: `${year}-12-31` },
    ];
}

export function LaporanFilterPanel({
    baseUrl,
    filters,
    pdfUrl,
    children,
}: {
    baseUrl: string;
    filters: FilterValues;
    pdfUrl?: string;
    children?: React.ReactNode;
}) {
    const [dari, setDari] = useState(filters.dari ?? '');
    const [sampai, setSampai] = useState(filters.sampai ?? '');
    const [kode, setKode] = useState(filters.kode ?? '');
    const [, setExtras] = useState<Record<string, string>>(() => {
        const rest = { ...filters };
        delete rest.dari;
        delete rest.sampai;
        delete rest.kode;

        return rest as Record<string, string>;
    });

    const presets = getPresets();

    function applyPreset(preset: Preset) {
        setDari(preset.dari);
        setSampai(preset.sampai);
    }

    function terapkan() {
        const params: Record<string, string | undefined> = {
            dari: dari || undefined,
            sampai: sampai || undefined,
            kode: kode || undefined,
            ...extras,
        };
        router.get(baseUrl, params, { preserveState: true, replace: true });
    }

    function reset() {
        setDari('');
        setSampai('');
        setKode('');
        setExtras({});
        router.get(baseUrl, {}, { preserveState: true, replace: true });
    }

    function handlePdf() {
        if (!pdfUrl) {
return;
}

        const params = new URLSearchParams();

        if (dari) {
params.set('dari', dari);
}

        if (sampai) {
params.set('sampai', sampai);
}

        if (kode) {
params.set('kode', kode);
}

        Object.entries(extras).forEach(([k, v]) => {
 if (v) {
params.set(k, v);
} 
});
        window.open(`${pdfUrl}?${params.toString()}`, '_blank');
    }

    const activeFilters: string[] = [];

    if (dari && sampai) {
activeFilters.push(`${dari} s/d ${sampai}`);
} else if (dari) {
activeFilters.push(`Dari ${dari}`);
} else if (sampai) {
activeFilters.push(`Sampai ${sampai}`);
}

    if (kode) {
activeFilters.push(`Kode: ${kode}`);
}

    return (
        <div className="space-y-3 rounded-md border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
                <Filter className="h-4 w-4" /> Filter
            </div>

            <div className="flex flex-wrap items-end gap-3">
                <div className="grid gap-1">
                    <Label className="text-xs">Dari</Label>
                    <Input type="date" value={dari} onChange={(e) => setDari(e.target.value)} className="w-40" />
                </div>
                <div className="grid gap-1">
                    <Label className="text-xs">Sampai</Label>
                    <Input type="date" value={sampai} onChange={(e) => setSampai(e.target.value)} className="w-40" />
                </div>

                <div className="grid gap-1">
                    <Label className="text-xs">Kode Periode</Label>
                    <Input type="number" value={kode} onChange={(e) => setKode(e.target.value)} placeholder="20261" className="w-32" />
                </div>

                {children}

                <div className="flex gap-2">
                    <Button onClick={terapkan} size="sm">
                        <Calendar className="mr-1 h-4 w-4" /> Terapkan
                    </Button>
                    <Button onClick={reset} variant="outline" size="sm">
                        <RotateCcw className="mr-1 h-4 w-4" /> Reset
                    </Button>
                    {pdfUrl && (
                        <Button onClick={handlePdf} variant="outline" size="sm">
                            <Printer className="mr-1 h-4 w-4" /> Cetak PDF
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-1">
                {presets.map((p) => (
                    <Button key={p.label} variant="ghost" size="sm" className="h-6 text-xs" onClick={() => applyPreset(p)}>
                        {p.label}
                    </Button>
                ))}
            </div>

            {activeFilters.length > 0 && (
                <p className="text-xs text-muted-foreground">
                    Filter aktif: {activeFilters.join(' · ')}
                </p>
            )}
        </div>
    );
}
