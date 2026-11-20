import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { WhatsAppIcon } from '../common/BrandIcons';
import SafeImage from '../common/SafeImage';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function HeroBanner() {
  const { heroSlides, settings } = useStore();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-slide every 7 seconds
  useEffect(() => {
    if (!heroSlides || heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroSlides]);

  if (!heroSlides || heroSlides.length === 0) return null;

  const currentSlide = heroSlides[currentSlideIndex] || heroSlides[0];

  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber,
    `${settings.whatsappGreeting} your current collection: ${currentSlide.headingStart} ${currentSlide.headingAccent}.`
  );

  return (
    <section className="relative overflow-hidden bg-[#FBF9F5] border-b border-[#E8E3DA] py-10 sm:py-16 lg:py-20">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Editorial & Showroom Rationale (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-[#B89358]"></span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-ultra-caps text-[#B89358] uppercase">
                {currentSlide.eyebrow || 'Contemporary Luxury • 2026 Edition'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-luxury-serif text-4xl sm:text-6xl font-light text-[#1C1815] tracking-tight leading-[1.08]">
              {currentSlide.headingStart}{' '}
              <span className="italic font-normal">{currentSlide.headingAccent}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#5C554E] font-light leading-relaxed max-w-lg">
              {currentSlide.subtitle || 'Sculptural curved sectionals, travertine monolithic tables, and seasoned teak crafted for Nigeria’s finest residences.'}
            </p>

            {/* Showroom Credential */}
            <div className="flex items-center gap-2 text-xs text-[#7A7268] pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#B89358]" />
              <span>Available to experience in person at our Gwarinpa Showroom, Abuja.</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                to={currentSlide.secondaryLink || '/shop'}
                className="btn-primary text-center"
              >
                <span>{currentSlide.secondaryCta || 'Discover Collection'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>

              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-center"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                <span>Showroom Concierge</span>
              </a>
            </div>

            {/* Architectural Slide Progress Indicators */}
            {heroSlides.length > 1 && (
              <div className="flex items-center gap-3 pt-6 border-t border-[#E8E3DA]">
                {heroSlides.map((slide, i) => (
                  <button
                    key={slide.id || i}
                    type="button"
                    onClick={() => setCurrentSlideIndex(i)}
                    aria-label={`Slide ${i + 1}`}
                    className="group py-2"
                  >
                    <div
                      className={`h-0.5 transition-all duration-500 ${
                        i === currentSlideIndex
                          ? 'w-12 bg-[#1C1815]'
                          : 'w-6 bg-[#E8E3DA] group-hover:bg-[#7A7268]'
                      }`}
                    />
                    <span className="text-[9px] font-mono uppercase text-[#9A9185] block mt-1">
                      0{i + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Architectural Furniture Photography (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/11] bg-[#EFECE6] overflow-hidden border border-[#E8E3DA] group">
              <SafeImage
                src={currentSlide.image}
                alt={`${currentSlide.headingStart} ${currentSlide.headingAccent}`}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-102"
              />

              {/* Subtle Ambient Corner Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1815]/30 via-transparent to-transparent pointer-events-none" />

              {/* Atelier Dimension & Origin Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-[11px] font-light">
                <span className="bg-[#1C1815]/85 backdrop-blur-xs px-3 py-1.5 border border-white/10 uppercase tracking-wider text-[10px]">
                  Kiln-Dried Hardwood &bull; Master Joinery
                </span>
                <span className="hidden sm:inline bg-white/90 text-[#1C1815] px-3 py-1.5 text-[10px] uppercase tracking-wide-caps font-semibold">
                  Abuja Stock
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
