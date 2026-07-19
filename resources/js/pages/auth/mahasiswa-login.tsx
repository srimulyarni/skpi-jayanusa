import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { GraduationCap, Lock, LoaderCircle } from 'lucide-react';
import { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PageProps = {
    recaptchaSiteKey: string;
    recaptchaEnabled: boolean;
};

export default function MahasiswaLogin({ status }: { status?: string }) {
    const { recaptchaSiteKey, recaptchaEnabled } = usePage<{ props: PageProps }>().props as unknown as PageProps;
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const { data, setData, post, processing, errors } = useForm({
        nobp: '',
        password: '',
        remember: false,
        'g-recaptcha-response': '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/mahasiswa/login', {
            preserveScroll: true,
            onFinish: () => {
                recaptchaRef.current?.reset();
            },
        });
    }

    return (
        <>
            <Head title="Login Mahasiswa" />

            {status && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nobp">NOBP</Label>
                        <div className="relative">
                            <GraduationCap className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                id="nobp"
                                type="text"
                                required
                                autoFocus
                                autoComplete="username"
                                placeholder="Masukkan NOBP"
                                className="pl-10"
                                value={data.nobp}
                                onChange={(e) => setData('nobp', e.target.value)}
                                disabled={processing}
                            />
                        </div>
                        <InputError message={errors.nobp} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="text-muted-foreground absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
                            <PasswordInput
                                id="password"
                                required
                                autoComplete="current-password"
                                placeholder="Masukkan password"
                                className="pl-10"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', !!checked)}
                        />
                        <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">
                            Ingat saya
                        </Label>
                    </div>
                </div>

                {recaptchaEnabled && (
                    <>
                        <div className="flex justify-center">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={recaptchaSiteKey}
                                onChange={(token) => setData('g-recaptcha-response', token || '')}
                            />
                        </div>
                        <InputError message={errors['g-recaptcha-response']} />
                    </>
                )}

                <Button type="submit" className="w-full" disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    {processing ? 'Masuk...' : 'Masuk'}
                </Button>
            </form>
        </>
    );
}

MahasiswaLogin.layout = {
    title: 'Login Mahasiswa',
    description: 'Masukkan NOBP dan password untuk masuk',
    brandingContent: true,
    brandingPosition: 'left' as const,
    footer: (
        <Link href="/login" className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors">
            Staff? Sign in here
        </Link>
    ),
};
