'use client';

import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SimpleItem {
    id: string;
    name: string;
}

export default function AddCityPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<SimpleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        country: '',
        description: '',
        image_url: '',
        category_id: '',
        featured: false
    });

    useEffect(() => {
        async function fetchCategories() {
            try {
                // Fetch Categories (only 'city' type)
                const { data } = await supabase.from('categories').select('id, name').eq('type', 'city').order('name');
                if (data) setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const generateSlug = (text: string) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            if (!formData.name || !formData.country) {
                throw new Error('Please fill in required fields (Name, Country).');
            }

            const slug = generateSlug(formData.name);

            // Check if slug exists
            const { data: existing } = await supabase.from('cities').select('id').eq('slug', slug).single();
            if (existing) {
                throw new Error('A city with this name already exists.');
            }

            const payload = {
                name: formData.name,
                slug: slug,
                country: formData.country,
                description: formData.description,
                image_url: formData.image_url,
                category_id: formData.category_id || null, // Optional
                featured: formData.featured,
                activity_count: 0
            };

            const { error } = await supabase.from('cities').insert([payload]);

            if (error) throw error;

            setMessage({ type: 'success', text: 'City added successfully! Redirecting...' });

            setTimeout(() => {
                router.push('/cities');
                router.refresh();
            }, 2000);

        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to add city.' });
            setSubmitting(false);
        }
    };

    if (loading) return <Container className="py-20">Loading form...</Container>;

    return (
        <Container className="py-12 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Add New City</h1>

            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">City Name *</label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Berlin"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Country *</label>
                        <Input
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="e.g. Germany"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Category (Optional)</label>
                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="">Select a Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Image URL (Unsplash)</label>
                    <Input
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        placeholder="https://images.unsplash.com/..."
                    />
                    {formData.image_url && (
                        <div className="mt-2 text-xs text-muted-foreground">
                            Preview: <img src={formData.image_url} alt="Preview" className="h-20 w-32 object-cover rounded mt-1 inline-block" />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Describe the city..."
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">mark as Featured City (Show on Homepage)</label>
                </div>

                <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                        {submitting ? 'Saving...' : 'Add City'}
                    </Button>
                </div>

            </form>
        </Container>
    );
}
