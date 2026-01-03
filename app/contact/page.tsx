'use client';

import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you for your message! Use Supabase to save this data in production.");
    };

    return (
        <div className="py-12 md:py-20">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
                    <p className="text-muted-foreground text-lg">
                        Have questions about a deal or need help planning? We're here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Email Us</h3>
                                <p className="text-muted-foreground">For general inquiries and support.</p>
                                <a href="mailto:support@europetripoffers.com" className="text-primary hover:underline mt-1 block">
                                    support@europetripoffers.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-secondary/10 text-secondary">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Call Us</h3>
                                <p className="text-muted-foreground">Mon-Fri from 9am to 6pm CET.</p>
                                <a href="tel:+33123456789" className="text-primary hover:underline mt-1 block">
                                    +33 1 23 45 67 89
                                </a>
                            </div>
                        </div>

                        <div className="bg-muted p-6 rounded-xl mt-8">
                            <h4 className="font-bold mb-2">Frequently Asked Questions</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li>• How do I use my coupon code?</li>
                                <li>• Can I cancel my booking?</li>
                                <li>• Are these tours guided?</li>
                            </ul>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                                    <input
                                        id="name"
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                                <input
                                    id="subject"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">Message</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    required
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </Container>
        </div>
    );
}
