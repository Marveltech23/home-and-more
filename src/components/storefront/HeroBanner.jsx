import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '../common/BrandIcons';
import SafeImage from '../common/SafeImage';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function HeroBanner() {
  const { heroSlides, settings } = useStore();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (!heroSlides || heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides]);

  if (!heroSlides || heroSlides.length === 0) return null;

  const currentSlide = heroSlides[currentSlideIndex] || heroSlides[0];

  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber,
    `${settings.whatsappGreeting} your current collection.`
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#FFFDFB] to-[#FAF8F5] pt-8 pb-12 sm:py-16 lg:py-20 border-b border-[#EDE5DC]/60">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-center lg:text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-[#E05A00] uppercase bg-[#FDF5EF] px-3.5 py-1 rounded-full border border-[#E05A00]/20">
                {currentSlide.eyebrow}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F1612] tracking-tight leading-[1.12]">
              {currentSlide.headingStart}{' '}
              <span className="text-[#E05A00]">{currentSlide.headingAccent}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#7A6E65] font-normal leading-relaxed max-w-lg mx-auto lg:mx-0">
              {currentSlide.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#E05A00] to-[#C84800] text-white px-8 py-3.5 text-base font-semibold shadow-md shadow-orange-900/15 hover:shadow-lg hover:shadow-orange-900/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                <span>Buy via WhatsApp</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              {currentSlide.secondaryLink && (
                <Link
                  to={currentSlide.secondaryLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#EDE5DC] bg-white px-7 py-3.5 text-sm font-semibold text-[#1F1612] hover:border-[#E05A00] hover:text-[#E05A00] hover:bg-[#FDF5EF] shadow-xs hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>{currentSlide.secondaryCta || 'Discover Collection'}</span>
                </Link>
              )}
            </div>

            {/* Carousel Navigation Dots */}
            {heroSlides.length > 1 && (
              <div className="flex items-center justify-center lg:justify-start gap-2.5 pt-4">
                {heroSlides.map((slide, i) => (
                  <button
                    key={slide.id || i}
                    type="button"
                    onClick={() => setCurrentSlideIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 transition-all duration-300 rounded-full ${
                      i === currentSlideIndex
                        ? 'w-8 bg-[#E05A00]'
                        : 'w-2 bg-[#EDE5DC] hover:bg-[#7A6E65]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Hero Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F6EFE8] to-[#E05A00]/10 rounded-3xl -rotate-1 transform scale-102 filter blur-md pointer-events-none" />

              <div className="relative rounded-3xl overflow-hidden border border-[#EDE5DC] shadow-[0_20px_50px_-12px_rgba(32,22,17,0.12)] bg-white aspect-[4/3] sm:aspect-[16/11]">
                <SafeImage
                  src={currentSlide.image}
                  alt={currentSlide.headingStart || 'Living room furniture'}
                  aspectRatio="aspect-auto"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-103"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
