'use client';

import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils'; // Implemented in previous step

import { useRouter } from 'next/navigation';

export function SearchBox({ className }: { className?: string }) {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/offers?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className={cn("relative max-w-2xl w-full", className)}>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Where do you want to go?"
                    className="w-full pl-12 pr-32 py-4 rounded-full border border-border bg-background shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button
                    type="submit"
                    size="lg"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-8"
                >
                    Search
                </Button>
            </div>
        </form>
    );
}
