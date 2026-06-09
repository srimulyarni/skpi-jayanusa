import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function MahasiswaLogin({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        nobp: '',
        password: '',
        remember: false,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/mahasiswa/login', { preserveScroll: true });
    }

    return (
        <>
            <Head title="Login Mahasiswa" />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="nobp">NOBP</Label>
                        <Input
                            id="nobp"
                            type="text"
                            name="nobp"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="username"
                            placeholder="Masukkan NOBP"
                            value={data.nobp}
                            onChange={(e) => setData('nobp', e.target.value)}
                        />
                        <InputError message={errors.nobp} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <PasswordInput
                            id="password"
                            name="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            tabIndex={3}
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', !!checked)}
                        />
                        <Label htmlFor="remember">Ingat saya</Label>
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing && <Spinner />}
                        Masuk
                    </Button>
                </div>
            </form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

MahasiswaLogin.layout = {
    title: 'Login Mahasiswa',
    description: 'Masukkan NOBP dan password untuk masuk',
};
