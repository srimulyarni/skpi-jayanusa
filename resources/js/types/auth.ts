export type User = {
    id: number;
    username: string;
    role: 'mahasiswa' | 'validator' | 'ketua';
    avatar?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
    isProfileLengkap: boolean;
    kompreStatus: boolean;
    periodeAktif: boolean;
};
