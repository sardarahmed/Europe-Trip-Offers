'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminNav } from '@/components/AdminNav';
import { Container } from '@/components/Container';

export default function AddStore() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        logo_url: '',
        website_url: '',
        is_featured: false,
        rating: '4.5'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from name
        if (name === 'name') {
            const generatedSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, is_featured: e.target.checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                rating: parseFloat(formData.rating)
            };

            const { error } = await supabase
                .from('stores')
                .insert([payload]);

            if (error) throw error;

            alert('Store added successfully!');
            router.push('/stores');
            router.refresh();
        } catch (error: any) {
            alert('Error adding store: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Container className="py-10">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                    <h1 className="text-2xl font-bold mb-6">Add New Store / Brand</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Store Name</label>
                                <Input
                                    name="name"
                                    placeholder="e.g. Airbnb"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Slug (URL)</label>
                                <Input
                                    name="slug"
                                    placeholder="e.g. airbnb"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                name="description"
                                placeholder="Brief description of the store..."
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Logo URL</label>
                            <Input
                                name="logo_url"
                                placeholder="https://..."
                                value={formData.logo_url}
                                onChange={handleChange}
                            />
                            {formData.logo_url && (
                                <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                                    Preview:
                                    <img src={formData.logo_url} alt="Preview" className="h-8 object-contain" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Website URL (Affiliate Link)</label>
                            <Input
                                name="website_url"
                                placeholder="https://..."
                                value={formData.website_url}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Rating (0-5)</label>
                                <Input
                                    name="rating"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    value={formData.rating}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-8">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleCheckboxChange}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="is_featured" className="text-sm font-medium">Feature on Homepage?</label>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Store'}
                        </Button>
                    </form>
                </div>
            </Container>
        </div>
    );
}
