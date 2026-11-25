import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, X, LayoutGrid, Columns3 } from 'lucide-react';
import ProductCard from '../../components/storefront/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import SEO from '../../components/common/SEO';
import { useStore } from '../../context/StoreContext';
import { categories as initialCategories } from '../../data/categories';
import { formatNaira } from '../../utils/format';

export default function ShopPage() {
  const { products, categories, settings } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const pricesEnabled = settings?.showPrices !== false;

  const sortedCategories = useMemo(() => {
    return (categories && categories.length > 0 ? categories : initialCategories)
      .filter((c) => c.isActive !== false)
      .sort((a, b) => (Number(a.displayOrder) || 99) - (Number(b.displayOrder) || 99));
  }, [categories]);

  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'featured';
  const queryParam = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [priceRange, setPriceRange] = useState(3000000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState(3); // 3 | 4 inside main column

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

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.status !== 'published') return false;
        if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description?.toLowerCase().includes(q);
          const matchesTagline = p.tagline?.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesTagline) return false;
        }
        if (pricesEnabled && p.price > priceRange) return false;
        if (inStockOnly && p.stock <= 0) return false;
        return true;
      })
      .sort((a, b) => {
        if (pricesEnabled && sortBy === 'price-low') return a.price - b.price;
        if (pricesEnabled && sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, priceRange, inStockOnly, sortBy, pricesEnabled]);

  const activeCategoryObj = sortedCategories.find((c) => c.slug === selectedCategory);

  return (
    <div className="container-page py-8 sm:py-12">
      <SEO
        title={activeCategoryObj ? `${activeCategoryObj.name} in Abuja | Modern Furniture` : 'Shop Modern Furniture in Abuja | Sofas, Beds, Dining & More'}
        description={
          activeCategoryObj?.description
            ? `${activeCategoryObj.description} Fast delivery in Abuja & across Nigeria.`
            : 'Browse the complete Home & More Furniture catalog in Nigeria. Handcrafted luxury living room sets, dining tables, beds, center tables, and storage.'
        }
        canonical={activeCategoryObj ? `/category/${activeCategoryObj.slug}` : '/shop'}
      />

      {/* Centered Editorial Catalog Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F36B0A]">
          Showroom Catalogue
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#24150F] tracking-tight">
          {activeCategoryObj ? activeCategoryObj.name : 'All Furniture Collections'}
        </h1>
        <p className="text-sm text-[#786B62] leading-relaxed">
          {activeCategoryObj
            ? activeCategoryObj.description
            : 'Explore handcrafted, durable furniture for contemporary Nigerian homes—available for direct order via WhatsApp.'}
        </p>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-[#EAE2D9]">
        <button
          type="button"
          onClick={() => handleCategorySelect('all')}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#24150F] text-white'
              : 'bg-white text-[#24150F] border border-[#EAE2D9] hover:border-[#F36B0A] hover:text-[#F36B0A]'
          }`}
        >
          All Furniture ({products.filter((p) => p.status === 'published').length})
        </button>

        {sortedCategories.map((cat) => {
          const count = products.filter(
            (p) => p.categorySlug === cat.slug && p.status === 'published'
          ).length;
          const isSelected = selectedCategory === cat.slug;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.slug)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-[#24150F] text-white'
                  : 'bg-white text-[#24150F] border border-[#EAE2D9] hover:border-[#F36B0A] hover:text-[#F36B0A]'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Search, Grid Toggle, Sort, Mobile Filter */}
      <div className="my-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786B62]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, material, or room..."
            className="w-full pl-10 pr-10 py-2.5 rounded-full border border-[#EAE2D9] bg-white text-sm focus:outline-none focus:border-[#F36B0A] text-[#24150F]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#786B62] hover:text-[#24150F]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setMobileFilterOpen((prev) => !prev)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-[#EAE2D9] bg-white text-xs font-semibold text-[#24150F]"
          >
            <Filter className="w-3.5 h-3.5 text-[#F36B0A]" />
            <span>Filters</span>
          </button>

          <div className="hidden lg:flex items-center gap-1 bg-white border border-[#EAE2D9] rounded-lg p-1">
            <button
              type="button"
              onClick={() => setGridCols(3)}
              title="3 columns"
              className={`p-1.5 rounded ${gridCols === 3 ? 'bg-[#24150F] text-white' : 'text-[#786B62] hover:text-[#24150F]'}`}
            >
              <Columns3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setGridCols(4)}
              title="4 columns"
              className={`p-1.5 rounded ${gridCols === 4 ? 'bg-[#24150F] text-white' : 'text-[#786B62] hover:text-[#24150F]'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-medium text-[#786B62]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2 rounded-lg border border-[#EAE2D9] bg-white text-xs font-semibold text-[#24150F] focus:outline-none focus:border-[#F36B0A]"
            >
              <option value="featured">Featured Picks</option>
              {pricesEnabled && <option value="price-low">Price: Low to High</option>}
              {pricesEnabled && <option value="price-high">Price: High to Low</option>}
              <option value="name-asc">Alphabetical (A – Z)</option>
            </select>
          </div>

          <span className="text-xs font-medium text-[#786B62] whitespace-nowrap">
            {filteredProducts.length} items
          </span>
        </div>
      </div>

      {/* Main Content Layout with Clean Sidebar Filters on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-7">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="p-5 rounded-xl bg-white border border-[#EAE2D9] space-y-6 sticky top-36">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D9]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#F36B0A]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#24150F]">
                  Filter Catalogue
                </h3>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-[#F36B0A] hover:underline"
              >
                Reset
              </button>
            </div>

            {pricesEnabled && (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#24150F] mb-2">
                  <span>Max Budget:</span>
                  <span className="text-[#F36B0A]">{formatNaira(priceRange)}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="3000000"
                  step="50000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#F36B0A] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#786B62] mt-1">
                  <span>₦50,000</span>
                  <span>₦3,000,000+</span>
                </div>
              </div>
            )}

            <div className={pricesEnabled ? 'pt-3 border-t border-[#EAE2D9]' : ''}>
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#24150F]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-[#EAE2D9] text-[#F36B0A] focus:ring-[#F36B0A] w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            <div className="rounded-xl bg-[#FAF7F3] p-4 border border-[#EAE2D9]">
              <h4 className="text-[11px] font-bold text-[#24150F] uppercase tracking-wider">
                Custom Dimensions &amp; Fabrics
              </h4>
              <p className="text-xs text-[#786B62] mt-1 leading-relaxed">
                Every piece can be tailored in your preferred fabric, timber stain, and room size at our Abuja factory.
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-[#24150F]/60 backdrop-blur-sm p-4 flex items-end">
            <div className="w-full bg-white rounded-2xl p-6 max-h-[85vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-[#EAE2D9] pb-3">
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#24150F]">
                  Filter Products
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#786B62]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {pricesEnabled && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#24150F] mb-2">
                    <span>Max Budget:</span>
                    <span className="text-[#F36B0A]">{formatNaira(priceRange)}</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="3000000"
                    step="50000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#F36B0A]"
                  />
                </div>
              )}

              <label className="flex items-center gap-2.5 text-sm font-medium text-[#24150F]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#F36B0A]"
                />
                <span>In Stock Only</span>
              </label>

              <div className="flex gap-3 pt-4 border-t border-[#EAE2D9]">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-1/2 py-2.5 rounded-full border border-[#EAE2D9] text-xs font-semibold text-[#24150F]"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-1/2 py-2.5 rounded-full bg-[#F36B0A] text-white text-xs font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No furniture found"
              message="No products match your selected filters or search terms. Try adjusting your search or category."
              actionLabel="Clear all filters"
              onActionClick={handleResetFilters}
            />
          ) : (
            <div
              className={`grid grid-cols-1 min-[480px]:grid-cols-2 ${
                gridCols === 4 ? 'xl:grid-cols-4 md:grid-cols-3' : 'md:grid-cols-3'
              } gap-5`}
            >
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
