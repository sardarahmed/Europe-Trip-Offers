import Link from 'next/link';
import { BlogPost } from '@/types';
import { Button } from './ui/button';
import { Calendar } from 'lucide-react';

interface BlogCardProps {
    post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <article className="flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-video w-full overflow-hidden">
                <div
                    className="h-full w-full bg-cover bg-center transition-transform hover:scale-105 duration-500"
                    style={{ backgroundImage: `url(${post.imageUrl})` }}
                />
            </div>
            <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{post.author}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                    </Link>
                </h3>
                <p className="text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                </p>
                <Button variant="link" className="p-0 h-auto self-start" asChild>
                    <Link href={`/blog/${post.slug}`}>Read more &rarr;</Link>
                </Button>
            </div>
        </article>
    );
}
