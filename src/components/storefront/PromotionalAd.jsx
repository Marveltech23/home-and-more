import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import { useStore } from '../../context/StoreContext';

export default function PromotionalAd() {
  const { advertisements, activeAds } = useStore();

  const heroBottomAds = activeAds ? activeAds.filter((a) => a.placement === 'hero_bottom') : [];
  const ad = heroBottomAds[0] || (activeAds && activeAds[0]) || (advertisements && advertisements[0]);

  if (!ad) return null;

  const displayImage = ad.desktopImage || ad.mobileImage;

  return (
    <section className="container-page mt-8 sm:mt-12" aria-label="Seasonal Exhibition">
      <div className="relative overflow-hidden bg-[#221C18] text-[#FBF9F5] border border-white/10 p-8 sm:p-12">
        {/* Subtle background ambient texture */}
        {displayImage && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
            <img
              src={displayImage}
              alt=""
              className="w-full h-full object-cover object-center filter blur-xs scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#221C18] via-[#221C18]/90 to-[#221C18]/80" />
          </div>
        )}

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
          {/* Ad Thumbnail Preview */}
          {displayImage && (
            <div className="lg:col-span-3 flex items-center justify-center lg:justify-start">
              <div className="aspect-[4/3] w-full max-w-[280px] overflow-hidden border border-white/20 bg-black/40">
                <SafeImage
                  src={displayImage}
                  alt={ad.title || 'Exhibition'}
                  fit="cover"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Headline & Narrative */}
          <div className={`${displayImage ? 'lg:col-span-5' : 'lg:col-span-8'} space-y-2 text-center lg:text-left`}>
            <span className="text-[10px] uppercase tracking-ultra-caps text-[#B89358] font-semibold block">
              {ad.title || 'Seasonal Collection'}
            </span>
            <h3 className="font-luxury-serif text-3xl sm:text-4xl font-light text-white">
              {ad.subtitle || 'The 2026 Interior Salon'}
            </h3>
            <p className="text-xs text-white/75 font-light leading-relaxed max-w-md">
              {ad.tagline || ad.description || 'Special pricing and private showroom reservations for complete home and office suites.'}
            </p>
          </div>

          {/* Action CTA */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center space-y-3">
            <Link
              to={ad.buttonUrl || '/shop'}
              className="btn-primary bg-[#B89358] hover:bg-white hover:text-black border-[#B89358] text-white text-xs tracking-wide-caps"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{ad.buttonText || 'Discover Collection'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
            <span className="text-[10px] text-white/50 tracking-wider">
              Abuja Showroom Floor Models Available
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
