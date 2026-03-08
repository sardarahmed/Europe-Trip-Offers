import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Best Travel Deals & Activities",
    description: "Discover top-rated tours, skip-the-line tickets, and unique experiences at unbeatable prices across Europe.",
    alternates: {
        canonical: "/offers",
    },
};

export default function OffersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
