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
            <Link href={`/coupons/${coupon.id}`} className="group block relative overflow-visible rounded-xl bg-white text-slate-900 border shadow-sm hover:shadow-xl transition-all flex flex-col h-full">
                {/* Image Section (Small - ~35-40% height) */}
                <div className="h-40 w-full overflow-hidden relative bg-muted rounded-t-xl shrink-0">
                    {coupon.imageUrl ? (
                        <Image
                            src={coupon.imageUrl}
                            alt={coupon.title}
                            fill
                            sizes="(max-width: 768px) 50vw, 20vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/40 font-bold">
                            NO IMAGE
                        </div>
                    )}
                    {/* Discount Badge Overlay */}
                    <div className="absolute top-2 right-2 inline-flex items-center justify-center rounded-full bg-secondary text-white px-3 py-1 text-xs font-bold shadow-sm z-10">
                        {coupon.discountAmount}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 flex flex-col space-y-3">

                    {/* Trust Signals */}
                    <div className="flex items-center gap-2 text-[10px] font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md w-fit">
                        <CheckCircle className="h-3 w-3" />
                        {getVerifiedText(coupon.lastVerified)}
                    </div>

                    <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors">
                        {coupon.title}
                    </h3>

                    {/* usage stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{coupon.usedCount?.toLocaleString() || '100+'} used</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 font-bold">
                            <Percent className="h-3 w-3" />
                            <span>{coupon.successRate || 95}% success</span>
                        </div>
                    </div>

                    {/* Description Toggle */}
                    <div className="w-full">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowTerms(!showTerms);
                            }}
                            className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1 w-full"
                        >
                            {showTerms ? 'Hide details' : 'Show details'}
                            {showTerms ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>

                        {showTerms && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="mt-2 space-y-2 overflow-hidden"
                            >
                                <p className="text-sm text-muted-foreground">
                                    {coupon.description}
                                </p>
                                {coupon.terms && (
                                    <div className="text-xs text-slate-400 bg-slate-50 p-2 rounded">
                                        <p className="font-semibold mb-1">Terms & Conditions:</p>
                                        {coupon.terms}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="relative h-px w-full bg-border" />

                {/* Bottom Section: Store Label & Reveal Button */}
                <div className="p-3 bg-muted/10 flex items-center justify-between gap-2 mt-auto rounded-b-xl">
                    {/* Store Info */}
                    {coupon.store && (
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Use a simple image here or text if no Logo component available in this scope easily, 
                                but better to just render image if exists */}
                            {coupon.store.logoUrl ? (
                                <div className="h-6 w-6 relative bg-white rounded-full border overflow-hidden p-0.5">
                                    <img src={coupon.store.logoUrl} alt={coupon.store.name} className="object-contain w-full h-full" />
                                </div>
                            ) : (
                                <span className="text-[10px] font-bold text-slate-500">{coupon.store.name}</span>
                            )}
                        </div>
                    )}

                    {/* Button */}
                    <div className="flex-1">
                        <Button
                            onClick={(e) => {
                                // 1. Open Affiliate Link in New Tab
                                const targetUrl = coupon.store?.websiteUrl || '#';
                                if (targetUrl !== '#') {
                                    window.open(targetUrl, '_blank');
                                }

                                // 2. Reveal Code (open modal)
                                handleReveal(e);
                            }}
                            className="w-full font-bold text-base h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                        >
                            Show Code
                        </Button>
                    </div>
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
                                    <Button size="lg" className="w-full gap-2" onClick={() => window.open('https://viator.com', '_blank')}>
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
