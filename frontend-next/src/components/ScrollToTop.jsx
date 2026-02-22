'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ScrollToTop = () => {
    const pathname = usePathname();

    useEffect(() => {
        const scrollToTop = () => {
            try {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth',
                });
            } catch (error) {
                window.scrollTo(0, 0);
            }
        };

        scrollToTop();

        const t = setTimeout(scrollToTop, 100);
        return () => clearTimeout(t);

    }, [pathname]);

    return null;
};

export default ScrollToTop;
