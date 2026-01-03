export interface Category {
    id: string;
    name: string;
    slug: string;
    type: 'city' | 'activity' | 'coupon' | 'blog';
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
    categoryId?: string; // Foreign key to Category
}

export interface Activity {
    id: string;
    title: string;
    slug: string;
    cityId: string;
    cityName: string;
    categoryId?: string; // Foreign key to Category
    price: number;
    discountPrice?: number;
    rating: number;
    reviewsCount: number;
    imageUrl: string;
    duration: string;
    isFeatured: boolean;
}

export interface Coupon {
    id: string;
    code: string;
    title: string;
    description: string;
    discountAmount: string; // e.g. "10% OFF"
    expiryDate: string;
    activityId?: string;
    categoryId?: string; // Foreign key to Category
    imageUrl?: string;
    isFeatured: boolean;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    imageUrl: string;
    publishedAt: string;
    author: string;
    categoryId?: string; // Foreign key to Category
}
