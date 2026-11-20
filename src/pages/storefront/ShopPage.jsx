import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, X, Check } from 'lucide-react';
import ProductCard from '../../components/storefront/ProductCard';
import SectionHeading from '../../components/common/SectionHeading';
import EmptyState from '../../components/common/EmptyState';
import SEO from '../../components/common/SEO';
import { useStore } from '../../context/StoreContext';
import { formatNaira } from '../../utils/format';

export default function ShopPage() {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'featured';
  const queryParam = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [priceRange, setPriceRange] = useState(3000000); // Up to ₦3,000,000 for luxury suites
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category state when URL changes
  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setPriceRange(3000000);
    setInStockOnly(false);
    setSearchParams({});
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.status !== 'published') return false;

        // Category filter
        if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) {
          return false;
        }

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description?.toLowerCase().includes(q);
          const matchesTagline = p.tagline?.toLowerCase().includes(q);
          const matchesMaterial = p.material?.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesTagline && !matchesMaterial) return false;
        }

        // Max price filter
        if (p.price > priceRange) return false;

        // Stock filter
        if (inStockOnly && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        // Default: featured first, then newest
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, priceRange, inStockOnly, sortBy]);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="container-page py-8 sm:py-14 space-y-8">
      <SEO
        title={activeCategoryObj ? `${activeCategoryObj.name} | Luxury Furniture Catalogue` : 'The Furniture Catalogue | Contemporary Luxury in Abuja'}
        description={
          activeCategoryObj?.description
            ? `${activeCategoryObj.description} Handcrafted in Abuja with white-glove nationwide delivery.`
            : 'Browse the complete Home & More Furniture collection. Handcrafted curved sectionals, solid teak dining tables, executive director desks, and glazed porcelain tiles.'
        }
        canonical={activeCategoryObj ? `/category/${activeCategoryObj.slug}` : '/shop'}
      />

      {/* Header Banner */}
      <div className="border-b border-[#E8E3DA] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-[10px] uppercase tracking-ultra-caps text-[#B89358] font-bold block">
            HOME &amp; MORE ATELIER
          </span>
          <h1 className="font-luxury-serif text-4xl sm:text-5xl font-light text-[#1C1815] tracking-tight">
            {activeCategoryObj ? activeCategoryObj.name : 'The Furniture Collection'}
          </h1>
          <p className="text-xs sm:text-sm text-[#7A7268] font-light leading-relaxed">
            {activeCategoryObj
              ? activeCategoryObj.description
              : 'Discover handcrafted, durable furniture for contemporary Nigerian residences. Calibrated in proportions, timber seasoning, and tactile upholstery.'}
          </p>
        </div>

        <div className="text-xs text-[#7A7268] font-mono">
          Showing {filteredProducts.length} curated {filteredProducts.length === 1 ? 'piece' : 'pieces'}
        </div>
      </div>

      {/* Horizontal Category Switcher Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 text-xs">
        <button
          type="button"
          onClick={() => handleCategorySelect('all')}
          className={`shrink-0 px-4 py-2 border uppercase tracking-wider text-[11px] transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#1C1815] text-white border-[#1C1815] font-semibold'
              : 'bg-white text-[#5C554E] border-[#E8E3DA] hover:text-black hover:border-black'
          }`}
        >
          All Collections ({products.filter((p) => p.status === 'published').length})
        </button>

        {categories.map((cat) => {
          const count = products.filter(
            (p) => p.categorySlug === cat.slug && p.status === 'published'
          ).length;
          const isSelected = selectedCategory === cat.slug;

          return (
            <button
              key={cat.id || cat.slug}
              type="button"
              onClick={() => handleCategorySelect(cat.slug)}
              className={`shrink-0 px-4 py-2 border uppercase tracking-wider text-[11px] transition-all ${
                isSelected
                  ? 'bg-[#1C1815] text-white border-[#1C1815] font-semibold'
                  : 'bg-white text-[#5C554E] border-[#E8E3DA] hover:text-black hover:border-black'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9185]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by piece name, teak, marble, bouclé..."
            className="w-full pl-10 pr-10 py-2.5 border border-[#E8E3DA] bg-white text-xs focus:outline-none focus:border-[#1C1815] text-[#1C1815] placeholder-[#9A9185]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A7268] hover:text-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto text-xs">
          <button
            type="button"
            onClick={() => setMobileFilterOpen((prev) => !prev)}
            className="md:hidden flex items-center gap-2 px-3 py-2 border border-[#E8E3DA] bg-white font-semibold text-[#1C1815]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B89358]" />
            <span>Faceted Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-[#7A7268] uppercase tracking-wide">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-[#E8E3DA] bg-white text-xs uppercase tracking-wide-caps font-semibold text-[#1C1815] focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="featured">Curated Selection</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Desktop Sidebar Filters + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters (3 cols) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="p-6 bg-white border border-[#E8E3DA] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DA]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1C1815]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#B89358]" />
                <span>Refine Selection</span>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] text-[#B89358] hover:underline uppercase tracking-wider"
              >
                Reset All
              </button>
            </div>

            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#1C1815]">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Budget Ceiling:</span>
                <span className="font-mono font-bold">{formatNaira(priceRange)}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="3000000"
                step="50000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#1C1815] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#9A9185] font-mono">
                <span>₦20k</span>
                <span>₦3,000,000+</span>
              </div>
            </div>

            {/* In-Stock Filter */}
            <div className="pt-4 border-t border-[#E8E3DA]">
              <label className="flex items-center gap-3 cursor-pointer text-xs text-[#1C1815]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#B89358] w-4 h-4 cursor-pointer"
                />
                <span className="font-medium">In-Stock Abuja Showroom Only</span>
              </label>
            </div>

            {/* Curated Materials Note */}
            <div className="pt-4 border-t border-[#E8E3DA] space-y-2 text-xs text-[#7A7268]">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-[#1C1815] block">Materials Standard</span>
              <p className="text-[11px] leading-relaxed">
                All timber is sustainably harvested and kiln-dried in Nigeria. Upholstery utilizes rub-tested Italian bouclé and full-grain leather.
              </p>
            </div>
          </div>
        </aside>

        {/* Product Grid (9 cols) */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No pieces match your filters"
              message="Try adjusting your maximum budget or clearing search keywords to view other pieces."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
