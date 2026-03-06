'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Store } from '@/types';
import { Copy, ExternalLink, Check, X } from 'lucide-react';
import { Button } from './ui/button';

interface StorePopupProps {
    store: Store;
}

export function StorePopup({ store }: StorePopupProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const showPopup = searchParams.get('showPopup') === 'true';
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (showPopup) {
            // Slight delay for better UX after navigation
            const timer = setTimeout(() => setIsOpen(true), 300);
            return () => clearTimeout(timer);
        }
    }, [showPopup]);

    const handleClose = () => {
        setIsOpen(false);
        // Clean up URL without triggering a full page reload if possible
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
    };

    const handleCopy = () => {
        if (store.popupCode) {
            navigator.clipboard.writeText(store.popupCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isOpen) return null;

    const actionLink = store.popupLink || store.websiteUrl;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Header Pattern / Color Blur */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-50 -z-0"></div>

                <div className="p-8 pt-12 flex flex-col items-center text-center relative z-10">
                    <div className="h-20 w-20 bg-white rounded-xl shadow-md border border-slate-100 flex items-center justify-center p-2 mb-6 transform -rotate-3 hover:rotate-0 transition-transform">
                        <img src={store.logoUrl} alt={store.name} className="max-h-full max-w-full object-contain" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Exclusive {store.name} Offer</h3>
                    <p className="text-slate-600 mb-8 px-4">
                        {store.customDiscountText || `Get the best available deals at ${store.name} today.`}
                    </p>

                    {store.popupCode && (
                        <div className="w-full mb-6">
                            <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">Copy Code</p>
                            <div className="flex items-center w-full border-2 border-dashed border-slate-300 rounded-xl p-1 bg-slate-50">
                                <div className="flex-1 font-mono text-xl font-bold text-slate-900 px-4">
                                    {store.popupCode}
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={handleCopy}
                                    className={`${copied ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                                >
                                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {actionLink ? (
                        <Button asChild size="lg" className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg mb-4">
                            <a href={actionLink} target="_blank" rel="noopener noreferrer" onClick={handleClose}>
                                Visit {store.name} <ExternalLink className="ml-2 h-5 w-5" />
                            </a>
                        </Button>
                    ) : (
                        <div className="w-full h-14 flex items-center justify-center text-sm text-slate-500 italic bg-amber-50 rounded-lg">
                            No Website Link Available
                        </div>
                    )}

                    <p className="text-xs text-slate-400 mt-2">
                        {store.usedDealsCount ? `${store.usedDealsCount.toLocaleString()} deals used recently` : 'Verified Deals'}
                    </p>
                </div>
            </div>
        </div>
    );
}
