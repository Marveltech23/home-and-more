import SectionHeading from '../common/SectionHeading';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorState from '../common/ErrorState';
import EmptyState from '../common/EmptyState';
import ProductCard from './ProductCard';
import { useFeaturedProducts } from '../../features/products/product.queries';

export default function PopularPicks({ settings }) {
  const { data: products, isLoading, isError, refetch } = useFeaturedProducts({ limit: 4 });

  return (
    <section className="container-page mt-10">
      <SectionHeading title="Our Popular Picks" actionLabel="Shop All" actionTo="/shop" />
      {isLoading && <LoadingSpinner label="Loading products..." />}
      {isError && <ErrorState onRetry={refetch} />}
      {!isLoading && !isError && products?.length === 0 && (
        <EmptyState title="No featured products yet" message="Products marked as featured in the admin dashboard will appear here." />
      )}
      {products?.length > 0 && (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} settings={settings} />
          ))}
        </div>
      )}
    </section>
  );
}
