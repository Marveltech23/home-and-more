import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

const collections = [
  {
    id: 'col-1',
    title: 'The Living Sanctuary',
    subtitle: 'Low-slung curved bouclé sectionals paired with natural honed travertine center tables.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
    link: '/category/sofa-sets',
    tag: 'Architectural Seating',
  },
  {
    id: 'col-2',
    title: 'Restful Master Bedroom',
    subtitle: '7-foot channeled acoustic velvet headboards and concealed hydraulic storage beds.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85',
    link: '/category/bedroom-sets',
    tag: 'Rest & Wellness',
  },
  {
    id: 'col-3',
    title: 'Banquet & Dining Spaces',
    subtitle: 'Solid kiln-dried Nigerian teak and sintered marble slabs seating up to 12 guests.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=85',
    link: '/category/dining-sets',
    tag: 'Communal Feasts',
  },
];

export default function FeaturedCollections() {
  return (
    <section className="container-page mt-16 sm:mt-24" aria-label="Curated Living Suites">
      <SectionHeading
        eyebrow="EDITORIAL CURATION"
        title="Complete Interior Suites"
        subtitle="Thoughtfully harmonized furniture ensembles curated to elevate modern Nigerian architecture."
        actionLabel="Explore All Suites"
        actionTo="/shop"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {collections.map((col) => (
          <Link
            key={col.id}
            to={col.link}
            className="group relative overflow-hidden aspect-[3/4] bg-[#EFECE6] border border-[#E8E3DA] transition-all duration-500 hover:border-[#B89358]"
          >
            {/* Background Photography */}
            <img
              src={col.image}
              alt={col.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-[0.93]"
              loading="lazy"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1815]/90 via-[#1C1815]/35 to-transparent transition-opacity group-hover:opacity-95" />

            {/* Editorial Category Tag */}
            <div className="absolute top-6 left-6">
              <span className="text-[10px] uppercase tracking-ultra-caps text-white/90 bg-[#1C1815]/80 backdrop-blur-xs px-3 py-1 border border-white/15">
                {col.tag}
              </span>
            </div>

            {/* Bottom Typographic Layout */}
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col justify-end text-white space-y-2">
              <h3 className="font-luxury-serif text-2xl sm:text-3xl font-light tracking-tight group-hover:text-amber-200 transition-colors">
                {col.title}
              </h3>
              <p className="text-xs text-white/75 font-light leading-relaxed line-clamp-2">
                {col.subtitle}
              </p>
              <div className="pt-2 inline-flex items-center gap-2 text-xs uppercase tracking-wide-caps text-amber-200 font-semibold group-hover:text-white transition-colors">
                <span>Explore Suite</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
