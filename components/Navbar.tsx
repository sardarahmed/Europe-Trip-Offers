'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, MapPin, Tag, Percent, BookOpen, Mail } from 'lucide-react';
import { Container } from './Container';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Coupons', href: '/coupons', icon: Tag },
    { name: 'Deals', href: '/offers', icon: Percent },
    { name: 'Cities', href: '/cities', icon: MapPin },
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'Contact', href: '/contact', icon: Mail },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [ctaSettings, setCtaSettings] = useState({ text: 'Get 20% OFF', link: '/coupons' });

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data, error } = await supabase
                    .from('navbar_settings')
                    .select('cta_text, cta_link')
                    .limit(1)
                    .single();

                if (data && !error) {
                    setCtaSettings({ text: data.cta_text, link: data.cta_link });
                }
            } catch (err) {
                console.error('Failed to fetch navbar settings:', err);
            }
        }
        fetchSettings();
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <Container className="flex h-20 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Europe Trip Offers
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 items-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-base font-bold transition-colors hover:text-primary uppercase tracking-wide"
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Button size="sm" variant="default" asChild>
                        <Link href={ctaSettings.link}>
                            {ctaSettings.text}
                        </Link>
                    </Button>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </Container>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-b bg-background"
                    >
                        <Container className="py-4 space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-2 text-sm font-medium py-2 hover:text-primary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    {item.name}
                                </Link>
                            ))}
                            <Button className="w-full" size="sm" asChild>
                                <Link href={ctaSettings.link} onClick={() => setIsOpen(false)}>
                                    {ctaSettings.text}
                                </Link>
                            </Button>
                        </Container>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
