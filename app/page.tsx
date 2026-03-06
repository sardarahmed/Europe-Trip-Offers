import { HeroSection } from "@/components/HeroSection";
import { FeaturedCities } from "@/components/FeaturedCities";
import { FeaturedCoupons } from "@/components/FeaturedCoupons";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { FeaturedBrands } from "@/components/FeaturedBrands";
import { ReviewsSection } from "@/components/ReviewsSection";
import { supabase } from "@/lib/supabase";
import { City, Coupon, Activity, Store } from "@/types";

export const revalidate = 60; // Revalidate every 60 seconds (Incremental Static Regeneration)

export default async function Home() {
  // Parallel Data Fetching
  const [heroResult, citiesResult, couponsResult, activitiesResult, storesResult] = await Promise.all([
    // 1. Hero Content
    supabase.from('hero_content').select('*').eq('page_slug', 'home').single(),

    // 2. Featured Cities
    supabase.from('cities').select('*, activities(count)').eq('featured', true).limit(8),

    // 3. Featured Coupons
    supabase.from('coupons').select('*, stores(*)').eq('is_featured', true).limit(12),

    // 4. Featured Activities (Deals)
    supabase.from('activities').select('*, cities(name), stores(*)').eq('is_featured', true).limit(12),

    // 5. Featured Stores
    supabase.from('stores').select('*').eq('is_featured', true).limit(6)
  ]);

  // -- Data Mapping (Server Side) --

  // Hero
  const heroData = heroResult.data || {
    title: 'Uncover Exclusive Europe Travel Deals & Coupons',
    subtitle: 'Save up to 50% on top-rated tours, hotels, and attractions with our verified promo codes.',
    backgroundImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070'
  };
  const heroProps = {
    title: heroData.title,
    subtitle: heroData.subtitle || '',
    backgroundImage: heroData.background_image_url || heroData.backgroundImage
  };

  // Cities
  const cities: City[] = (citiesResult.data || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    country: c.country,
    imageUrl: c.image_url,
    activityCount: c.activities?.[0]?.count || 0, // Map the count from the joined table
    featured: c.featured,
  }));

  // Stores
  const stores: Store[] = (storesResult.data || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    logoUrl: s.logo_url,
    description: s.description,
    websiteUrl: s.website_url,
    isFeatured: s.is_featured,
    rating: s.rating,
    reviewCount: s.review_count
  }));

  // Coupons
  const coupons: Coupon[] = (couponsResult.data || []).map((c: any) => ({
    id: c.id,
    code: c.code,
    title: c.title,
    description: c.description || '',
    discountAmount: c.discount_amount,
    expiryDate: c.expiry_date,
    imageUrl: c.image_url,
    isFeatured: c.is_featured,
    categoryId: c.category_id,
    activityId: c.activity_id,
    usedCount: c.used_count,
    successRate: c.success_rate,
    lastVerified: c.last_verified,
    terms: c.terms,
    storeId: c.store_id,
    store: c.stores ? {
      id: c.stores.id,
      name: c.stores.name,
      slug: c.stores.slug,
      logoUrl: c.stores.logo_url,
      description: c.stores.description,
      websiteUrl: c.stores.website_url,
      isFeatured: c.stores.is_featured,
      rating: c.stores.rating,
      reviewCount: c.stores.review_count
    } : undefined
  }));

  // Activities
  const activities: Activity[] = (activitiesResult.data || []).map((a: any) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    cityId: a.city_id,
    cityName: a.cities?.name || 'Unknown',
    price: a.price,
    discountPrice: a.discount_price,
    rating: a.rating,
    reviewsCount: a.reviews_count,
    imageUrl: a.image_url,
    duration: a.duration,
    isFeatured: a.is_featured,
    categoryId: a.category_id,
    highlights: a.highlights,
    storeId: a.store_id,
    store: a.stores ? {
      id: a.stores.id,
      name: a.stores.name,
      slug: a.stores.slug,
      logoUrl: a.stores.logo_url,
      description: a.stores.description,
      websiteUrl: a.stores.website_url,
      isFeatured: a.stores.is_featured,
      rating: a.stores.rating,
      reviewCount: a.stores.review_count
    } : undefined
  }));

  return (
    <div className="flex flex-col gap-6 pb-12">
      <HeroSection
        title={heroProps.title}
        subtitle={heroProps.subtitle}
        backgroundImage={heroProps.backgroundImage}
      />

      <FeaturedBrands stores={stores} />

      <FeaturedCoupons coupons={coupons} />


      <FeaturedDeals activities={activities} />

      <FeaturedCities cities={cities} />

      <ReviewsSection />
    </div>
  );
}
