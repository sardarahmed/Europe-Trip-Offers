
import { Container } from './Container';
import { Star, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface Review {
    id: string;
    name: string;
    location: string;
    avatar: string;
    rating: number;
    text: string;
    verified: boolean;
}

const reviews: Review[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        location: 'London, UK',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        rating: 5,
        text: "I saved over €200 on my family trip to Rome using these coupons. The 'Skip-the-line' Colosseum tickets worked perfectly!",
        verified: true
    },
    {
        id: '2',
        name: 'Marc Dubois',
        location: 'Paris, France',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        rating: 5,
        text: "Honestly specialized deals for Europe travel are hard to find. This site aggregates the best ones. Highly recommend checking before booking.",
        verified: true
    },
    {
        id: '3',
        name: 'Elena Rodriguez',
        location: 'Madrid, Spain',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        rating: 4,
        text: "Great selection of tours. I wish there were more food tour options, but the museum deals are fantastic. Will use again.",
        verified: true
    }
];

export function ReviewsSection() {
    return (
        <section className="py-20 bg-white">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Loved by Travelers</h2>
                    <p className="text-lg text-slate-600">
                        Join thousands of smart travelers saving on their European adventures.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col h-full">
                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-200 text-slate-200'}`}
                                    />
                                ))}
                            </div>

                            {/* Text */}
                            <p className="text-slate-700 italic mb-6 flex-1">"{review.text}"</p>

                            {/* Author */}
                            <div className="flex items-center gap-4 mt-auto">
                                <div className="h-12 w-12 rounded-full overflow-hidden relative">
                                    <Image
                                        src={review.avatar}
                                        alt={review.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-900">{review.name}</h4>
                                        {review.verified && (
                                            <CheckCircle className="h-3 w-3 text-blue-500" />
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{review.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-100">
                        <CheckCircle className="h-4 w-4" />
                        Rated 4.8/5 based on 10,000+ reviews
                    </div>
                </div>
            </Container>
        </section>
    );
}
