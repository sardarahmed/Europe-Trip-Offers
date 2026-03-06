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
    customDiscountText?: string; // db column: custom_discount_text
    usedDealsCount?: number; // db column: used_deals_count
    popupCode?: string; // db column: popup_code
    popupLink?: string; // db column: popup_link
    offerTitle?: string; // db column: offer_title
    offerExpiry?: string; // db column: offer_expiry
    redirectSlug?: string; // db column: redirect_slug
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
    latitude?: number;
    longitude?: number;
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
    createdAt?: string;
    latitude?: number;
    longitude?: number;
    usedCount?: number; // db column: used_count
}

export interface Coupon {
    id: string;
    code: string;
    title: string;
    description: string;
    discountAmount: string;
    expiryDate: string;
    createdAt?: string;
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
    type?: 'code' | 'deal';  // New
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
