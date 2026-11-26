import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import { useStore } from '../../context/StoreContext';
import { sanitizeUrl } from '../../utils/security';

export default function PromotionalAd() {
  const { advertisements, activeAds } = useStore();

  const heroBottomAds = activeAds ? activeAds.filter((a) => a.placement === 'hero_bottom') : [];
  const ad = heroBottomAds[0] || (activeAds && activeAds.find((a) => a.placement !== 'top_banner')) || (advertisements && advertisements.find((a) => a.placement !== 'top_banner' && a.isActive !== false));

  if (!ad) return null;

  const desktopImg = ad.desktopImage || ad.mobileImage;
  const mobileImg = ad.mobileImage || ad.desktopImage;
  const href = sanitizeUrl(ad.buttonUrl, '/shop');
  const isExternal = /^https?:\/\//i.test(href);

  // If the admin uploaded a custom graphic banner (not a generic stock photo),
  // render it as a pure full-bleed clickable graphic at the exact 1024x318 (3.22:1) ratio
  // so no text overlaps their designed artwork.
  const isStockPlaceholder =
    typeof desktopImg === 'string' && desktopImg.startsWith('/images/stock/');

  if (desktopImg && !isStockPlaceholder) {
    const graphic = (
      <div className="relative w-full overflow-hidden rounded-2xl border border-[#EAE2D9] shadow-xs group bg-[#24150F]">
        <img
          src={desktopImg}
          alt={ad.title || 'Promotional Offer'}
          className="hidden sm:block w-full aspect-[1024/318] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
        />
        <img
          src={mobileImg}
          alt={ad.title || 'Promotional Offer'}
          className="block sm:hidden w-full h-auto object-cover"
        />
      </div>
    );

    return (
      <section className="container-page pb-14 sm:pb-16" aria-label={ad.title || 'Promotional Offer'}>
        {isExternal ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="block">
            {graphic}
          </a>
        ) : (
          <Link to={href} className="block">
            {graphic}
          </Link>
        )}
      </section>
    );
  }

  // Fallback editorial banner (same exact 1024x318 aspect ratio on desktop) for built-in stock photo
  return (
    <section className="container-page pb-14 sm:pb-16" aria-label="Promotional Offer">
      <div className="relative w-full sm:aspect-[1024/318] overflow-hidden rounded-2xl bg-[#24150F] text-white border border-[#3B2419] flex items-center">
        {desktopImg && (
          <div className="absolute inset-0">
            <SafeImage
              src={desktopImg}
              alt={ad.title || 'Promotional Offer'}
              fit="cover"
              aspectRatio="aspect-auto"
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E09]/92 via-[#24150F]/75 to-[#24150F]/25" />
          </div>
        )}

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl space-y-2.5 sm:space-y-3">
          {ad.subtitle && (
            <span className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#F36B0A]">
              {ad.subtitle}
            </span>
          )}
          <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight">
            {ad.title}
          </h2>
          {(ad.description || ad.tagline) && (
            <p className="text-xs sm:text-sm text-white/85 max-w-lg leading-relaxed line-clamp-2">
              {ad.description || ad.tagline}
            </p>
          )}
          <div className="pt-1.5">
            {isExternal ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#F36B0A] hover:bg-[#D94D00] text-white px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all hover:shadow-md"
              >
                <span>{ad.buttonText || 'Shop Offers'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <Link
                to={href}
                className="inline-flex items-center gap-2 rounded-full bg-[#F36B0A] hover:bg-[#D94D00] text-white px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all hover:shadow-md"
              >
                <span>{ad.buttonText || 'Shop Offers'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
