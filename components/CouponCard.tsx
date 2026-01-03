'use client';

import { Coupon } from '@/types';
import { Button } from './ui/button';
import { Copy, Clock, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import Image from 'next/image';

interface CouponCardProps {
    coupon: Coupon;
}

export function CouponCard({ coupon }: CouponCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleReveal = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to details page
        e.stopPropagation();
        setIsModalOpen(true);
        navigator.clipboard.writeText(coupon.code);
    };

    return (
        <>
            <Link href={`/coupons/${coupon.id}`} className="group block relative overflow-hidden rounded-xl bg-white text-slate-900 border shadow-sm hover:shadow-xl transition-all aspect-square flex flex-col">
                {/* Image Section (Small - ~35-40% height) */}
                <div className="h-[40%] w-full overflow-hidden relative bg-muted">
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
                <div className="flex-1 p-4 flex flex-col items-center justify-center text-center space-y-2 bg-gradient-to-br from-primary/5 to-transparent">
                    <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {coupon.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 px-2">
                        {coupon.description}
                    </p>
                </div>

                {/* Divider */}
                <div className="relative h-px w-full bg-border mx-4 mb-2" />

                {/* Bottom Section: Reveal Button */}
                <div className="p-3 bg-muted/30 flex flex-col gap-2 justify-end">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                    </div>
                    <Button
                        onClick={handleReveal}
                        className="w-full font-bold tracking-wide h-8 text-xs"
                        variant="default"
                    >
                        Show Code
                    </Button>
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
                                    <Copy className="h-8 w-8" />
                                </div>

                                <h3 className="text-2xl font-bold">Here is your code!</h3>
                                <p className="text-muted-foreground text-sm">
                                    Copy the code below and use it at checkout.
                                </p>

                                <div
                                    className="bg-muted border border-dashed border-primary p-4 rounded-lg text-2xl font-mono font-bold text-center tracking-widest text-primary break-all cursor-pointer relative"
                                    onClick={() => navigator.clipboard.writeText(coupon.code)}
                                >
                                    {coupon.code}
                                    <div className="text-[10px] uppercase text-muted-foreground mt-1 font-normal select-none">Click to copy</div>
                                </div>

                                <div className="pt-2">
                                    <Button size="lg" className="w-full gap-2" onClick={() => window.open('https://viator.com', '_blank')}>
                                        Visit Offer <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
