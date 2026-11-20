import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import SafeImage from '../common/SafeImage';
import { useStore } from '../../context/StoreContext';

export default function Testimonials() {
  const { publishedTestimonials } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = publishedTestimonials.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, total - 2) : Math.max(0, prev - 1)));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= total - 2 ? 0 : prev + 1));
  };

  const visibleTestimonials = publishedTestimonials.slice(currentIndex, currentIndex + 2);

  if (publishedTestimonials.length === 0) return null;

  return (
    <section className="container-page mt-16 sm:mt-24" aria-label="Client Endorsements">
      <SectionHeading
        eyebrow="RESIDENCES &amp; COMMISSIONS"
        title="Private Client Endorsements"
        subtitle="Reflections from homeowners, interior designers, and architects across Abuja and Lagos."
      >
        {total > 2 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous endorsement"
              className="flex h-9 w-9 items-center justify-center border border-[#E8E3DA] bg-white text-[#1C1815] hover:border-black transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next endorsement"
              className="flex h-9 w-9 items-center justify-center border border-[#E8E3DA] bg-white text-[#1C1815] hover:border-black transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {visibleTestimonials.map((t) => (
          <article
            key={t.id}
            className="p-8 sm:p-10 bg-white border border-[#E8E3DA] flex flex-col justify-between space-y-6 transition-all duration-300 hover:border-[#B89358]"
          >
            {/* Quote Body */}
            <div className="space-y-4">
              <Quote className="w-8 h-8 text-[#B89358]/40" />
              <p className="font-luxury-serif text-xl sm:text-2xl font-light italic leading-relaxed text-[#1C1815]">
                "{t.quote}"
              </p>
            </div>

            {/* Client Signature Area */}
            <div className="flex items-center justify-between border-t border-[#E8E3DA] pt-4">
              <div className="flex items-center gap-4">
                {t.photo && (
                  <div className="w-11 h-11 shrink-0 overflow-hidden bg-[#EFECE6] border border-[#E8E3DA]">
                    <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h4 className="font-sans font-semibold text-xs uppercase tracking-wider text-[#1C1815]">
                    {t.name}
                  </h4>
                  {t.location && (
                    <span className="text-[11px] text-[#7A7268] block">
                      {t.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < t.rating ? 'fill-[#B89358] text-[#B89358]' : 'fill-[#E8E3DA] text-[#E8E3DA]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
