'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Container } from '@/components/Container';

export default function EditStore({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        logo_url: '',
        website_url: '',
        is_featured: false,
        rating: '4.5',
        custom_discount_text: '',
        used_deals_count: '0',
        popup_code: '',
        popup_link: '',
        offer_title: '',
        offer_expiry: ''
    });

    useEffect(() => {
        if (id) {
            fetchStore();
        }
    }, [id]);

    const fetchStore = async () => {
        try {
            const { data, error } = await supabase
                .from('stores')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setFormData({
                    name: data.name || '',
                    slug: data.slug || '',
                    description: data.description || '',
                    logo_url: data.logo_url || '',
                    website_url: data.website_url || '',
                    is_featured: data.is_featured || false,
                    rating: data.rating ? String(data.rating) : '4.5',
                    custom_discount_text: data.custom_discount_text || '',
                    used_deals_count: data.used_deals_count ? String(data.used_deals_count) : '0',
                    popup_code: data.popup_code || '',
                    popup_link: data.popup_link || '',
                    offer_title: data.offer_title || '',
                    offer_expiry: data.offer_expiry || ''
                });
            }
        } catch (error: any) {
            alert('Error fetching store: ' + error.message);
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from name if slug is empty
        if (name === 'name' && !formData.slug) {
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
                name: formData.name.trim(),
                slug: formData.slug.trim(),
                description: formData.description.trim(),
                logo_url: formData.logo_url.trim(),
                website_url: formData.website_url.trim(),
                custom_discount_text: formData.custom_discount_text?.trim() || null,
                used_deals_count: parseInt(formData.used_deals_count) || 0,
                popup_code: formData.popup_code?.trim() || null,
                popup_link: formData.popup_link?.trim() || null,
                offer_title: formData.offer_title?.trim() || null,
                offer_expiry: formData.offer_expiry?.trim() || null,
                rating: parseFloat(formData.rating)
            };

            const { error } = await supabase
                .from('stores')
                .update(payload)
                .eq('id', id);

            if (error) throw error;

            alert('Store updated successfully!');
            router.push('/admin/stores');
            router.refresh();
        } catch (error: any) {
            alert('Error updating store: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <Container className="py-10">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">Edit Store</h1>
                        <Button variant="outline" onClick={() => router.push('/admin/stores')}>Cancel</Button>
                    </div>

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
                                <label className="text-sm font-medium">Custom Discount Text (Optional)</label>
                                <Input
                                    name="custom_discount_text"
                                    placeholder="e.g. Upto 20% off"
                                    value={formData.custom_discount_text}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Used Deals Count</label>
                                <Input
                                    name="used_deals_count"
                                    type="number"
                                    placeholder="0"
                                    value={formData.used_deals_count}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Popup Coupon Code (Optional)</label>
                                <Input
                                    name="popup_code"
                                    placeholder="e.g. SAVE20"
                                    value={formData.popup_code}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Popup Action Link (Optional)</label>
                                <Input
                                    name="popup_link"
                                    placeholder="https://..."
                                    value={formData.popup_link}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Card Offer Title (Optional)</label>
                                <Input
                                    name="offer_title"
                                    placeholder="e.g. 15% Off on Flights & Hotels"
                                    value={formData.offer_title}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Card Offer Expiry (Optional)</label>
                                <Input
                                    name="offer_expiry"
                                    type="date"
                                    value={formData.offer_expiry}
                                    onChange={handleChange}
                                />
                            </div>
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
                            {loading ? 'Saving...' : 'Update Store'}
                        </Button>
                    </form>
                </div>
            </Container>
        </div>
    );
}
