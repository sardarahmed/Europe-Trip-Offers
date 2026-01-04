export interface Category {
    id: string;
    name: string;
    slug: string;
    type: 'city' | 'activity' | 'coupon' | 'blog';
}

export interface Store {
    id: string;
    name: string;
    slug: string;
    logoUrl: string; // db column: logo_url
    description?: string;
    websiteUrl?: string; // db column: website_url
    isFeatured: boolean; // db column: is_featured
    rating: number;
    reviewCount: number; // db column: review_count
}

export interface City {
    id: string;
    name: string;
    slug: string;
    country: string;
    description?: string;
    imageUrl: string;
    activityCount: number;
    featured: boolean;
    categoryId?: string;
}

export interface Activity {
    id: string;
    title: string;
    slug: string;
    cityId: string;
    cityName: string;
    storeId?: string; // New
    store?: Store;    // New
    categoryId?: string;
    price: number;
    discountPrice?: number;
    rating: number;
    reviewsCount: number;
    imageUrl: string;
    duration: string;
    isFeatured: boolean;
    highlights?: string[];
    affiliateLink?: string;
    description?: string;
}

export interface Coupon {
    id: string;
    code: string;
    title: string;
    description: string;
    discountAmount: string;
    expiryDate: string;
    activityId?: string;
    storeId?: string; // New
    store?: Store;    // New
    categoryId?: string;
    imageUrl?: string;
    isFeatured: boolean;
    usedCount?: number;      // New
    successRate?: number;    // New
    lastVerified?: string;   // New
    terms?: string;          // New
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    imageUrl: string;
    publishedAt: string;
    author: string;
    categoryId?: string;
}
