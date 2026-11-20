import SectionHeading from '../common/SectionHeading';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';
import { useStore } from '../../context/StoreContext';

export default function PopularPicks() {
  const { featuredProducts, settings } = useStore();
  const displayProducts = featuredProducts.slice(0, 8);

  return (
    <section className="container-page mt-16 sm:mt-24" aria-label="Curated Furniture Pieces">
      <SectionHeading
        eyebrow="SHOWROOM HIGHLIGHTS"
        title="Pieces of Exceptional Craftsmanship"
        subtitle="Handcrafted living, dining, and bedroom furniture designed to anchor discerning Nigerian homes."
        actionLabel="Explore All Pieces"
        actionTo="/shop"
      />

      {displayProducts.length === 0 ? (
        <EmptyState
          title="No featured pieces yet"
          message="Products designated as showroom highlights will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} settings={settings} />
          ))}
        </div>
      )}
    </section>
  );
}
