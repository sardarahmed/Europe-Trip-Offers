'use client';

import { Container } from './Container';
import { SearchBox } from './SearchBox';

import Image from 'next/image';

interface HeroSectionProps {
    title: string;
    subtitle: string;
    backgroundImage: string;
}

export function HeroSection({ title, subtitle, backgroundImage }: HeroSectionProps) {
    return (
        <section className="relative">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 h-full w-full">
                <Image
                    src={backgroundImage}
                    alt="Hero Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay for readability */}
            </div>

            <div className="relative z-10 py-16 md:py-24 flex items-center justify-center">
                <Container>
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
                            {title}
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-sm">
                            {subtitle}
                        </p>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-white/90">
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                                ✅ Verified Coupons
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                                ⚡ Instant Booking
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                                💰 Best Price Guarantee
                            </span>
                        </div>

                        <div className="pt-4">
                            <SearchBox />
                        </div>
                    </div>
                </Container>
            </div>
        </section>
    );
}
