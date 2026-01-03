'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Container } from '@/components/Container';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AddBlogPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image_url: '',
        author: 'Admin',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Generate Slug
            const slug = formData.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');

            // 2. Check for duplicate slug
            const { data: existing } = await supabase
                .from('posts')
                .select('id')
                .eq('slug', slug)
                .single();

            if (existing) {
                throw new Error('A post with this title already exists. Please choose a different title.');
            }

            // 3. Insert into Supabase
            const { error: insertError } = await supabase.from('posts').insert([
                {
                    title: formData.title,
                    slug: slug,
                    excerpt: formData.excerpt,
                    content: formData.content, // Storing HTML or Markdown
                    image_url: formData.image_url,
                    author: formData.author,
                    published_at: new Date().toISOString(),
                },
            ]);

            if (insertError) throw insertError;

            // 4. Redirect
            router.push('/blog');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <Container>
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <Link href="/admin/add-activity" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
                            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold">Write a New Blog Post</h1>
                        <p className="text-muted-foreground">Share travel tips and guides.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Post Title</label>
                            <Input
                                name="title"
                                placeholder="e.g., Hidden Gems of Lisbon"
                                required
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Excerpt (Short Summary)</label>
                            <textarea
                                name="excerpt"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Brief description for the card view..."
                                required
                                value={formData.excerpt}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Content (HTML Supported)</label>
                            <textarea
                                name="content"
                                className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                placeholder="<p>Write your amazing travel guide here...</p>"
                                required
                                value={formData.content}
                                onChange={handleChange}
                            />
                            <p className="text-xs text-muted-foreground">Tip: You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cover Image URL</label>
                            <Input
                                name="image_url"
                                placeholder="https://images.unsplash.com/..."
                                required
                                value={formData.image_url}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Author Name</label>
                            <Input
                                name="author"
                                placeholder="e.g., Sarah Jenkins"
                                value={formData.author}
                                onChange={handleChange}
                            />
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
                                </>
                            ) : (
                                'Publish Post'
                            )}
                        </Button>
                    </form>
                </div>
            </Container>

            {/* Quick Helper for finding Unsplash Images */}
            <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                    Need images? <a href="https://unsplash.com/s/photos/travel" target="_blank" className="underline hover:text-primary">Search Unsplash</a>
                </p>
            </div>
        </div>
    );
}
