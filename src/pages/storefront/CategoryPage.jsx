import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, Check } from 'lucide-react';
import ProductCard from '../../components/storefront/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import SEO from '../../components/common/SEO';
import { useStore } from '../../context/StoreContext';

export default function CategoryPage() {
  const { slug } = useParams();
  const { categories, products, getCategoryBySlug } = useStore();
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const category = getCategoryBySlug(slug);

  const categoryProducts = useMemo(() => {
    let prods = products.filter(
      (p) => p.categorySlug === slug && p.status === 'published'
    );

    if (inStockOnly) {
      prods = prods.filter((p) => (p.stock || 0) > 0);
    }

    if (sortBy === 'price-low') {
      prods.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      prods.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return prods;
  }, [products, slug, inStockOnly, sortBy]);

  if (!category) {
    return (
      <div className="container-page py-24 text-center space-y-4">
        <SEO title="Collection Not Found" />
        <h2 className="font-luxury-serif text-3xl font-light text-[#1C1815]">Collection Not Found</h2>
        <p className="text-xs text-[#7A7268]">The requested furniture collection is currently unavailable.</p>
        <div className="pt-2">
          <Link to="/shop" className="btn-primary text-xs tracking-wide-caps inline-flex">
            Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} | Home & More Furniture Atelier`,
    description: category.description,
    url: `https://www.homeandmorefurniture.com/category/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: categoryProducts.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://www.homeandmorefurniture.com/product/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <div className="container-page py-8 sm:py-14 space-y-10">
      <SEO
        title={`${category.name} | Contemporary Luxury in Abuja`}
        description={
          category.description
            ? `${category.description} Handcrafted ${category.name.toLowerCase()} in Abuja with white-glove delivery across Nigeria.`
            : `Discover luxury handcrafted ${category.name.toLowerCase()} in Abuja at Home & More Furniture.`
        }
        canonical={`/category/${category.slug}`}
        image={category.image}
        schema={categorySchema}
      />

      {/* Architectural Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] uppercase tracking-ultra-caps text-[#9A9185]">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>&bull;</span>
        <Link to="/shop" className="hover:text-black">Catalogue</Link>
        <span>&bull;</span>
        <span className="text-[#1C1815] font-semibold">{category.name}</span>
      </nav>

      {/* Curated Header Banner */}
      <div className="border-b border-[#E8E3DA] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <span className="text-[10px] uppercase tracking-ultra-caps text-[#B89358] font-bold block">
            COLLECTION ATELIER
          </span>
          <h1 className="font-luxury-serif text-4xl sm:text-5xl font-light text-[#1C1815] tracking-tight">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#7A7268] font-light leading-relaxed">
            {category.description || 'Handcrafted pieces calibrated for proportion, comfort, and enduring architectural beauty.'}
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-[#5C554E] hover:text-black select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-[#B89358] w-4 h-4"
            />
            <span>In-Stock Abuja Only</span>
          </label>

          <div className="border-l border-[#E8E3DA] pl-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-0 text-xs uppercase tracking-wide-caps font-semibold text-[#1C1815] outline-none cursor-pointer"
            >
              <option value="featured">Sort: Curated Selection</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 text-xs">
        <Link
          to="/shop"
          className="px-4 py-2 border border-[#E8E3DA] bg-white text-[#7A7268] hover:text-black hover:border-black shrink-0 transition-colors uppercase tracking-wider text-[11px]"
        >
          All Collections
        </Link>
        {categories.map((c) => {
          const isActive = c.slug === slug;
          return (
            <Link
              key={c.id || c.slug}
              to={`/category/${c.slug}`}
              className={`px-4 py-2 border shrink-0 transition-all uppercase tracking-wider text-[11px] ${
                isActive
                  ? 'bg-[#1C1815] text-white border-[#1C1815] font-semibold'
                  : 'bg-white text-[#7A7268] border-[#E8E3DA] hover:text-black hover:border-black'
              }`}
            >
              {c.name}
            </Link>
          );
        })}
      </div>

      {/* Products Grid */}
      {categoryProducts.length === 0 ? (
        <EmptyState
          title={`No ${category.name} in stock right now`}
          message="We are currently crafting new arrivals for this collection at our Dei-Dei joinery workshop. Contact our concierge for bespoke commissions."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Showroom Advisory Strip */}
      <div className="bg-[#EFECE6] p-8 border border-[#E8E3DA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C554E]">
        <div className="space-y-1 text-center sm:text-left">
          <strong className="text-[#1C1815] font-luxury-serif text-lg block">Need Custom Sizing or Upholstery?</strong>
          <span>Our Dei-Dei workshop accommodates custom lengths, finishes, and over 60+ imported fabric swatches.</span>
        </div>
        <Link to="/contact" className="btn-primary text-[11px] tracking-wide-caps shrink-0">
          Consult With Architect
        </Link>
      </div>
    </div>
  );
}
