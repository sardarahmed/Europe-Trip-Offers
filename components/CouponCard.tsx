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
            <Link href={`/coupons/${coupon.id}`} className="group block relative overflow-hidden rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                {/* Header: Logo & Badge */}
                <div className="relative p-5 flex items-start justify-between bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                    <div className="h-16 w-16 rounded-xl border border-slate-100 bg-white flex items-center justify-center p-2 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                        {coupon.store?.logoUrl ? (
                            <img src={coupon.store.logoUrl} alt={coupon.store.name} className="object-contain w-full h-full" />
                        ) : (
                            <span className="text-[10px] font-bold text-slate-300 uppercase">Logo</span>
                        )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                        <div className="inline-flex items-center justify-center rounded-full bg-red-50 text-red-600 px-3 py-1 text-sm font-black border border-red-100 shadow-sm whitespace-nowrap">
                            {coupon.discountAmount}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 uppercase tracking-tighter">
                            <CheckCircle className="h-2.5 w-2.5" />
                            {getVerifiedText(coupon.lastVerified)}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-5 flex flex-col">
                    <div className="mb-4">
                        {coupon.store && (
                            <div className="text-[11px] font-bold text-blue-600 mb-1 tracking-widest uppercase opacity-80">
                                {coupon.store.name}
                            </div>
                        )}
                        <h3 className={`font-extrabold leading-tight text-slate-800 group-hover:text-blue-600 transition-colors ${
                            coupon.title.length > 60 ? 'text-base' : 
                            coupon.title.length > 40 ? 'text-lg' : 
                            'text-xl'
                        }`}>
                            {coupon.title}
                        </h3>
                    </div>

                    {/* Compact Stats */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                        <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            <span className="font-medium">{coupon.usedCount?.toLocaleString() || '100+'} used</span>
                        </div>
                        <div className="flex items-center gap-1.5 pl-4 border-l border-slate-100">
                            <Percent className="h-3.5 w-3.5 text-green-500" />
                            <span className="font-medium text-green-600">{coupon.successRate || 95}% success</span>
                        </div>
                    </div>

                    {/* Action Row */}
                    <div className="mt-auto flex flex-col gap-3">
                        <Button
                            onClick={(e) => {
                                const fallbackViator = "https://vi.me/EWss4";
                                const isViator = coupon.store?.name?.toLowerCase().includes('viator') || coupon.title.toLowerCase().includes('viator');
                                let targetUrl = coupon.affiliateLink || coupon.store?.websiteUrl;

                                if (!targetUrl || targetUrl === '#') {
                                    targetUrl = isViator ? fallbackViator : '#';
                                } else if (isViator && !coupon.affiliateLink && !targetUrl.includes('vi.me')) {
                                    targetUrl = fallbackViator;
                                }
                                
                                if (coupon.type === 'deal') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (targetUrl !== '#') window.open(targetUrl, '_blank');
                                } else {
                                    if (targetUrl !== '#') window.open(targetUrl, '_blank');
                                    handleReveal(e);
                                }
                            }}
                            className={`w-full font-black text-sm h-10 text-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] ${
                                coupon.type === 'deal' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {coupon.type === 'deal' ? 'Activate Deal' : 'Reveal Code'}
                        </Button>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowTerms(!showTerms);
                            }}
                            className="text-[11px] text-slate-400 font-bold hover:text-slate-600 transition-colors flex items-center justify-center gap-1 group/btn py-1"
                        >
                            {showTerms ? 'Hide details' : 'Show details'}
                            {showTerms ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showTerms && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-4 overflow-hidden border-t border-slate-50 pt-4"
                            >
                                <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">
                                    {coupon.description}
                                </p>
                                {coupon.terms && (
                                    <div className="mt-3 text-[10px] text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                                        <p className="font-bold text-slate-600 mb-1 not-italic tracking-wider uppercase">T&C:</p>
                                        {coupon.terms}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
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
