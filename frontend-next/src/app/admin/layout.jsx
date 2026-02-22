'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminGroupLayout({ children }) {
    const { isAdmin } = useSelector((state) => state.auth);
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Give auth time to hydrate from cookies
        const timer = setTimeout(() => {
            setChecking(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!checking && !isAdmin) {
            router.push('/admin-login');
        }
    }, [checking, isAdmin, router]);

    if (checking || !isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <AdminLayout>{children}</AdminLayout>;
}
