import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export default function TopPromoStrip() {
  const { activeAds } = useStore();

  const topAds = activeAds ? activeAds.filter((a) => a.placement === 'top_banner') : [];
  const ad = topAds[0];

  if (!ad) return null;

  const desktopImg = ad.desktopImage || ad.mobileImage;
  const mobileImg = ad.mobileImage || ad.desktopImage;
  const href = ad.buttonUrl || '/shop';
  const isExternal = /^https?:\/\//i.test(href);

  if (!desktopImg && !mobileImg) return null;

  const content = (
    <div className="w-full overflow-hidden bg-[#24150F] border-b border-[#EAE2D9]">
      {/* Desktop: exact 1024x57 (18:1) slim full-width strip */}
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
