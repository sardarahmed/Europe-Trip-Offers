'use client';

import { Container } from './Container';
import { SearchBox } from './SearchBox';

interface HeroSectionProps {
    title: string;
    subtitle: string;
    backgroundImage: string;
}

export function HeroSection({ title, subtitle, backgroundImage }: HeroSectionProps) {
    return (
        <section className="relative">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay for readability */}
            </div>

            <div className="relative z-10 py-32 md:py-48 flex items-center justify-center">
                <Container>
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
                            {title.split('Europe').map((part, i, arr) => (
                                <span key={i}>
                                    {part}
                                    {i !== arr.length - 1 && <span className="text-secondary">Europe</span>}
                                </span>
                            ))}
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-sm">
                            {subtitle}
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
