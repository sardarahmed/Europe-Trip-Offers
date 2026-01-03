import Image from "next/image";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedCities } from "@/components/FeaturedCities";
import { FeaturedCoupons } from "@/components/FeaturedCoupons";
import { FeaturedDeals } from "@/components/FeaturedDeals";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <HeroSection />

      <FeaturedCities />

      <FeaturedCoupons />

      <FeaturedDeals />
    </div>
  );
}
