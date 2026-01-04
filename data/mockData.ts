import { Store, Category } from "@/types/store";

export const categories: Category[] = [
    { id: 'cat_hotels', name: 'Hotels', slug: 'hotels', icon: 'Hotel', description: 'Find the best places to stay.' },
    { id: 'cat_flights', name: 'Flights', slug: 'flights', icon: 'Plane', description: 'Cheap airfare and travel deals.' },
    { id: 'cat_tours', name: 'Tours & Activities', slug: 'tours', icon: 'Map', description: 'Experience the world with guided tours.' },
    { id: 'cat_car', name: 'Car Rental', slug: 'car-rental', icon: 'Car', description: 'Drive at your own pace.' },
    { id: 'cat_insurance', name: 'Travel Insurance', slug: 'insurance', icon: 'Shield', description: 'Protect your trip.' },
];

export const stores: Store[] = [
    {
        id: 'store_expedia',
        name: 'Expedia',
        slug: 'expedia',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Expedia_logo_2023.svg', // Placeholder or external
        description: 'One of the world\'s leading full-service online travel brands helping travelers easily plan and book their whole trip.',
        websiteUrl: 'https://www.expedia.com',
        categoryIds: ['cat_hotels', 'cat_flights', 'cat_car'],
        rating: 4.5,
        offerCount: 124
    },
    {
        id: 'store_booking',
        name: 'Booking.com',
        slug: 'booking-com',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Booking.com_logo.svg',
        description: 'Earth\'s #1 accommodation site. Incredible choice, low prices, and confirmed availability.',
        websiteUrl: 'https://www.booking.com',
        categoryIds: ['cat_hotels'],
        rating: 4.8,
        offerCount: 350
    },
    {
        id: 'store_viator',
        name: 'Viator',
        slug: 'viator',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Viator_Logo_2024.svg',
        description: 'Viator makes it easy to find and book something you\'ll love to do. With access to the world\'s largest selection of high-quality experiences.',
        websiteUrl: 'https://www.viator.com',
        categoryIds: ['cat_tours'],
        rating: 4.6,
        offerCount: 89
    },
    {
        id: 'store_airbnb',
        name: 'Airbnb',
        slug: 'airbnb',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
        description: 'Find vacation rentals, cabins, beach houses, unique homes and experiences around the world.',
        websiteUrl: 'https://www.airbnb.com',
        categoryIds: ['cat_hotels'],
        rating: 4.7,
        offerCount: 45
    },
    {
        id: 'store_skyscanner',
        name: 'Skyscanner',
        slug: 'skyscanner',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Skyscanner_Logo_2022.svg',
        description: 'We compare all top travel sites in one simple search and help you to find the best flights and hotels.',
        websiteUrl: 'https://www.skyscanner.com',
        categoryIds: ['cat_flights', 'cat_car', 'cat_hotels'],
        rating: 4.4,
        offerCount: 22
    },
    {
        id: 'store_getyourguide',
        name: 'GetYourGuide',
        slug: 'getyourguide',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/75/GetYourGuide_logo_2020.svg',
        description: 'Book tickets for top attractions around the world.',
        websiteUrl: 'https://www.getyourguide.com',
        categoryIds: ['cat_tours'],
        rating: 4.6,
        offerCount: 78
    },
    {
        id: 'store_hotels_com',
        name: 'Hotels.com',
        slug: 'hotels-com',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Hotels.com_Logo_2024.svg',
        description: 'The obvious choice for booking hotels.',
        websiteUrl: 'https://www.hotels.com',
        categoryIds: ['cat_hotels'],
        rating: 4.3,
        offerCount: 56
    },
    {
        id: 'store_tripadvisor',
        name: 'TripAdvisor',
        slug: 'tripadvisor',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/02/TripAdvisor_Logo.svg',
        description: 'World\'s largest travel platform. Browse hundreds of millions of traveler reviews and opinions.',
        websiteUrl: 'https://www.tripadvisor.com',
        categoryIds: ['cat_tours', 'cat_hotels'],
        rating: 4.5,
        offerCount: 92
    }
];
