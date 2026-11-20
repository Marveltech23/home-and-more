import { Link } from 'react-router-dom';
import SectionHeading from '../common/SectionHeading';
import SafeImage from '../common/SafeImage';
import { useStore } from '../../context/StoreContext';

export default function CategoryPills() {
  const { categories } = useStore();

  const activeCategories = (categories || [])
    .filter((c) => c.isActive !== false)
    .sort((a, b) => (Number(a.displayOrder) || 99) - (Number(b.displayOrder) || 99));

  return (
    <section className="container-page mt-16 sm:mt-20" aria-label="Shop by Category">
      <SectionHeading
        title="Shop by Category"
        subtitle="Explore our handcrafted suites curated for living, dining, and work"
        actionLabel="View All Categories"
        actionTo="/shop"
      />

      {/* Responsive Grid for Categories */}
      <div className="grid grid-cols-2 min-[420px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4">
        {activeCategories.map((category) => (
          <Link
            key={category.id || category.slug}
            to={`/category/${category.slug}`}
            className="group flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
          >
            {/* Rounded Card */}
            <div className="w-full aspect-square rounded-2xl sm:rounded-3xl bg-[#FAF7F4] border border-[#EDE5DC] p-3 sm:p-4 flex items-center justify-center shadow-card group-hover:shadow-card-hover group-hover:border-[#E05A00]/40 transition-all duration-300">
              <SafeImage
                src={category.image}
                alt={category.name}
                fit="contain"
                aspectRatio="aspect-square"
                className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-108"
              />
            </div>

            {/* Label */}
            <span className="mt-2.5 text-xs sm:text-sm font-semibold text-[#1F1612] group-hover:text-[#E05A00] transition-colors leading-tight line-clamp-2 px-1">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
