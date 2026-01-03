import Link from 'next/link';
import { Container } from './Container';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <Container className="py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Europe Trip Offers</h3>
                        <p className="text-sm text-muted-foreground">
                            Discover the best deals, tours, and activities across Europe.
                            Powered by Viator.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/coupons" className="hover:text-primary">Coupons</Link></li>
                            <li><Link href="/cities" className="hover:text-primary">Cities</Link></li>
                            <li><Link href="/offers" className="hover:text-primary">Deals</Link></li>
                            <li><Link href="/blog" className="hover:text-primary">Travel Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Follow Us</h3>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} Europe Trip Offers. All rights reserved.
                        </p>
                    </div>
                </div>

                <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
                    <p>
                        This website contains affiliate links. If you make a booking through these links,
                        we may earn a commission at no extra cost to you.
                    </p>
                </div>
            </Container>
        </footer>
    );
}
