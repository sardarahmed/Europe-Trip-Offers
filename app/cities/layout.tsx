import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Explore European Cities",
    description: "Find the best things to do in the most popular cities across Europe. Explore city guides, attractions, and more.",
    alternates: {
        canonical: "/cities",
    },
};

export default function CitiesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
