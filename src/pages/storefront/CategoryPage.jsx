import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LayoutGrid, Columns2, Columns3 } from 'lucide-react';
import ProductCard from '../../components/storefront/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import SEO from '../../components/common/SEO';
import { useStore } from '../../context/StoreContext';
import { categories as initialCategories } from '../../data/categories';

export default function CategoryPage() {
  const { slug } = useParams();
  const { categories, products, settings, getCategoryBySlug } = useStore();

  const [sortBy, setSortBy] = useState('featured');
  const [gridCols, setGridCols] = useState(4); // 2 | 3 | 4

  const pricesEnabled = settings?.showPrices !== false;
  const category = getCategoryBySlug(slug);

  const allActiveCategories = useMemo(
    () =>
      (categories && categories.length > 0 ? categories : initialCategories)
        .filter((c) => c.isActive !== false)
        .sort((a, b) => (Number(a.displayOrder) || 99) - (Number(b.displayOrder) || 99)),
    [categories]
  );

  const categoryProducts = useMemo(() => {
    return (products || [])
      .filter((p) => p.categorySlug === slug && p.status === 'published')
      .sort((a, b) => {
        if (pricesEnabled && sortBy === 'price-low') return a.price - b.price;
        if (pricesEnabled && sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [products, slug, sortBy, pricesEnabled]);

  if (!category) {
    return (
      <div className="container-page py-20 text-center">
        <SEO title="Category Not Found" />
        <h2 className="font-editorial text-3xl font-semibold text-[#24150F]">Category not found</h2>
        <p className="text-sm text-[#786B62] mt-2">The category you requested could not be found.</p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex text-sm">
          Back to Shop
        </Link>
      </div>
    );
  }

  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} | Home & More Furniture`,
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

  const gridClass =
    gridCols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : gridCols === 3
      ? 'grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="container-page py-8 sm:py-12">
      <SEO
        title={`${category.name} in Abuja | Luxury Furniture`}
        description={
          category.description
            ? `${category.description} Shop luxury modern ${category.name.toLowerCase()} in Abuja with fast nationwide delivery.`
            : `Discover luxury handcrafted ${category.name.toLowerCase()} in Abuja, Nigeria at Home & More Furniture.`
        }
        canonical={`/category/${category.slug}`}
        image={category.image}
        schema={categorySchema}
      />

      {/* Centered Breadcrumbs & Editorial Category Header (Baffi-inspired) */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2.5">
        <nav className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#786B62]">
          <Link to="/" className="hover:text-[#F36B0A]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#F36B0A]">Shop</Link>
          <span>/</span>
          <span className="text-[#F36B0A]">{category.name}</span>
        </nav>

        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#24150F] tracking-tight">
          {category.name}
        </h1>

        <p className="text-sm text-[#786B62] leading-relaxed">
          {category.description || 'Discover our handcrafted collection designed to elevate modern Nigerian interiors.'}
        </p>
      </div>

      {/* Sibling Category Quick Strip */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar border-b border-[#EAE2D9]">
        {allActiveCategories.map((c) => {
          const isCurrent = c.slug === category.slug;
          return (
            <Link
              key={c.id}
              to={`/category/${c.slug}`}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isCurrent
                  ? 'bg-[#24150F] text-white'
                  : 'bg-white text-[#24150F] border border-[#EAE2D9] hover:border-[#F36B0A] hover:text-[#F36B0A]'
              }`}
            >
              {c.name}
            </Link>
          );
        })}
      </div>

      {/* Baffi-Style Showroom Toolbar (Count | View Columns | Sort) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7 pb-4 border-b border-[#EAE2D9]">
        <span className="text-xs font-semibold text-[#786B62] uppercase tracking-wider">
          {categoryProducts.length} {categoryProducts.length === 1 ? 'Piece' : 'Pieces'} Available
        </span>

        <div className="flex items-center gap-4">
          {/* Desktop Grid Column Switcher */}
          <div className="hidden lg:flex items-center gap-1.5 bg-white border border-[#EAE2D9] rounded-lg p-1">
            <button
              type="button"
              onClick={() => setGridCols(2)}
              title="2 columns"
              className={`p-1.5 rounded ${gridCols === 2 ? 'bg-[#24150F] text-white' : 'text-[#786B62] hover:text-[#24150F]'}`}
            >
              <Columns2 className="w-3.5 h-3.5" />
            </button>
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

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#786B62]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2 rounded-lg border border-[#EAE2D9] bg-white text-xs font-semibold text-[#24150F] focus:outline-none focus:border-[#F36B0A]"
            >
              <option value="featured">Featured</option>
              {pricesEnabled && <option value="price-low">Price: Low to High</option>}
              {pricesEnabled && <option value="price-high">Price: High to Low</option>}
              <option value="name-asc">Alphabetical (A – Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {categoryProducts.length === 0 ? (
        <EmptyState
          title={`No ${category.name} in stock right now`}
          message="We are currently crafting new arrivals for this department. Message us on WhatsApp for bespoke orders."
          actionLabel="Browse Other Categories"
          actionTo="/shop"
        />
      ) : (
        <div className={`grid ${gridClass} gap-5`}>
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
