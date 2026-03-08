import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Travel Coupons & Promo Codes",
    description: "Browse verified discount codes for top European attractions, tours, and hotels. Save more with our latest travel coupons.",
    alternates: {
        canonical: "/coupons",
    },
};

export default function CouponsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
