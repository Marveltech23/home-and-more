import SectionHeading from '../common/SectionHeading';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';
import { useStore } from '../../context/StoreContext';

export default function PopularPicks() {
  const { featuredProducts, products, settings } = useStore();
  const publishedFallback = products.filter(
    (p) => p.status === 'published' && !featuredProducts.some((fp) => fp.id === p.id)
  );
  const displayProducts = [...featuredProducts, ...publishedFallback].slice(0, 8);

  return (
    <section className="container-page mt-14 sm:mt-16" aria-label="Our Popular Picks">
      <SectionHeading
        title="Our Popular Picks"
        actionLabel="Shop All"
        actionTo="/shop"
      />

      {displayProducts.length === 0 ? (
        <EmptyState
          title="No featured products yet"
          message="Products marked as featured in the admin dashboard will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} settings={settings} />
          ))}
        </div>
      )}
    </section>
  );
}
