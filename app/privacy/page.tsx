
import { Container } from '@/components/Container';

export const metadata = {
    title: 'Privacy Policy | Europe Trip Offers',
    description: 'Privacy Policy and Data Collection practices for Europe Trip Offers.',
};

export default function PrivacyPage() {
    return (
        <Container className="py-20 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 mb-6">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">1. Introduction</h2>
                    <p>
                        Welcome to <strong>Europe Trip Offers</strong> ("we," "our," or "us"). We are committed to protecting your privacy
                        and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use,
                        and share information about you when you visit or use our services.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">2. Information We Collect</h2>
                    <p className="mb-4">
                        We collect information you provide directly to us, such as when you sign up for our newsletter (if applicable)
                        or contact us for support.
                    </p>
                    <p>
                        <strong>Automatically Collected Information:</strong> When you access our website, we may automatically collect
                        certain information about your device and usage, including your IP address, browser type, operating system,
                        and pages visited. We use this information to analyze trends and improve our website.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">3. Cookies and Tracking Technologies</h2>
                    <p>
                        We use cookies and similar tracking technologies to track activity on our service and hold certain information.
                        Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct
                        your browser to refuse all cookies or to indicate when a cookie is being sent.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">4. Affiliate Disclosure & Third-Party Links</h2>
                    <p className="mb-4">
                        <strong>Important:</strong> Europe Trip Offers serves as an affiliate aggregator. Our website contains links to
                        third-party websites and services, such as Viator, Expedia, Booking.com, and others ("Affiliate Partners").
                    </p>
                    <p>
                        When you click on these links and make a booking or purchase, we may earn a commission at no additional cost to you.
                        These third-party sites have their own privacy policies and data collection practices. We are not responsible for
                        the privacy practices or the content of these third-party sites. We encourage you to review the privacy policies
                        of any website you visit.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">5. Data Security</h2>
                    <p>
                        We strive to use commercially acceptable means to protect your Personal Data, but remember that no method of
                        transmission over the Internet, or method of electronic storage is 100% secure. While we strive to protect your
                        Personal Data, we cannot guarantee its absolute security.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">6. Changes to This Privacy Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                        Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">7. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at: <br />
                        <a href="mailto:support@europetripoffers.com" className="text-blue-600 hover:underline">support@europetripoffers.com</a>
                    </p>
                </section>
            </div>
        </Container>
    );
}
