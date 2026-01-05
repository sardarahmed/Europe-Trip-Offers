
import { Container } from '@/components/Container';

export const metadata = {
    title: 'Terms of Service | Europe Trip Offers',
    description: 'Terms and Conditions for using Europe Trip Offers.',
};

export default function TermsPage() {
    return (
        <Container className="py-20 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 mb-6">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using <strong>Europe Trip Offers</strong> (the "Service"), you accept and agree to be bound by the terms
                        and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines
                        or rules applicable to such services.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">2. Description of Service</h2>
                    <p>
                        Europe Trip Offers is a travel deals aggregator and affiliate marketing website. We curate and display travel offers,
                        coupons, and activity bookings from various third-party providers. We do not directly sell travel products, tours,
                        or hotel bookings. All bookings are facilitated through our partner websites.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">3. Booking & Cancellations</h2>
                    <p className="mb-4">
                        Because we are not a booking engine or travel agency, <strong>we do not handle bookings, payments, or cancellations directly.</strong>
                    </p>
                    <p>
                        Any issue regarding a specific booking (including cancellations, refunds, or changes) must be resolved directly with the
                        provider you booked with (e.g., Viator, Expedia, Booking.com). Please refer to the specific Terms and Conditions of the
                        partner website where you completed your purchase.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">4. Content Accuracy</h2>
                    <p>
                        We strive to provide accurate and up-to-date information regarding prices, availability, and deal details. However,
                        travel prices and availability change rapidly. We cannot guarantee the accuracy of any offer listed on our site at the
                        exact moment of your visit. All information is provided "as is" without warranty of any kind.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">5. Affiliate Disclaimer</h2>
                    <p>
                        This website participates in various affiliate marketing programs, which means we may get paid commissions on editorially
                        chosen products purchased through our links to retailer sites. This comes at no extra cost to you and helps support the
                        maintenance of this website.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">6. Intellectual Property</h2>
                    <p>
                        The content, organization, graphics, design, compilation, and other matters related to the Site are protected under
                        applicable copyrights and other proprietary (including but not limited to intellectual property) rights. The copying,
                        redistribution, use, or publication by you of any such matters or any part of the Site is strictly prohibited.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">7. Limitation of Liability</h2>
                    <p>
                        In no event shall Europe Trip Offers be liable for any direct, indirect, incidental, special, consequential damages
                        arising out of or in any way connected with the use of this website or with the delay or inability to use this website,
                        or for any information, products, and services obtained through this website.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">8. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these Terms of Service at any time. Your continued use of the Service after any such
                        changes constitutes your acceptance of the new Terms of Service.
                    </p>
                </section>
            </div>
        </Container>
    );
}
