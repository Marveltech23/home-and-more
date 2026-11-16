import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import ProductCard from '../../components/storefront/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import SEO from '../../components/common/SEO';
import { useStore } from '../../context/StoreContext';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);

  const { products } = useStore();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  const matchingProducts = products.filter((p) => {
    if (p.status !== 'published') return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.categorySlug?.toLowerCase().includes(q) ||
      p.material?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container-page py-8 sm:py-12 space-y-8">
      <SEO
        title={query ? `Search: "${query}"` : 'Search Furniture'}
        description="Search modern sofas, dining sets, beds, and furniture at Home & More Furniture in Abuja, Nigeria."
        canonical="/search"
      />

      {/* Search Header Form */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24150F]">
          Search Results
        </h1>
        {query ? (
          <p className="text-sm text-[#82746B]">
            Found <span className="font-bold text-[#F36B0A]">{matchingProducts.length}</span> results for "{query}"
          </p>
        ) : (
          <p className="text-sm text-[#82746B]">Search across our entire furniture collection</p>
        )}

        <form onSubmit={handleSearchSubmit} className="relative max-w-lg mx-auto flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-[#82746B]" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search sofas, beds, dining sets, armchairs..."
            className="w-full pl-11 pr-24 py-3 rounded-full border border-[#F0DFD1] bg-white text-sm focus:outline-none focus:border-[#F36B0A] shadow-inner text-[#24150F]"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-1.5 rounded-full bg-[#F36B0A] text-white text-xs font-semibold hover:bg-[#D94D00] transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Grid */}
      {matchingProducts.length === 0 ? (
        <EmptyState
          title={`No results found for "${query}"`}
          message="Try searching for another keyword like 'sofa', 'chair', 'dining', or 'bed'."
          actionLabel="View All Furniture"
          actionTo="/shop"
        />
      ) : (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-5">
          {matchingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
