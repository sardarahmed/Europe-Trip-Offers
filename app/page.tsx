import { HeroSection } from "@/components/HeroSection";
import { FeaturedCities } from "@/components/FeaturedCities";
import { FeaturedCoupons } from "@/components/FeaturedCoupons";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { supabase } from "@/lib/supabase";
import { City, Coupon, Activity } from "@/types";

export const revalidate = 60; // Revalidate every 60 seconds (Incremental Static Regeneration)

export default async function Home() {
  // Parallel Data Fetching
  const [heroResult, citiesResult, couponsResult, activitiesResult] = await Promise.all([
    // 1. Hero Content
    supabase.from('hero_content').select('*').eq('page_slug', 'home').single(),

    // 2. Featured Cities
    supabase.from('cities').select('*').eq('featured', true).limit(4),

    // 3. Featured Coupons
    supabase.from('coupons').select('*').eq('is_featured', true).limit(4),

    // 4. Featured Activities (Deals)
    supabase.from('activities').select('*, cities(name)').eq('is_featured', true).limit(4)
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
    activityCount: c.activity_count,
    featured: c.featured,
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
    activityId: c.activity_id
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
    highlights: a.highlights
  }));

  return (
    <div className="flex flex-col gap-16 pb-20">
      <HeroSection
        title={heroProps.title}
        subtitle={heroProps.subtitle}
        backgroundImage={heroProps.backgroundImage}
      />

      <FeaturedCities cities={cities} />

      <FeaturedCoupons coupons={coupons} />

      <FeaturedDeals activities={activities} />
    </div>
  );
}
