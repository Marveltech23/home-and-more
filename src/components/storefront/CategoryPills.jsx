import { Link } from 'react-router-dom';
import SectionHeading from '../common/SectionHeading';
import SafeImage from '../common/SafeImage';
import { useStore } from '../../context/StoreContext';
import { categories as initialCategories } from '../../data/categories';
import { mediaItems as initialMedia } from '../../data/media';

const DEFAULT_FALLBACK_IMAGE = '/images/catalog/diamond-sofa-set-1.jpeg';

export default function CategoryPills() {
  const { categories, products, media } = useStore();

  const activeCategories = (categories && categories.length > 0 ? categories : initialCategories)
    .filter((c) => c.isActive !== false)
    .sort((a, b) => (Number(a.displayOrder) || 99) - (Number(b.displayOrder) || 99));

  const mediaPool = media && media.length > 0 ? media : initialMedia;

  const resolveCategoryImage = (category, index) => {
    if (category.image && typeof category.image === 'string' && category.image.trim()) {
      return category.image;
    }
    const matchingProduct = (products || []).find(
      (p) => p.categorySlug === category.slug && p.image
    );
    if (matchingProduct?.image) return matchingProduct.image;
    return mediaPool[index % mediaPool.length]?.url || DEFAULT_FALLBACK_IMAGE;
  };

  return (
    <section className="container-page py-14 sm:py-16" aria-label="Shop by Category">
      <SectionHeading
        align="center"
        eyebrow="Curated Departments"
        title="Shop by Category"
        subtitle="Discover our most loved furniture departments, thoughtfully crafted for contemporary Nigerian homes."
        actionLabel="View All Furniture"
        actionTo="/shop"
      />

      {/* Clean Baffi-inspired Framed Category Grid */}
      <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {activeCategories.map((category, idx) => {
          const imgSrc = resolveCategoryImage(category, idx);
          const fallbackSrc = mediaPool[idx % mediaPool.length]?.url || DEFAULT_FALLBACK_IMAGE;

          return (
            <Link
              key={category.id || category.slug}
              to={`/category/${category.slug}`}
              className="group flex flex-col bg-white rounded-xl border border-[#EAE2D9] overflow-hidden hover:border-[#F36B0A]/60 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="w-full aspect-square overflow-hidden bg-[#FAF7F3]">
                <SafeImage
                  src={imgSrc}
                  fallbackSrc={fallbackSrc}
                  alt={category.name}
                  fit="cover"
                  aspectRatio="aspect-square"
                  className="w-full h-full transition-transform duration-500 group-hover:scale-106"
                />
              </div>

              <div className="px-2.5 py-3 text-center border-t border-[#EAE2D9]/60 bg-white">
                <span className="text-xs sm:text-[13px] font-semibold text-[#24150F] group-hover:text-[#F36B0A] transition-colors line-clamp-1">
                  {category.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
