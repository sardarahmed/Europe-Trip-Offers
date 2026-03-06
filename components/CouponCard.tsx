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
                {/* Top Border Accent (Optional) */}
                <div className="h-1.5 w-full bg-primary shrink-0 rounded-t-xl" />

                {/* Content Section */}
                <div className="flex-1 p-4 flex flex-col space-y-3">

                    {/* Header Row: Logo + Discount + Trust */}
                    <div className="flex items-start justify-between gap-3 mb-1">
                        {/* Logo Wrapper */}
                        {coupon.store && coupon.store.logoUrl ? (
                            <div className="h-12 w-12 rounded-full border border-slate-200 bg-white flex items-center justify-center p-1.5 shrink-0 shadow-sm overflow-hidden">
                                <img src={coupon.store.logoUrl} alt={coupon.store.name} className="object-contain w-full h-full" />
                            </div>
                        ) : (
                            <div className="h-12 w-12 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center p-1.5 shrink-0 shadow-sm text-xs font-bold text-slate-400">
                                Logo
                            </div>
                        )}

                        <div className="flex flex-col items-end gap-1">
                            {/* Discount Amount Badge */}
                            <div className="inline-flex items-center justify-center rounded bg-red-100 text-red-600 px-2 py-0.5 text-sm font-bold border border-red-200">
                                {coupon.discountAmount}
                            </div>
                            {/* Trust Signals */}
                            <div className="flex items-center gap-1 text-[10px] font-medium text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                {getVerifiedText(coupon.lastVerified)}
                            </div>
                        </div>
                    </div>

                    <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[44px]">
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
                                <p className="text-sm text-slate-600 line-clamp-2 mt-1 whitespace-pre-wrap">
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
                        <div className="flex items-center gap-1.5 shrink-0 text-slate-500 font-medium text-xs">
                            Store: <span className="font-bold text-slate-700">{coupon.store.name}</span>
                        </div>
                    )}

                    {/* Button */}
                    <div className="flex-1 max-w-[140px]">
                        <Button
                            onClick={(e) => {
                                const targetUrl = coupon.store?.websiteUrl || '#';
                                
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
                            className={`w-full font-bold text-sm h-10 text-white shadow-md hover:shadow-lg transition-all ${
                                coupon.type === 'deal' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {coupon.type === 'deal' ? 'Get Offer' : 'Show Code'}
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
