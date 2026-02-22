'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { getProfile, getAdminProfile } from '@/store/authSlice';

export default function AuthChecker() {
    const dispatch = useDispatch();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            if (pathname.startsWith('/admin')) {
                const adminAction = await dispatch(getAdminProfile());
                if (getAdminProfile.rejected.match(adminAction)) {
                    await dispatch(getProfile());
                }
            } else {
                await dispatch(getProfile());
            }
        };
        checkAuth();
    }, [dispatch, pathname]);

    return null;
}
