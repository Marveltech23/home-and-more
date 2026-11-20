import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import ProductCard from '../../components/storefront/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import SEO from '../../components/common/SEO';
import { WhatsAppIcon } from '../../components/common/BrandIcons';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../components/common/Toast';
import { formatNaira } from '../../utils/format';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function WishlistPage() {
  const { items, clear } = useWishlist();
  const { addItem, openCart } = useCart();
  const { products, settings } = useStore();
  const { addToast } = useToast();

  const savedProducts = products.filter((p) => items.includes(p.id));
  const totalValue = savedProducts.reduce((sum, p) => sum + p.price, 0);

  // Bulk add to shopping bag
  const handleAddAllToCart = () => {
    if (savedProducts.length === 0) return;
    savedProducts.forEach((product) => {
      addItem(product, 1);
    });
    addToast({
      message: `Added all ${savedProducts.length} pieces to your Shopping Bag`,
      type: 'success',
    });
    openCart();
  };

  // Bulk WhatsApp enquiry message
  const itemsListText = savedProducts.map((p) => `• ${p.name} (${formatNaira(p.price)})`).join('\n');
  const bulkWhatsAppMsg = `Hello Home & More Concierge,\n\nI am reviewing my curated wishlist:\n${itemsListText}\n\nPortfolio Total: ${formatNaira(totalValue)}\n\nPlease advise on current availability, finish customizations, and white-glove delivery in Abuja.`;
  const whatsappUrl = buildWhatsAppLink(settings.whatsappNumber || '+2348033513144', bulkWhatsAppMsg);

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-10 sm:py-16">
      <SEO
        title="Saved Portfolio | Home & More Atelier"
        description="Review your curated furniture portfolio on Home & More. Reserve bespoke suites or transfer directly to your private order manifest in Abuja."
        canonical="/wishlist"
      />

      <div className="container-page space-y-10">
        {/* Editorial Header */}
        <div className="border-b border-[#E8E3DA] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-ultra-caps text-[#8C6D3B]">
              Private Client Portfolio
            </span>
            <h1 className="text-3xl sm:text-5xl font-luxury-serif font-light text-[#1C1815] tracking-tight">
              Curated Sanctuary
            </h1>
            <p className="text-sm text-[#70685E] max-w-xl font-light leading-relaxed">
              Saved architectural suites, artisanal joinery, and statement pieces reserved for your residence or commercial project.
            </p>
          </div>

          {savedProducts.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase text-[#70685E] hover:text-[#1C1815] px-4 py-2.5 border border-[#E8E3DA] hover:border-[#1C1815] transition-colors duration-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>

              <button
                type="button"
                onClick={handleAddAllToCart}
                className="btn-luxury text-xs px-5 py-2.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move All to Bag</span>
              </button>
            </div>
          )}
        </div>

        {savedProducts.length === 0 ? (
          <div className="py-16 text-center max-w-lg mx-auto space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#EFECE6] border border-[#E8E3DA] flex items-center justify-center text-[#8C6D3B]">
              <Heart className="w-7 h-7 stroke-[1.2]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-luxury-serif text-[#1C1815]">
                Your Portfolio is Currently Empty
              </h2>
              <p className="text-sm text-[#70685E] leading-relaxed">
                Explore our curated living room suites, executive office joinery, and bedroom sanctuaries to save pieces for your home.
              </p>
            </div>
            <Link to="/shop" className="btn-luxury inline-flex text-xs px-6 py-3">
              <span>Explore The Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Portfolio Summary Valuation Card */}
            <div className="p-6 sm:p-8 bg-[#EFECE6]/60 border border-[#E8E3DA] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold">
                  Portfolio Valuation • {savedProducts.length} {savedProducts.length === 1 ? 'Suite' : 'Suites'}
                </span>
                <div className="text-2xl sm:text-3xl font-luxury-serif text-[#1C1815]">
                  {formatNaira(totalValue)}
                </div>
                <p className="text-xs text-[#70685E]">
                  Inclusive of Abuja delivery &amp; white-glove showroom assembly.
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-xs px-5 py-3 shadow-none self-start sm:self-center"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Enquire via WhatsApp Concierge</span>
              </a>
            </div>

            {/* Product Exhibition Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {savedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
