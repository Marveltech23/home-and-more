import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import { useStore } from '../../context/StoreContext';

function getInitials(name = '') {
  const cleaned = name.replace(/^(Mr\.?|Mrs\.?|Ms\.?|Dr\.?|Chief|Alh\.?)\s+/i, '').trim();
  const parts = (cleaned || name).split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (parts[0]?.slice(0, 2) || 'HM').toUpperCase();
}

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
    <section
      className="py-14 sm:py-16 bg-white border-t border-[#EAE2D9]"
      aria-label="Customer Testimonials"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="Client Stories"
          title="Trusted by Abuja Homeowners"
          subtitle="Verified feedback from residential and commercial clients across Nigeria."
        >
          {total > 2 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EAE2D9] bg-white text-[#24150F] hover:border-[#F36B0A] hover:text-[#F36B0A] transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next testimonial"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EAE2D9] bg-white text-[#24150F] hover:border-[#F36B0A] hover:text-[#F36B0A] transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleTestimonials.map((t) => (
            <article
              key={t.id}
              className="p-6 sm:p-7 rounded-xl bg-[#FAF7F3] border border-[#EAE2D9] flex flex-col sm:flex-row items-center sm:items-start gap-5"
            >
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-[#EAE2D9] flex items-center justify-center shadow-xs">
                  <span className="font-editorial text-lg sm:text-xl font-semibold text-[#F36B0A]">
                    {getInitials(t.name)}
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < t.rating
                            ? 'fill-[#F36B0A] text-[#F36B0A]'
                            : 'fill-stone-200 text-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#786B62]">
                    <CheckCircle2 className="w-3 h-3 text-[#1EAA52]" />
                    Verified Client
                  </span>
                </div>

                <p className="text-[#24150F] text-sm leading-relaxed italic">
                  "{t.quote}"
                </p>

                <div className="mt-4 pt-3 border-t border-[#EAE2D9]">
                  <h4 className="font-semibold text-xs sm:text-sm text-[#24150F]">
                    {t.name}
                    {t.location && (
                      <span className="font-normal text-xs text-[#786B62]"> — {t.location}</span>
                    )}
                  </h4>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
