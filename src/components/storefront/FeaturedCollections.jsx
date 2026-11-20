import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

const collections = [
  {
    id: 'col-1',
    title: 'Living Room Sanctuary',
    subtitle: 'Warm terracotta, cloud sectionals & travertine tables',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    link: '/category/sofa-sets',
    tag: 'Curated Trend',
  },
  {
    id: 'col-2',
    title: 'Restful Bedroom Oasis',
    subtitle: 'Channeled velvet beds & orthopedic mattress support',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    link: '/category/bedroom-sets',
    tag: 'Rest & Wellness',
  },
  {
    id: 'col-3',
    title: 'Artisan Dining Space',
    subtitle: 'Solid teak dining sets & linen upholstered chairs',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
    link: '/category/dining-sets',
    tag: 'Gatherings',
  },
];

export default function FeaturedCollections() {
  return (
    <section className="container-page mt-14 sm:mt-16" aria-label="Featured Collections">
      <SectionHeading
        title="Featured Collections"
        subtitle="Thoughtfully styled furniture sets designed to inspire modern homes"
        actionLabel="Explore All"
        actionTo="/shop"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((col) => (
          <Link
            key={col.id}
            to={col.link}
            className="group relative overflow-hidden rounded-3xl aspect-[4/5] sm:aspect-[3/4] shadow-card hover:shadow-card-hover transition-all duration-300"
          >
            {/* Background Image */}
            <img
              src={col.image}
              alt={col.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#29160D] via-[#29160D]/40 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />

            {/* Tag Badge */}
            <div className="absolute top-5 left-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white border border-white/30">
                <Sparkles className="w-3 h-3 text-[#F36B0A]" />
                {col.tag}
              </span>
            </div>

            {/* Text & Action */}
            <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end text-white">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-1 group-hover:text-[#F36B0A] transition-colors">
                {col.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 mb-4 line-clamp-2">
                {col.subtitle}
              </p>
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-300 group-hover:text-white transition-colors">
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
