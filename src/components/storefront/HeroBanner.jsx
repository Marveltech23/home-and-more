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
    <section className="relative overflow-hidden bg-[#FFFAF5] pt-6 pb-10 sm:py-12 lg:py-14">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-center lg:text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#F36B0A] uppercase">
                {currentSlide.eyebrow}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#24150F] tracking-tight leading-[1.15]">
              {currentSlide.headingStart}{' '}
              <span className="text-[#F36B0A]">{currentSlide.headingAccent}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#82746B] font-medium max-w-lg mx-auto lg:mx-0">
              {currentSlide.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#F36B0A] to-[#D94D00] text-white px-7 py-3.5 text-base font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                <span>Buy via WhatsApp</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              {currentSlide.secondaryLink && (
                <Link
                  to={currentSlide.secondaryLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#F0DFD1] bg-white px-6 py-3.5 text-sm font-semibold text-[#24150F] hover:border-[#F36B0A] hover:text-[#F36B0A] hover:bg-[#FFF3EA]/40 transition-all duration-200"
                >
                  <span>{currentSlide.secondaryCta || 'Discover Collection'}</span>
                </Link>
              )}
            </div>

            {/* Carousel Navigation Dots */}
            {heroSlides.length > 1 && (
              <div className="flex items-center justify-center lg:justify-start gap-2 pt-4">
                {heroSlides.map((slide, i) => (
                  <button
                    key={slide.id || i}
                    type="button"
                    onClick={() => setCurrentSlideIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2.5 transition-all duration-300 rounded-full ${
                      i === currentSlideIndex
                        ? 'w-8 bg-[#F36B0A]'
                        : 'w-2.5 bg-[#F0DFD1] hover:bg-[#82746B]'
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
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F8EBDD] to-[#F36B0A]/10 rounded-3xl -rotate-1 transform scale-102 filter blur-sm pointer-events-none" />

              <div className="relative rounded-3xl overflow-hidden border border-[#F0DFD1] shadow-2xl bg-white aspect-[4/3] sm:aspect-[16/11]">
                <SafeImage
                  src={currentSlide.image}
                  alt={currentSlide.headingStart || 'Living room furniture'}
                  aspectRatio="aspect-auto"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
