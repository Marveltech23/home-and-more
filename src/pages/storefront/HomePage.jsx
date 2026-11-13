import HeroBanner from '../../components/storefront/HeroBanner';
import PromotionalAd from '../../components/storefront/PromotionalAd';
import CategoryPills from '../../components/storefront/CategoryPills';
import PopularPicks from '../../components/storefront/PopularPicks';
import FeaturedCollections from '../../components/storefront/FeaturedCollections';
import BenefitsStrip from '../../components/storefront/BenefitsStrip';
import Testimonials from '../../components/storefront/Testimonials';
import NewsletterSection from '../../components/storefront/NewsletterSection';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-0 pb-6">
      {/* 1. Large Hero Banner */}
      <HeroBanner />

      {/* 2. Promotional Advertisement Section */}
      <PromotionalAd />

      {/* 3. Shop by Category */}
      <CategoryPills />

      {/* 4. Popular Products */}
      <PopularPicks />

      {/* 5. Featured Collections */}
      <FeaturedCollections />

      {/* 6. Why Choose Us Strip */}
      <BenefitsStrip />

      {/* 7. Customer Testimonials */}
      <Testimonials />

      {/* 8. Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}
