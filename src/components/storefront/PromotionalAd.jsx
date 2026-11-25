import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import { useStore } from '../../context/StoreContext';

export default function PromotionalAd() {
  const { advertisements, activeAds } = useStore();

  const heroBottomAds = activeAds ? activeAds.filter((a) => a.placement === 'hero_bottom') : [];
  const ad = heroBottomAds[0] || (activeAds && activeAds[0]) || (advertisements && advertisements[0]);

  if (!ad) return null;

  const displayImage = ad.desktopImage || ad.mobileImage;

  return (
    <section className="container-page pb-14 sm:pb-16" aria-label="Promotional Offer">
      <div className="relative overflow-hidden rounded-2xl bg-[#24150F] text-white border border-[#3B2419]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 space-y-4">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#F36B0A]">
              {ad.subtitle || 'Showroom Special'}
            </span>
            <h2 className="font-editorial text-2xl sm:text-4xl font-semibold text-white leading-tight">
              {ad.title}
            </h2>
            <p className="text-sm text-white/80 max-w-xl leading-relaxed">
              {ad.description || ad.tagline || 'Discover exclusive offers on handcrafted living room, dining, and bedroom suites.'}
            </p>
            <div className="pt-2">
              <Link
                to={ad.buttonUrl || '/shop'}
                className="inline-flex items-center gap-2 rounded-full bg-[#F36B0A] hover:bg-[#D94D00] text-white px-6 py-3 text-xs sm:text-sm font-semibold transition-all hover:shadow-md"
              >
                <span>{ad.buttonText || 'Shop Offers'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Clean Image */}
          {displayImage && (
            <div className="lg:col-span-5 h-56 sm:h-72 lg:h-full min-h-[240px] relative overflow-hidden">
              <SafeImage
                src={displayImage}
                alt={ad.title || 'Promotional Offer'}
                fit="cover"
                aspectRatio="aspect-auto"
                className="w-full h-full"
              />
              <div className="hidden lg:block absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#24150F] to-transparent pointer-events-none" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
