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

export default function AddCouponPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<SimpleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        code: '',
        title: '',
        discount_amount: '',
        expiry_date: '',
        image_url: '',
        category_id: '',
        description: '',
        is_featured: true
    });

    useEffect(() => {
        async function fetchCategories() {
            try {
                // Fetch Categories (only 'coupon' type)
                const { data } = await supabase.from('categories').select('id, name').eq('type', 'coupon').order('name');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            if (!formData.code || !formData.title || !formData.discount_amount) {
                throw new Error('Please fill in required fields (Code, Title, Discount).');
            }

            const payload = {
                code: formData.code.toUpperCase(),
                title: formData.title,
                discount_amount: formData.discount_amount,
                expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : null,
                image_url: formData.image_url,
                category_id: formData.category_id || null,
                description: formData.description,
                is_featured: formData.is_featured,
            };

            const { error } = await supabase.from('coupons').insert([payload]);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Coupon added successfully! Redirecting...' });

            setTimeout(() => {
                router.push('/coupons');
                router.refresh();
            }, 2000);

        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to add coupon.' });
            setSubmitting(false);
        }
    };

    if (loading) return <Container className="py-20">Loading form...</Container>;

    return (
        <Container className="py-12 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Add New Coupon</h1>

            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Coupon Code *</label>
                        <Input
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="e.g. SUMMER25"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Discount Amount *</label>
                        <Input
                            name="discount_amount"
                            value={formData.discount_amount}
                            onChange={handleChange}
                            placeholder="e.g. 20% OFF or €50"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Title / Offer *</label>
                    <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. 20% OFF All Paris Tours"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Expiry Date</label>
                        <Input
                            type="date"
                            name="expiry_date"
                            value={formData.expiry_date}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
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
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Image URL (Unsplash)</label>
                    <Input
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        placeholder="https://images.unsplash.com/..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Terms and conditions or details..."
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_featured"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium">Mark as Featured (Show on Homepage)</label>
                </div>

                <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                        {submitting ? 'Saving...' : 'Add Coupon'}
                    </Button>
                </div>

            </form>
        </Container>
    );
}
