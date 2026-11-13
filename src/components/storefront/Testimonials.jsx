import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import SafeImage from '../common/SafeImage';
import { useStore } from '../../context/StoreContext';

export default function Testimonials() {
  const { publishedTestimonials } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Show 2 testimonials at a time on desktop, 1 on mobile
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
    <section className="container-page mt-14 sm:mt-16" aria-label="Customer Testimonials">
      <SectionHeading
        title="What Our Customers Say"
        subtitle="Real stories from homeowners and designers in Abuja"
      >
        {total > 2 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F0DFD1] bg-white text-[#24150F] hover:bg-[#F8EBDD] hover:text-[#F36B0A] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F0DFD1] bg-white text-[#24150F] hover:bg-[#F8EBDD] hover:text-[#F36B0A] transition-colors"
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
            className="card p-6 sm:p-7 flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all duration-300 hover:shadow-card-hover"
          >
            {/* Avatar */}
            <div className="shrink-0">
              <SafeImage
                src={t.photo}
                alt={t.name}
                aspectRatio="aspect-square"
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover border-2 border-[#F36B0A]/30 shadow-md"
              />
            </div>

            {/* Testimonial Quote & Info */}
            <div className="flex-1 flex flex-col justify-between text-center sm:text-left">
              <div>
                <p className="text-[#24150F] text-sm sm:text-base italic leading-relaxed font-normal">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#F0DFD1] pt-3">
                <div>
                  <h4 className="font-bold text-sm text-[#24150F]">
                    {t.name}
                    {t.location && (
                      <span className="font-normal text-xs text-[#82746B]">, {t.location}</span>
                    )}
                  </h4>
                </div>

                {/* Stars */}
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < t.rating
                          ? 'fill-[#F36B0A] text-[#F36B0A]'
                          : 'fill-stone-200 text-stone-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
