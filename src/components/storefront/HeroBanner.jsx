import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { WhatsAppIcon } from '../common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppLink, DEFAULT_WHATSAPP_NUMBER } from '../../utils/whatsapp';

export default function HeroBanner() {
  const { heroSlides, settings } = useStore();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (!heroSlides || heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides]);

  if (!heroSlides || heroSlides.length === 0) return null;

  const currentSlide = heroSlides[currentSlideIndex] || heroSlides[0];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber || DEFAULT_WHATSAPP_NUMBER,
    'Hello Home & More Furniture, I am interested in your showroom furniture collections. Please share available options and delivery details in Abuja.'
  );

  return (
    <section
      className="relative w-full overflow-hidden bg-[#1D120C] group"
      aria-label="Featured Showroom Showcase"
    >
      {/* Full-Bleed Architectural Room Image */}
      <div className="relative w-full min-h-[460px] sm:min-h-[540px] lg:min-h-[600px] flex items-end">
        <img
          key={currentSlide.image}
          src={currentSlide.image}
          alt={`${currentSlide.headingStart} ${currentSlide.headingAccent}`}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
        />

        {/* Restrained Architectural Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/85 via-[#1A0F0A]/35 to-[#1A0F0A]/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0F0A]/75 via-[#1A0F0A]/25 to-transparent" />

        {/* Content Overlay */}
        <div className="container-page relative z-10 py-12 sm:py-16 lg:py-20">
          <div className="max-w-xl space-y-4 sm:space-y-5">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#24150F]/80 backdrop-blur-sm border border-[#F36B0A]/50 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFB27A]">
              {currentSlide.eyebrow}
            </span>

            <h1 className="font-editorial text-3xl sm:text-5xl lg:text-[56px] font-semibold text-white leading-[1.1] tracking-tight">
              {currentSlide.headingStart}{' '}
              <span className="text-[#F36B0A] italic">{currentSlide.headingAccent}</span>
            </h1>

            <p className="text-sm sm:text-base text-white/85 font-light leading-relaxed max-w-lg">
              {currentSlide.subtitle}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to={currentSlide.secondaryLink || '/shop'}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F36B0A] hover:bg-[#D94D00] text-white px-7 py-3.5 text-sm font-semibold shadow-lg transition-all hover:-translate-y-0.5"
              >
                <span>{currentSlide.secondaryCta || 'Explore Collection'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/95 hover:bg-white text-[#24150F] px-6 py-3.5 text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="w-4 h-4 fill-[#1EAA52]" />
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Minimal Bottom Slide Indicators */}
          {heroSlides.length > 1 && (
            <div className="flex items-center gap-2.5 mt-8">
              {heroSlides.map((slide, i) => (
                <button
                  key={slide.id || i}
                  type="button"
                  onClick={() => setCurrentSlideIndex(i)}
                  aria-label={`View slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentSlideIndex
                      ? 'w-10 bg-[#F36B0A]'
                      : 'w-4 bg-white/40 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Subtle Desktop Carousel Arrows */}
        {heroSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous slide"
              className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-[#F36B0A] text-white items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next slide"
              className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-[#F36B0A] text-white items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
