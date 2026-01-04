export interface Store {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    description: string;
    websiteUrl: string;
    categoryIds: string[]; // e.g., 'hotels', 'flights'
    rating: number;
    offerCount: number;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string; // Lucide icon name
    description: string;
}
