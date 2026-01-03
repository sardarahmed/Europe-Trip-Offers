import { Container } from '@/components/Container';
import { BlogCard } from '@/components/BlogCard';
import { BlogPost } from '@/types';

const BLOG_POSTS: BlogPost[] = [
    {
        id: '1',
        title: 'Top 10 Things to Do in Paris This Summer',
        slug: 'top-10-things-in-paris',
        excerpt: 'Discover the hidden gems and iconic landmarks that make Paris the ultimate summer destination. From Seine cruises to rooftop bars.',
        imageUrl: 'https://images.unsplash.com/photo-1499856871940-a09e328237e8?q=80&w=2070&auto=format&fit=crop',
        publishedAt: '2025-06-15',
        author: 'Sophie Martin',
    },
    {
        id: '2',
        title: 'A Weekend Guide to Rome: Eat, Pray, Love',
        slug: 'weekend-guide-rome',
        excerpt: 'The perfect itinerary for 48 hours in the Eternal City. Where to find the best pasta, the quietest piazzas, and skip-the-line tips.',
        imageUrl: 'https://images.unsplash.com/photo-1529260830199-42c42dda5f3d?q=80&w=2071&auto=format&fit=crop',
        publishedAt: '2025-05-20',
        author: 'Marco Rossi',
    },
    {
        id: '3',
        title: 'Why You Must Visit Amsterdam in Spring',
        slug: 'amsterdam-spring-travel',
        excerpt: 'Tulips, King’s Day, and canal walks. Find out why April and May are the best months to explore the Netherlands.',
        imageUrl: 'https://images.unsplash.com/photo-1468530986413-2c93495ed813?q=80&w=2070&auto=format&fit=crop',
        publishedAt: '2025-04-10',
        author: 'Anna DeVries',
    },
    {
        id: '4',
        title: 'Budget Travel Tips for Barcelona',
        slug: 'budget-barcelona',
        excerpt: 'How to enjoy Gaudí’s architecture, delicious tapas, and beach vibes without breaking the bank.',
        imageUrl: 'https://images.unsplash.com/photo-1579282240050-352db0a11c58?q=80&w=1536&auto=format&fit=crop',
        publishedAt: '2025-07-01',
        author: 'Carlos Gomez',
    },
];

export default function BlogPage() {
    return (
        <div className="py-12 md:py-20">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Travel Inspiration & Guides</h1>
                    <p className="text-muted-foreground text-lg">
                        Expert tips, itineraries, and localized guides to help you plan the perfect European getaway.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            </Container>
        </div>
    );
}
