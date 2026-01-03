import { Container } from '@/components/Container';
import { BlogPost } from '@/types'; // You might need to expand types if full content isn't there
import { Calendar, User } from 'lucide-react';

const MOCK_POST = {
    title: 'Top 10 Things to Do in Paris This Summer',
    imageUrl: 'https://images.unsplash.com/photo-1499856871940-a09e328237e8?q=80&w=2070&auto=format&fit=crop',
    author: 'Sophie Martin',
    publishedAt: '2025-06-15',
    content: `
    <p class="mb-4">Paris is always a good idea, but summer brings a special energy to the city. From picnics along the Seine to open-air cinema, here is your ultimate guide.</p>
    <h2 class="text-2xl font-bold mt-8 mb-4">1. Visit the Louvre at Night</h2>
    <p class="mb-4">Avoid the crowds by visiting on a Friday evening. The pyramid lights up beautifully.</p>
    <h2 class="text-2xl font-bold mt-8 mb-4">2. Picnic at Canal Saint-Martin</h2>
    <p class="mb-4">Join the locals for wine and cheese along the water.</p>
    <p class="mt-8 text-muted-foreground"><em>(Sample blog content...)</em></p>
  `
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    return (
        <article className="pb-20">
            <div className="h-[400px] w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${MOCK_POST.imageUrl})` }}>
                <div className="absolute inset-0 bg-black/50" />
                <Container className="relative h-full flex flex-col justify-end pb-12 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-4xl">{MOCK_POST.title}</h1>
                    <div className="flex items-center gap-6 text-sm font-medium">
                        <span className="flex items-center gap-2">
                            <User className="h-4 w-4" /> {MOCK_POST.author}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> {new Date(MOCK_POST.publishedAt).toLocaleDateString()}
                        </span>
                    </div>
                </Container>
            </div>

            <Container className="mt-12 max-w-3xl">
                <div
                    className="prose dark:prose-invert max-w-none text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: MOCK_POST.content }}
                />
            </Container>
        </article>
    );
}
