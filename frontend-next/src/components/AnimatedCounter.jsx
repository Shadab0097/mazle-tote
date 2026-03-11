'use client';

import { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ value, prefix = '', suffix = '', decimals = 2, duration = 2000 }) {
    const [displayValue, setDisplayValue] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && entry.intersectionRatio > 0 && !hasAnimated) {
                    setHasAnimated(true);
                    // Animate the count
                    const startTime = performance.now();
                    const animate = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic for smooth deceleration
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setDisplayValue(eased * value);
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.2 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [value, duration, hasAnimated]);

    return (
        <span ref={ref}>
            {prefix}{displayValue.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
        </span>
    );
}
