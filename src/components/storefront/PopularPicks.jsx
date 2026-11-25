import { useState, useMemo } from 'react';
import SectionHeading from '../common/SectionHeading';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';
import { useStore } from '../../context/StoreContext';

const FILTER_TABS = [
  { id: 'all', label: 'All Popular' },
  { id: 'sofa-sets', label: 'Sofa sets' },
  { id: 'center-table', label: 'Center Table' },
  { id: 'bedroom-sets', label: 'Bedroom sets' },
  { id: 'single-chairs', label: 'Single chairs' },
];

export default function PopularPicks() {
  const { featuredProducts, products, settings } = useStore();
  const [activeTab, setActiveTab] = useState('all');

  const displayProducts = useMemo(() => {
    const published = (products || []).filter((p) => p.status === 'published');
    if (activeTab === 'all') {
      const fallback = published.filter(
        (p) => !featuredProducts.some((fp) => fp.id === p.id)
      );
      return [...featuredProducts, ...fallback].slice(0, 8);
    }
    const matching = published.filter((p) => p.categorySlug === activeTab);
    return matching.slice(0, 8);
  }, [activeTab, featuredProducts, products]);

  return (
    <section
      className="py-14 sm:py-16 bg-white border-y border-[#EAE2D9]"
      aria-label="Our Popular Picks"
    >
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="Selected For You"
          title="Our Popular Picks"
          subtitle="Showroom favorites ready for immediate delivery or custom upholstery in Abuja."
          actionLabel="Explore Full Catalog"
          actionTo="/shop"
        />

        {/* Baffi-Inspired Pill Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#24150F] text-white shadow-xs'
                    : 'bg-[#FAF7F3] text-[#24150F] border border-[#EAE2D9] hover:border-[#F36B0A] hover:text-[#F36B0A]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Preserved 2 x 4 Showroom Grid (8 Products on Desktop) */}
        {displayProducts.length === 0 ? (
          <EmptyState
            title="No featured products in this tab yet"
            message="Explore our full furniture catalog to see all available pieces."
            actionLabel="View All Furniture"
            actionTo="/shop"
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} settings={settings} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
