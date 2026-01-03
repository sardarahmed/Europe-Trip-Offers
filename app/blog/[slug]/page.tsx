import { Container } from '@/components/Container';
import { supabase } from '@/lib/supabase';
import { Calendar, User } from 'lucide-react';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// Fix for Next.js 15: params should be treated as a Promise or carefully handled if async
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !post) {
        notFound();
    }

    return (
        <article className="pb-20">
            {/* Hero Image */}
            <div className="h-[400px] w-full relative">
                <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50" />
                <Container className="relative h-full flex flex-col justify-end pb-12 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-4xl">{post.title}</h1>
                    <div className="flex items-center gap-6 text-sm font-medium">
                        <span className="flex items-center gap-2">
                            <User className="h-4 w-4" /> {post.author || 'Admin'}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> {new Date(post.published_at).toLocaleDateString()}
                        </span>
                    </div>
                </Container>
            </div>

            {/* Content */}
            <Container className="mt-12 max-w-3xl">
                <div className="mb-6 text-xl text-muted-foreground font-medium italic border-l-4 pl-4 border-primary">
                    {post.excerpt}
                </div>
                <div
                    className="prose dark:prose-invert max-w-none text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </Container>
        </article>
    );
}
