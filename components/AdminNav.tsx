'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Container } from './Container';

export function AdminNav() {
    const pathname = usePathname();

    const links = [
        { href: '/admin/add-activity', label: 'Add Activity' },
        { href: '/admin/add-city', label: 'Add City' },
        { href: '/admin/add-coupon', label: 'Add Coupon' },
        { href: '/admin/add-blog', label: 'Add Blog' },
        { href: '/admin/analytics', label: 'Analytics' },
    ];

    return (
        <div className="border-b bg-muted/40">
            <Container>
                <div className="flex items-center h-16 gap-4">
                    <h2 className="font-bold text-lg mr-4">Admin Dashboard</h2>

                    <nav className="flex items-center gap-2">
                        {links.map((link) => (
                            <Button
                                key={link.href}
                                variant={pathname === link.href ? 'default' : 'ghost'}
                                size="sm"
                                asChild
                            >
                                <Link href={link.href}>{link.label}</Link>
                            </Button>
                        ))}
                    </nav>

                    <div className="ml-auto">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/">Back to Site</Link>
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    );
}
