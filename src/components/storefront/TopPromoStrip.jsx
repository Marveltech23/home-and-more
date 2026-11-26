import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { sanitizeUrl } from '../../utils/security';

export default function TopPromoStrip() {
  const { activeAds } = useStore();

  const topAds = activeAds ? activeAds.filter((a) => a.placement === 'top_banner') : [];
  const ad = topAds[0];

  if (!ad) return null;

  const desktopImg = ad.desktopImage || ad.mobileImage;
  const mobileImg = ad.mobileImage || ad.desktopImage;
  const href = sanitizeUrl(ad.buttonUrl, '/shop');
  const isExternal = /^https?:\/\//i.test(href);

  const isPlaceholder =
    !desktopImg ||
    (typeof desktopImg === 'string' &&
      (desktopImg.startsWith('/images/stock/') || desktopImg.includes('images.unsplash.com')));

  const content = !isPlaceholder ? (
    <div className="w-full overflow-hidden bg-[#24150F] border-b border-[#EAE2D9]">
      {/* Desktop: exact 1024x57 (18:1) slim full-width graphic strip */}
      <img
        src={desktopImg}
        alt={ad.title || 'Promotional Banner'}
        className="hidden sm:block w-full aspect-[1024/57] object-cover"
      />
      {/* Mobile: uses mobileImage if provided, otherwise cleanly scales desktop strip */}
      <img
        src={mobileImg}
        alt={ad.title || 'Promotional Banner'}
        className="block sm:hidden w-full h-auto max-h-20 object-cover"
      />
    </div>
  ) : (
    /* Styled 1024x57 (18:1) placeholder strip until Admin uploads a custom graphic */
    <div className="w-full sm:aspect-[1024/57] min-h-[44px] bg-gradient-to-r from-[#24150F] via-[#7A2208] to-[#24150F] text-white border-b border-[#F36B0A]/30 flex items-center justify-center px-4 py-2 overflow-hidden">
      <div className="container-page flex items-center justify-center gap-3 sm:gap-5 text-center">
        <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full bg-[#F36B0A] text-white text-[10px] font-bold uppercase tracking-[0.16em] shrink-0">
          {ad.subtitle || 'Festive Sale'}
        </span>
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-white truncate">
          <span className="font-editorial text-[#FFD4A8] mr-1.5">{ad.title || 'Christmas Sale'}</span>
          <span className="text-white/90 font-normal">
            — {ad.tagline || ad.description || 'Special festive offers on luxury living, dining & bedroom furniture'}
          </span>
        </p>
        <span className="inline-flex items-center gap-1 rounded-full bg-white text-[#24150F] hover:bg-[#FAF7F3] px-3 py-1 text-[10px] sm:text-xs font-bold shrink-0 transition-colors">
          <span>{ad.buttonText || 'Shop Now'}</span>
          <ArrowRight className="w-3 h-3 text-[#F36B0A]" />
        </span>
      </div>
    </div>
  );

  return (
    <section className="w-full" aria-label={ad.title || 'Top Promotional Banner'}>
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full">
          {content}
        </a>
      ) : (
        <Link to={href} className="block w-full">
          {content}
        </Link>
      )}
    </section>
  );
}
