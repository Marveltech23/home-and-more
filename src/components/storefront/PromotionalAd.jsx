import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AdBannerRenderer from './AdBannerRenderer';
import { useStore } from '../../context/StoreContext';

function isWithinSchedule(ad) {
  if (!ad) return false;
  const today = new Date().toISOString().split('T')[0];
  if (ad.startDate && ad.startDate > today) return false;
  if (ad.endDate && ad.endDate < today) return false;
  return true;
}

/**
 * Full-Width Panoramic Middle Promotional Carousel (1024x318 / 1920x600 ratio).
 * - Displays 1 to 5 active middle promotional slides configured in Admin.
 * - Admin controls both which slides are enabled AND the exact max count shown on frontend.
 * - Smooth horizontal left/right slide transitions, touch swipe on mobile,
 *   auto-advance (pauses on hover), frosted arrows, and progress indicator pills.
 */
export default function PromotionalAd() {
  const { advertisements, settings } = useStore();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const maxSlides = Math.min(5, Math.max(1, Number(settings?.middleCarouselMaxSlides) || 5));

  const slides = (advertisements || [])
    .filter(
      (a) =>
        a.placement !== 'top_banner' &&
        a.slotPosition !== 'top_banner' &&
        a.isActive !== false &&
        a.status !== 'draft' &&
        isWithinSchedule(a)
    )
    .sort((a, b) => (Number(a.slideOrder) || 99) - (Number(b.slideOrder) || 99))
    .slice(0, maxSlides);

  const total = slides.length;
  const safeIndex = total > 0 ? current % total : 0;

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(goNext, 5500);
    return () => clearInterval(timer);
  }, [total, isPaused, goNext]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches?.[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || total <= 1) return;
    const endX = e.changedTouches?.[0]?.clientX ?? touchStartX.current;
    const delta = touchStartX.current - endX;
    touchStartX.current = null;
    if (Math.abs(delta) > 40) {
      if (delta > 0) goNext();
      else goPrev();
    }
  };

  if (total === 0) return null;

  return (
    <section
      className="container-page pb-14 sm:pb-16"
      aria-label="Featured Showroom Promotions Carousel"
    >
      <div
        className="relative group rounded-2xl overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Horizontal Sliding Track */}
        <div
          className="flex transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {slides.map((ad) => (
            <div key={ad.id} className="w-full shrink-0">
              <AdBannerRenderer ad={ad} isSingleFullWidth />
            </div>
          ))}
        </div>

        {/* Left / Right Navigation Arrows (when 2+ slides) */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous promotion slide"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/35 hover:bg-[#F36B0A] text-white backdrop-blur-md border border-white/20 shadow-md transition-all sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next promotion slide"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/35 hover:bg-[#F36B0A] text-white backdrop-blur-md border border-white/20 shadow-md transition-all sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Bottom Indicator Bars + Slide Counter */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/15">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrent(idx);
                  }}
                  aria-label={`Go to promotion slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === safeIndex
                      ? 'w-7 bg-[#F36B0A]'
                      : 'w-2 bg-white/55 hover:bg-white/90'
                  }`}
                />
              ))}
              <span className="ml-1 text-[10px] font-bold text-white/90 tabular-nums">
                {safeIndex + 1}/{total}
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
