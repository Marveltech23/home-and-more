import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import ProductCard from '../../components/storefront/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import SEO from '../../components/common/SEO';
import { WhatsAppIcon } from '../../components/common/BrandIcons';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import { formatNaira } from '../../utils/format';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function WishlistPage() {
  const { items, clear } = useWishlist();
  const { products, settings } = useStore();

  const savedProducts = products.filter((p) => items.includes(p.id));
  const totalValue = savedProducts.reduce((sum, p) => sum + p.price, 0);

  // Bulk WhatsApp enquiry message
  const itemsListText = savedProducts.map((p) => `• ${p.name} (${formatNaira(p.price)})`).join('\n');
  const bulkWhatsAppMsg = `${settings.whatsappGreeting} my saved wishlist:\n${itemsListText}\nTotal: ${formatNaira(totalValue)}. Are these available for delivery in Abuja?`;
  const whatsappUrl = buildWhatsAppLink(settings.whatsappNumber, bulkWhatsAppMsg);

  return (
    <div className="container-page py-8 sm:py-12 space-y-8">
      <SEO
        title="Saved Furniture Wishlist"
        description="Review your favorite saved furniture pieces on Home & More Furniture. Enquire directly via WhatsApp for delivery in Abuja."
        canonical="/wishlist"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0DFD1] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#24150F] tracking-tight">
            Saved Wishlist
          </h1>
          <p className="text-sm text-[#82746B] mt-1">
            {savedProducts.length} {savedProducts.length === 1 ? 'piece' : 'pieces'} saved in your browser
          </p>
        </div>

        {savedProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3.5 py-2 rounded-full border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Wishlist</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-xs py-2 px-4 shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Enquire All on WhatsApp</span>
            </a>
          </div>
        )}
      </div>

      {/* Content */}
      {savedProducts.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          message="Save furniture pieces while browsing to review them later or send a direct quote request on WhatsApp."
          actionLabel="Browse Furniture Catalog"
          actionTo="/shop"
        />
      ) : (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-5">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
