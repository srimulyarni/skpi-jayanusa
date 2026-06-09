export type User = {
    id: number;
    username: string;
    role: 'mahasiswa' | 'akademis' | 'ketua';
    avatar?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};
