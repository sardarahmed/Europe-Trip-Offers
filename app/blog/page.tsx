import { Container } from '@/components/Container';
import { BlogCard } from '@/components/BlogCard';
import { BlogPost } from '@/types';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

export default async function BlogPage() {
    // Fetch posts from Supabase
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });

    const blogPosts: BlogPost[] = (posts || []).map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        imageUrl: post.image_url,
        publishedAt: post.published_at,
        author: post.author || 'Admin',
    }));

    return (
        <div className="py-12 md:py-20">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Travel Inspiration & Guides</h1>
                    <p className="text-muted-foreground text-lg">
                        Expert tips, itineraries, and localized guides to help you plan the perfect European getaway.
                    </p>
                </div>

                {blogPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/30 rounded-xl">
                        <p className="text-muted-foreground">No blog posts found. Check back soon!</p>
                    </div>
                )}
            </Container>
        </div>
    );
}
