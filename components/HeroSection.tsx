'use client';

import { Container } from './Container';
import { SearchBox } from './SearchBox';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Default / Fallback content
const DEFAULT_HERO = {
    title: 'Discover the Best Europe Travel Deals',
    subtitle: 'Explore top-rated tours, exclusive coupons, and hidden gems across Europe. Powered by Viator.',
    backgroundImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop'
};

export function HeroSection() {
    const [heroContent, setHeroContent] = useState(DEFAULT_HERO);

    useEffect(() => {
        async function fetchHero() {
            try {
                const { data, error } = await supabase
                    .from('hero_content')
                    .select('title, subtitle, background_image_url')
                    .eq('page_slug', 'home')
                    .single();

                if (data && !error) {
                    setHeroContent({
                        title: data.title,
                        subtitle: data.subtitle || '',
                        backgroundImage: data.background_image_url || DEFAULT_HERO.backgroundImage
                    });
                }
            } catch (err) {
                console.error('Error fetching hero content:', err);
            }
        }
        fetchHero();
    }, []);

    return (
        <section className="relative">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroContent.backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay for readability */}
            </div>

            <div className="relative z-10 py-32 md:py-48 flex items-center justify-center">
                <Container>
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
                            {heroContent.title.split('Europe').map((part, i, arr) => (
                                <span key={i}>
                                    {part}
                                    {i !== arr.length - 1 && <span className="text-secondary">Europe</span>}
                                </span>
                            ))}
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-sm">
                            {heroContent.subtitle}
                        </p>

                        <div className="pt-4">
                            <SearchBox />
                        </div>
                    </div>
                </Container>
            </div>
        </section>
    );
}
