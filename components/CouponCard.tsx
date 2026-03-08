'use client';

import { Coupon } from '@/types';
import { Button } from './ui/button';
import { Copy, ExternalLink, CheckCircle, Users, Percent, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import Image from 'next/image';

interface CouponCardProps {
    coupon: Coupon;
}

export function CouponCard({ coupon }: CouponCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleReveal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsModalOpen(true);
        handleCopy(coupon.code);
    };

    // Helper for "Verified" text
    const getVerifiedText = (dateStr?: string) => {
        if (!dateStr) return 'Verified recently';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 24) return 'Verified today';
        return `Verified ${Math.floor(diffHours / 24)} days ago`;
    };

    return (
        <>
            <Link href={`/coupons/${coupon.id}`} className="group block relative overflow-hidden rounded-xl bg-white text-slate-900 border shadow-sm hover:shadow-xl transition-all flex flex-col sm:flex-row min-h-[160px]">
                {/* Left Side: Logo & Discount Area */}
                <div className="relative flex flex-col items-center justify-center p-6 bg-slate-50/50 border-b sm:border-b-0 sm:border-r border-slate-100 sm:w-1/3 shrink-0">
                    {coupon.store && coupon.store.logoUrl ? (
                        <div className="h-28 w-28 rounded-full border border-slate-200 bg-white flex items-center justify-center p-4 shadow-sm overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
                            <img src={coupon.store.logoUrl} alt={coupon.store.name} className="object-contain w-full h-full" />
                        </div>
                    ) : (
                        <div className="h-28 w-28 rounded-full border border-slate-200 bg-white flex items-center justify-center p-4 shadow-sm text-sm font-bold text-slate-400 mb-4">
                            Logo
                        </div>
                    )}
                    
                    {/* Discount Amount Badge */}
                    <div className="inline-flex items-center justify-center rounded-lg bg-red-50 text-red-600 px-4 py-1.5 text-lg font-extrabold border border-red-100 shadow-sm mt-auto text-center w-full">
                        {coupon.discountAmount}
                    </div>
                </div>

                {/* Right Side: Content Area */}
                <div className="flex-1 p-6 flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex-1">
                            {coupon.store && (
                                <div className="text-sm font-semibold text-blue-600 mb-1 tracking-wide uppercase">
                                    {coupon.store.name}
                                </div>
                            )}
                            <h3 className={`font-bold leading-tight group-hover:text-primary transition-colors ${
                                coupon.title.length > 60 ? 'text-lg' : 
                                coupon.title.length > 40 ? 'text-xl' : 
                                'text-2xl'
                            }`}>
                                {coupon.title}
                            </h3>
                        </div>
                        
                        {/* Trust Signal */}
                        <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                             <div className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200 shadow-sm">
                                <CheckCircle className="h-3.5 w-3.5" />
                                {getVerifiedText(coupon.lastVerified)}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6 lg:mb-8">
                        <div className="flex items-center gap-2">
                            <div className="bg-slate-100 p-1.5 rounded-full"><Users className="h-3.5 w-3.5 text-slate-500" /></div>
                            <span className="font-medium text-slate-700">{coupon.usedCount?.toLocaleString() || '100+'} used</span>
                        </div>
                        <div className="flex items-center gap-2 border-l pl-6 border-slate-200">
                            <div className="bg-green-50 p-1.5 rounded-full"><Percent className="h-3.5 w-3.5 text-green-600" /></div>
                            <span className="font-medium text-green-700">{coupon.successRate || 95}% success</span>
                        </div>
                    </div>

                    {/* Action Row */}
                    <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-50">
                        {/* Description Toggle */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowTerms(!showTerms);
                            }}
                            className="text-sm text-slate-500 font-medium hover:text-slate-800 transition-colors flex items-center gap-1 group/btn"
                        >
                            {showTerms ? 'Hide details' : 'Show details'}
                            {showTerms ? <ChevronUp className="h-4 w-4 group-hover/btn:-translate-y-0.5 transition-transform" /> : <ChevronDown className="h-4 w-4 group-hover/btn:translate-y-0.5 transition-transform" />}
                        </button>

                        <Button
                            onClick={(e) => {
                                const fallbackViator = "https://vi.me/EWss4";
                                const isViator = coupon.store?.name?.toLowerCase().includes('viator') || coupon.title.toLowerCase().includes('viator');
                                let targetUrl = coupon.affiliateLink || coupon.store?.websiteUrl;

                                if (!targetUrl || targetUrl === '#') {
                                    targetUrl = isViator ? fallbackViator : '#';
                                } else if (isViator && !coupon.affiliateLink && !targetUrl.includes('vi.me')) {
                                    // Specifically if it's viator and we only have store link but no direct affiliate link
                                    targetUrl = fallbackViator;
                                }
                                
                                if (coupon.type === 'deal') {
                                    // Direct link, NO modal
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (targetUrl !== '#') window.open(targetUrl, '_blank');
                                } else {
                                    // Code reveal modal
                                    if (targetUrl !== '#') window.open(targetUrl, '_blank');
                                    handleReveal(e);
                                }
                            }}
                            className={`w-full sm:w-auto min-w-[160px] font-bold text-base h-11 text-white shadow-md hover:shadow-lg transition-all ${
                                coupon.type === 'deal' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {coupon.type === 'deal' ? 'Get Offer' : 'Show Code'}
                        </Button>
                    </div>

                    {showTerms && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-4 space-y-3 overflow-hidden"
                        >
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {coupon.description}
                            </p>
                            {coupon.terms && (
                                <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <p className="font-semibold text-slate-700 mb-1">Terms & Conditions:</p>
                                    {coupon.terms}
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </Link>

            {/* Code Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-background rounded-2xl shadow-2xl w-full max-w-sm p-6 relative"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                            >
                                ✕
                            </button>

                            <div className="text-center space-y-4 pt-2">
                                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                    {isCopied ? <CheckCircle className="h-8 w-8" /> : <Copy className="h-8 w-8" />}
                                </div>

                                <h3 className="text-2xl font-bold">
                                    {isCopied ? 'Copied!' : 'Here is your code!'}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {isCopied ? 'Code copied to clipboard.' : 'Copy the code below and use it at checkout.'}
                                </p>

                                <div
                                    className={`bg-muted border border-dashed ${isCopied ? 'border-green-500 bg-green-50' : 'border-primary'} p-4 rounded-lg text-2xl font-mono font-bold text-center tracking-widest text-primary break-all cursor-pointer relative transition-colors`}
                                    onClick={() => handleCopy(coupon.code)}
                                >
                                    {coupon.code}
                                    <div className="text-[10px] uppercase text-muted-foreground mt-1 font-normal select-none">
                                        {isCopied ? 'Copied!' : 'Click to copy'}
                                    </div>
                                </div>


                                <div className="pt-2">
                                    <Button
                                        size="lg"
                                        className="w-full gap-2"
                                        onClick={() => {
                                            const targetUrl = coupon.store?.websiteUrl || '#';
                                            if (targetUrl !== '#') window.open(targetUrl, '_blank');
                                        }}
                                    >
                                        Visit Offer <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="text-xs text-slate-400">
                                    Used by {coupon.usedCount || 100} people today.
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
