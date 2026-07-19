import AuthLayoutTemplate from '@/layouts/auth/auth-card-layout';
import type { ReactNode } from 'react';

export default function AuthLayout({
    title = '',
    description = '',
    brandingContent,
    brandingPosition = 'right',
    footer,
    children,
}: {
    title?: string;
    description?: string;
    brandingContent?: ReactNode;
    brandingPosition?: 'left' | 'right';
    footer?: ReactNode;
    children: React.ReactNode;
}) {
    return (
        <AuthLayoutTemplate
            title={title}
            description={description}
            brandingContent={brandingContent}
            brandingPosition={brandingPosition}
            footer={footer}
        >
            {children}
        </AuthLayoutTemplate>
    );
}
