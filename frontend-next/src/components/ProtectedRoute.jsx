'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function ProtectedRoute({ children }) {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setChecking(false), 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!checking && !isAuthenticated) {
            router.push('/login');
        }
    }, [checking, isAuthenticated, router]);

    if (checking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return isAuthenticated ? children : null;
}

export function AdminRoute({ children }) {
    const { isAdmin } = useSelector((state) => state.auth);
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setChecking(false), 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!checking && !isAdmin) {
            router.push('/admin-login');
        }
    }, [checking, isAdmin, router]);

    if (checking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return isAdmin ? children : null;
}

export function GuestRoute({ children }) {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setChecking(false), 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!checking && isAuthenticated) {
            router.push('/');
        }
    }, [checking, isAuthenticated, router]);

    if (checking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return !isAuthenticated ? children : null;
}
