import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

const rooms = [
  {
    id: 'room-living',
    title: 'Living Room',
    subtitle: 'Signature 7-seater sofa sets, corner sectionals & sculptural center tables',
    image: '/images/catalog/kali-sofa-set.jpeg',
    link: '/category/sofa-sets',
    cta: 'Shop Living Room',
  },
  {
    id: 'room-bedroom',
    title: 'Master Bedroom',
    subtitle: 'Quilted arched-headboard suites, matching benches & serene sanctuaries',
    image: '/images/catalog/milano-bed-set.jpeg',
    link: '/category/bedroom-sets',
    cta: 'Shop Bedroom',
  },
  {
    id: 'room-dining',
    title: 'Dining & Executive',
    subtitle: 'Sintered marble dining suites, solid teak tables & director offices',
    image: '/images/stock/photo-1617806118233-18e1de247200.jpg',
    link: '/category/dining-sets',
    cta: 'Shop Dining Room',
  },
];

export default function FeaturedCollections() {
  return (
    <section className="container-page py-14 sm:py-16" aria-label="Shop By Room">
      <SectionHeading
        align="center"
        eyebrow="Curated Spaces"
        title="Shop by Room"
        subtitle="Explore complete furniture compositions designed to bring harmony to every corner of your home."
        actionLabel="Browse All Rooms"
        actionTo="/shop"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {rooms.map((room) => (
          <Link
            key={room.id}
            to={room.link}
            className="group relative overflow-hidden rounded-xl aspect-[4/5] bg-[#24150F] border border-[#EAE2D9]"
          >
            <img
              src={room.image}
              alt={room.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/90 via-[#1A0F0A]/25 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 space-y-2">
              <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-white">
                {room.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed font-light">
                {room.subtitle}
              </p>
              <div className="pt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white border-b border-[#F36B0A] pb-1 group-hover:text-[#F36B0A] transition-colors">
                <span>{room.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
