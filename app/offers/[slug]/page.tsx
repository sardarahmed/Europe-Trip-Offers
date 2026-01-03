import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Star, Clock, MapPin, Check, ShieldCheck } from 'lucide-react';

// Mock Data
const ACTIVITY_DATA = {
    title: 'Louvre Museum Skip-the-Line Hosted Tour',
    city: 'Paris',
    price: 65,
    discountPrice: 55,
    rating: 4.8,
    reviewsCount: 1250,
    description: 'Explore the world’s largest art museum with a guide and skip-the-line access. See the Mona Lisa, Venus de Milo, and other masterpieces without the wait.',
    highlights: [
        'Skip-the-line access to the Louvre Museum',
        'Guided tour of masterpieces including Mona Lisa',
        'Small group tour for a personalized experience',
        'Audio headsets provided to hear the guide clearly'
    ],
    included: [
        'Entrance ticket',
        'Professional guide',
        'Headsets'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1565099824688-e93930dfa874?q=80&w=2070&auto=format&fit=crop',
};

export default function OfferPage({ params }: { params: { slug: string } }) {
    return (
        <div className="pb-20">
            <Container className="pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{ACTIVITY_DATA.title}</h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 text-yellow-500 font-bold">
                                <Star className="h-4 w-4 fill-current" /> {ACTIVITY_DATA.rating}
                            </span>
                            <span>({ACTIVITY_DATA.reviewsCount} reviews)</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" /> {ACTIVITY_DATA.city}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" /> 2.5 hours
                            </span>
                        </div>

                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted">
                            <div
                                className="h-full w-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${ACTIVITY_DATA.imageUrl})` }}
                            />
                        </div>

                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-xl font-bold mb-3">Overview</h3>
                            <p>{ACTIVITY_DATA.description}</p>

                            <h3 className="text-xl font-bold mt-8 mb-4">Highlights</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-none p-0">
                                {ACTIVITY_DATA.highlights.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="relative">
                        <div className="sticky top-24 p-6 rounded-xl border bg-card shadow-lg">
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">From</p>
                                    <p className="text-3xl font-bold text-primary">€{ACTIVITY_DATA.discountPrice}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground line-through">€{ACTIVITY_DATA.price}</p>
                                    <span className="text-xs font-bold text-green-600">Save €{ACTIVITY_DATA.price - ACTIVITY_DATA.discountPrice}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    <span>Free Cancellation up to 24h before</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Mobile Voucher Accepted</span>
                                </div>
                            </div>

                            <Button size="lg" className="w-full text-lg font-bold">
                                Check Availability
                            </Button>

                            <p className="text-xs text-center text-muted-foreground mt-4">
                                Powered by Viator. You will be redirected to securely complete your booking.
                            </p>
                        </div>
                    </div>

                </div>
            </Container>
        </div>
    );
}
