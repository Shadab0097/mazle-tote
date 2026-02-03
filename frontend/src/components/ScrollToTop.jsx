import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // "Optimization on the fly" - using slightly delayed scroll to ensure render logic is done
        // and using smooth behavior as requested.
        const scrollToTop = () => {
            try {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth',
                });
            } catch (error) {
                // Fallback for older browsers
                window.scrollTo(0, 0);
            }
        };

        // Immediate scroll
        scrollToTop();

        // Ensure it happens even if rendering lags slightly
        const t = setTimeout(scrollToTop, 100);
        return () => clearTimeout(t);

    }, [pathname]);

    return null;
};

export default ScrollToTop;
