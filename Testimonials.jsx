import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorState from '../common/ErrorState';
import { useTestimonials } from '../../features/testimonials/testimonial.queries';

function Avatar({ name, src }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-2xl font-semibold text-white sm:h-24 sm:w-24">
        {name.replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, '').charAt(0)}
      </span>
    );
  }
  return (
    <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} className="h-20 w-20 shrink-0 rounded-full object-cover sm:h-24 sm:w-24" />
  );
}

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`h-4 w-4 ${n <= rating ? 'fill-brand text-brand' : 'text-line'}`} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { data: items, isLoading, isError, refetch } = useTestimonials();
  const [start, setStart] = useState(0);
  const n = items?.length ?? 0;

  if (!isLoading && !isError && n === 0) return null; // nothing published yet - hide the section

  const visible = n ? [items[start % n], ...(n > 1 ? [items[(start + 1) % n]] : [])] : [];
  const step = (d) => setStart((s) => (s + d + n) % n);

  return (
    <section className="container-page mt-10">
      <SectionHeading title="What Our Customers Say">
        {n > 1 && (
          <div className="flex gap-2">
            <button onClick={() => step(-1)} aria-label="Previous testimonial" className="rounded-full border border-line bg-white p-2 text-ink shadow-card hover:text-brand">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => step(1)} aria-label="Next testimonial" className="rounded-full border border-line bg-white p-2 text-ink shadow-card hover:text-brand">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </SectionHeading>
      {isLoading && <LoadingSpinner label="Loading reviews..." />}
      {isError && <ErrorState onRetry={refetch} />}
      <div className="grid gap-4 md:grid-cols-2" aria-live="polite">
        {visible.map((t, i) => (
          <figure key={`${t.id}-${i}`} className={`card items-center gap-5 p-4 sm:p-5 ${i === 1 ? 'hidden md:flex' : 'flex'}`}>
            <Avatar name={t.name} src={t.photo} />
            <div className="flex-1">
              <blockquote className="text-sm italic text-ink sm:text-[0.95rem]">“{t.quote}”</blockquote>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <figcaption className="text-sm font-semibold text-ink">
                  — {t.name}{t.location && `, ${t.location}`}
                </figcaption>
                <Stars rating={t.rating} />
              </div>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
