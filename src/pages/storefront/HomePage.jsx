import SEO from '../../components/common/SEO';
import HeroBanner from '../../components/storefront/HeroBanner';
import CategoryPills from '../../components/storefront/CategoryPills';
import PopularPicks from '../../components/storefront/PopularPicks';
import FeaturedCollections from '../../components/storefront/FeaturedCollections';
import PromotionalAd from '../../components/storefront/PromotionalAd';
import ShowroomStoryBanner from '../../components/storefront/ShowroomStoryBanner';
import HomeBlogSection from '../../components/storefront/HomeBlogSection';
import Testimonials from '../../components/storefront/Testimonials';
import NewsletterSection from '../../components/storefront/NewsletterSection';
import BenefitsStrip from '../../components/storefront/BenefitsStrip';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-0">
      <SEO
        title="Modern Luxury Furniture in Abuja, Nigeria"
        description="Shop the finest selection of modern luxury furniture in Abuja, Nigeria at Home & More Furniture. Explore handcrafted sofas, bedroom sets, center tables, dining sets, and executive office collections."
        canonical="/"
      />

      {/* 1. Full-Bleed Architectural Showroom Hero */}
      <HeroBanner />

      {/* 2. Shop by Category (All 11 Departments with Media Library Imagery) */}
      <CategoryPills />

      {/* 3. Our Popular Picks (2 x 4 Grid with Quick Category Tabs) */}
      <PopularPicks />

      {/* 4. Shop by Room (3-Column Full-Bleed Lookbook) */}
      <FeaturedCollections />

      {/* 5. Showroom Promotional Offer */}
      <PromotionalAd />

      {/* 6. "Home & More in Real Life" — Abuja Showroom & Factory Storytelling */}
      <ShowroomStoryBanner />

      {/* 7. From Our Design Journal */}
      <HomeBlogSection />

      {/* 8. Verified Client Stories */}
      <Testimonials />

      {/* 9. Newsletter */}
      <NewsletterSection />

      {/* 10. Full-Width 4-Column Service & Trust Strip */}
      <BenefitsStrip />
    </div>
  );
}
