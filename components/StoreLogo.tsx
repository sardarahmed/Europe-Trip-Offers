'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils'; // Optional if you want to allow className passing

interface StoreLogoProps {
    src: string;
    alt: string;
    className?: string; // Correct typing
}

export function StoreLogo({ src, alt, className }: StoreLogoProps) {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-xs ${className}`}>
                {alt.slice(0, 2).toUpperCase()}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
        />
    );
}
