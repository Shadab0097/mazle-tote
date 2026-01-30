import React from 'react';
import { cn } from '@/lib/utils';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50";

    const variants = {
        primary: "bg-[var(--color-primary)] text-white hover:bg-[#7aa8d0] shadow-sm",
        secondary: "border border-[var(--color-border)] bg-white hover:bg-[var(--color-bg-secondary)] text-[var(--color-text)]",
        ghost: "hover:bg-[var(--color-bg-secondary)] text-[var(--color-text)]",
        link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
    };

    const sizes = {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10",
    };

    return (
        <button
            ref={ref}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        />
    );
});

Button.displayName = "Button";
