import { Link } from 'react-router-dom';
import SectionHeading from '../common/SectionHeading';
import SafeImage from '../common/SafeImage';
import { useStore } from '../../context/StoreContext';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryPills() {
  const { categories } = useStore();

  const activeCategories = (categories || [])
    .filter((c) => c.isActive !== false)
    .sort((a, b) => (Number(a.displayOrder) || 99) - (Number(b.displayOrder) || 99));

  return (
    <section className="container-page mt-16 sm:mt-24" aria-label="Curated Categories">
      <SectionHeading
        eyebrow="DOMESTIC ENVIRONMENTS"
        title="Spaces of Repose &amp; Distinction"
        subtitle="Explore our 11 signature furniture collections, calibrated for architectural harmony and daily comfort."
        actionLabel="View All Collections"
        actionTo="/shop"
      />

      {/* Contemporary Luxury Architectural Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {activeCategories.map((category, index) => (
          <Link
            key={category.id || category.slug}
            to={`/category/${category.slug}`}
            className="group relative overflow-hidden aspect-[4/5] bg-[#EFECE6] border border-[#E8E3DA] flex flex-col justify-end p-5 sm:p-6 transition-all duration-500 hover:border-[#B89358]"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <SafeImage
                src={category.image}
                alt={category.name}
                fit="cover"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106 brightness-[0.92]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1815]/85 via-[#1C1815]/25 to-transparent transition-opacity group-hover:opacity-95" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 space-y-1 text-white">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-amber-200 uppercase">
                  {index < 9 ? `0${index + 1}` : index + 1}
                </span>
                <span className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="font-luxury-serif text-lg sm:text-2xl font-light tracking-tight group-hover:text-amber-200 transition-colors">
                {category.name}
              </h3>

              <p className="text-[11px] text-white/70 line-clamp-1 font-light hidden sm:block">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
