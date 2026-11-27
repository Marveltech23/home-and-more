import SEO from '../../components/common/SEO';
import TopPromoStrip from '../../components/storefront/TopPromoStrip';
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
import { useStore } from '../../context/StoreContext';

export default function HomePage() {
  const { settings } = useStore();
  const carouselPos = settings?.middleCarouselPosition || 'after_rooms';

  return (
    <div className="flex flex-col gap-0">
      <SEO
        title="Modern Luxury Furniture in Abuja, Nigeria"
        description="Shop the finest selection of modern luxury furniture in Abuja, Nigeria at Home & More Furniture. Explore handcrafted sofas, bedroom sets, center tables, dining sets, and executive office collections."
        canonical="/"
      />

      {/* 0. Top Strip Promotional Banner (Before Hero — 1024x57 / 18:1 ratio) */}
      <TopPromoStrip />

      {/* 1. Full-Bleed Architectural Showroom Hero */}
      <HeroBanner />

      {carouselPos === 'after_hero' && (
        <div className="pt-10 sm:pt-12">
          <PromotionalAd />
        </div>
      )}

      {/* 2. Shop by Category (All 11 Departments with Media Library Imagery) */}
      <CategoryPills />

      {carouselPos === 'after_categories' && <PromotionalAd />}

      {/* 3. Our Popular Picks (2 x 4 Grid with Quick Category Tabs) */}
      <PopularPicks />

      {carouselPos === 'after_popular' && <PromotionalAd />}

      {/* 4. Shop by Room (3-Column Full-Bleed Lookbook) */}
      <FeaturedCollections />

      {/* 5. Showroom Promotional Carousel (Default Position) */}
      {carouselPos === 'after_rooms' && <PromotionalAd />}

      {/* 6. "Home & More in Real Life" — Abuja Showroom & Factory Storytelling */}
      <ShowroomStoryBanner />

      {carouselPos === 'after_story' && (
        <div className="pt-10 sm:pt-12">
          <PromotionalAd />
        </div>
      )}

      {/* 7. Latest from Our Blog */}
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
