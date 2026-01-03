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

export default function AddActivityPage() {
    const router = useRouter();
    const [cities, setCities] = useState<SimpleItem[]>([]);
    const [categories, setCategories] = useState<SimpleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        city_id: '',
        category_id: '',
        price: '',
        discount_price: '',
        image_url: '',
        affiliate_link: '',
        description: '',
        duration: '2 hours',
        highlights: '' // newline separated
    });

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch Cities
                const { data: citiesData } = await supabase.from('cities').select('id, name').order('name');
                if (citiesData) setCities(citiesData);

                // Fetch Categories (only 'activity' type)
                const { data: categoriesData } = await supabase.from('categories').select('id, name').eq('type', 'activity').order('name');
                if (categoriesData) setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generateSlug = (text: string) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            if (!formData.title || !formData.city_id || !formData.category_id) {
                throw new Error('Please fill in all required fields (Title, City, Category).');
            }

            const slug = generateSlug(formData.title);

            // Check if slug exists
            const { data: existing } = await supabase.from('activities').select('id').eq('slug', slug).single();
            if (existing) {
                throw new Error('An activity with this title already exists. Please modify the title.');
            }

            const payload = {
                title: formData.title,
                slug: slug,
                city_id: formData.city_id,
                category_id: formData.category_id,
                price: parseFloat(formData.price) || 0,
                discount_price: parseFloat(formData.discount_price) || 0,
                image_url: formData.image_url,
                affiliate_link: formData.affiliate_link,
                description: formData.description,
                duration: formData.duration,
                highlights: formData.highlights.split('\n').filter(line => line.trim() !== ''),
                is_featured: true // Default to featured for visibility, user can change later
            };

            const { error } = await supabase.from('activities').insert([payload]);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Activity added successfully! Redirecting...' });

            // Reset form or redirect
            setTimeout(() => {
                router.push('/offers');
                router.refresh();
            }, 2000);

        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to add activity.' });
            setSubmitting(false);
        }
    };

    if (loading) return <Container className="py-20">Loading form data...</Container>;

    return (
        <Container className="py-12 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Add New Activity</h1>

            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* 1. Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">City *</label>
                        <select
                            name="city_id"
                            value={formData.city_id}
                            onChange={handleChange}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            required
                        >
                            <option value="">Select a City</option>
                            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Category *</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            required
                        >
                            <option value="">Select a Category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Activity Title *</label>
                    <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Eiffel Tower Skip-the-Line Ticket"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Regular Price (€)</label>
                        <Input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="100.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Discount Price (€)</label>
                        <Input
                            type="number"
                            name="discount_price"
                            value={formData.discount_price}
                            onChange={handleChange}
                            placeholder="80.00"
                        />
                    </div>
                </div>

                {/* 2. Media & Links */}
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
                    <label className="block text-sm font-medium mb-2">Affiliate Link (Viator)</label>
                    <Input
                        name="affiliate_link"
                        value={formData.affiliate_link}
                        onChange={handleChange}
                        placeholder="https://www.viator.com/..."
                    />
                </div>

                {/* 3. Details */}
                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Describe the activity..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Highlights (One per line)</label>
                    <textarea
                        name="highlights"
                        value={formData.highlights}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Skip the line
Free audio guide
Panoramic views"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <Input
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="e.g. 3 hours"
                    />
                </div>

                <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                        {submitting ? 'Saving...' : 'Create Activity'}
                    </Button>
                </div>

            </form>
        </Container>
    );
}
