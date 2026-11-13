import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function PromotionalAd() {
  const { activeAds } = useStore();

  // Find the active advertisement for hero_bottom placement, or use the first active ad
  const ad = activeAds.find((a) => a.placement === 'hero_bottom') || activeAds[0];

  if (!ad) return null;

  return (
    <section className="container-page mt-4 sm:mt-6" aria-label="Promotional Offer">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#29160D] via-[#3d1a0d] to-[#241209] text-white shadow-xl border border-amber-900/40">
        {/* Subtle festive background pattern / lights */}
        <div className="absolute inset-0 bg-[radial-gradient(#F36B0A_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        {/* Ambient glow orbs */}
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#F36B0A]/30 blur-3xl pointer-events-none" />
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 p-6 sm:p-8 lg:p-10">
          {/* Left: Decorative Festive Artwork / Image */}
          <div className="lg:col-span-3 flex items-center justify-center lg:justify-start">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/30">
              <img
                src={ad.desktopImage}
                alt={ad.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>

          {/* Center: Title & Tagline */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-1 sm:space-y-2">
            <div className="font-script text-4xl sm:text-5xl text-amber-300 drop-shadow-sm">
              {ad.title}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-white">
              {ad.subtitle || 'Special Offers'}
            </div>
            <p className="text-xs sm:text-sm text-amber-100/80 font-medium">
              {ad.tagline || 'Upgrade Your Home This Festive Season'}
            </p>
          </div>

          {/* Right: CTA & Discount description */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center text-center lg:text-right space-y-3">
            <p className="text-sm sm:text-base font-semibold text-white/95 max-w-xs">
              {ad.description || 'Get Amazing Discounts on Premium Furniture'}
            </p>

            <Link
              to={ad.buttonUrl || '/shop'}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F36B0A] to-[#D94D00] text-white px-6 py-3 text-sm font-bold shadow-lg shadow-orange-950/40 hover:brightness-110 hover:scale-105 transition-all duration-200"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{ad.buttonText || 'Shop Christmas Offers'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
