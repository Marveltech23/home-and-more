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

  // Guarantee every category tile always resolves to a valid image from Media Library / catalog
  const resolveCategoryImage = (category, index) => {
    if (category.image && typeof category.image === 'string' && category.image.trim()) {
      return category.image;
    }
    const matchingProduct = (products || []).find(
      (p) => p.categorySlug === category.slug && p.image
    );
    if (matchingProduct?.image) return matchingProduct.image;

    const mediaFallback = mediaPool[index % mediaPool.length]?.url;
    return mediaFallback || DEFAULT_FALLBACK_IMAGE;
  };

  return (
    <section className="container-page mt-14 sm:mt-16" aria-label="Shop by Category">
      <SectionHeading
        title="Shop by Category"
        actionLabel="View All Categories"
        actionTo="/shop"
      />

      {/* Responsive Grid for Any Number of Categories */}
      <div className="grid grid-cols-2 min-[420px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4">
        {activeCategories.map((category, idx) => {
          const imgSrc = resolveCategoryImage(category, idx);
          const fallbackSrc =
            mediaPool[idx % mediaPool.length]?.url || DEFAULT_FALLBACK_IMAGE;

          return (
            <Link
              key={category.id || category.slug}
              to={`/category/${category.slug}`}
              className="group flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
            >
              {/* Rounded Pill Card */}
              <div className="w-full aspect-square rounded-2xl sm:rounded-3xl bg-white border border-[#F0DFD1] p-2 sm:p-2.5 flex items-center justify-center shadow-card group-hover:shadow-card-hover group-hover:border-[#F36B0A]/40 transition-all overflow-hidden">
                <SafeImage
                  src={imgSrc}
                  fallbackSrc={fallbackSrc}
                  alt={category.name}
                  fit="cover"
                  aspectRatio="aspect-square"
                  className="w-full h-full rounded-xl sm:rounded-2xl transition-transform duration-300 group-hover:scale-108"
                />
              </div>

              {/* Label */}
              <span className="mt-2.5 text-xs sm:text-sm font-semibold text-[#24150F] group-hover:text-[#F36B0A] transition-colors leading-tight line-clamp-2 px-1">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
