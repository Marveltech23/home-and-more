import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '../../components/storefront/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import SEO from '../../components/common/SEO';
import { useStore } from '../../context/StoreContext';

export default function CategoryPage() {
  const { slug } = useParams();
  const { categories, products, getCategoryBySlug } = useStore();

  const category = getCategoryBySlug(slug);

  const categoryProducts = products.filter(
    (p) => p.categorySlug === slug && p.status === 'published'
  );

  if (!category) {
    return (
      <div className="container-page py-20 text-center">
        <SEO title="Category Not Found" />
        <h2 className="text-2xl font-bold text-[#24150F]">Category not found</h2>
        <p className="text-[#82746B] mt-2">The category you requested does not exist.</p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">
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

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#82746B]">
        <Link to="/" className="hover:text-[#F36B0A]">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#F36B0A]">Shop</Link>
        <span>/</span>
        <span className="text-[#F36B0A]">{category.name}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#29160D] to-[#431B0E] text-white p-8 sm:p-12 mb-10 shadow-lg">
        <div className="relative z-10 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F36B0A]">
            Curated Category
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
            {category.name}
          </h1>
          <p className="text-sm sm:text-base text-white/80 mt-2 font-normal leading-relaxed">
            {category.description || 'Discover our handcrafted collection designed to elevate your living spaces with enduring craftsmanship.'}
          </p>
          <div className="mt-4 text-xs font-medium text-[#F8EBDD]">
            {categoryProducts.length} pieces available
          </div>
        </div>

        {/* Decorative background image */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 hidden sm:block pointer-events-none">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Products Grid */}
      {categoryProducts.length === 0 ? (
        <EmptyState
          title={`No ${category.name} in stock right now`}
          message="We are currently crafting new arrivals for this category. Enquire on WhatsApp for bespoke orders."
          actionLabel="Browse Other Categories"
          actionTo="/shop"
        />
      ) : (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-5">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
