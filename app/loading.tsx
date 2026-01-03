import { Container } from "@/components/Container";

export default function Loading() {
    return (
        <div className="flex flex-col gap-16 pb-20 animate-pulse">
            {/* Hero Skeleton */}
            <div className="h-[600px] bg-muted w-full" />

            <Container>
                {/* Cities Skeleton */}
                <div className="space-y-4 mb-16">
                    <div className="h-8 w-64 bg-muted rounded" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/2] bg-muted rounded-xl" />
                        ))}
                    </div>
                </div>

                {/* Coupons Skeleton */}
                <div className="space-y-4">
                    <div className="h-8 w-64 bg-muted rounded" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-40 bg-muted rounded-xl" />
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
