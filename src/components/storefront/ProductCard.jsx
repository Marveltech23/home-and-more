import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import { WhatsAppIcon } from '../common/BrandIcons';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import { formatNaira } from '../../utils/format';
import { buildProductWhatsAppLink, isProductPriceVisible } from '../../utils/whatsapp';

export default function ProductCard({ product, settings: propSettings }) {
  const { settings: contextSettings, categories } = useStore();
  const settings = propSettings || contextSettings;
  const { has, toggle } = useWishlist();

  if (!product) return null;

  const saved = has(product.id);
  const priceVisible = isProductPriceVisible(product, settings);
  const whatsappHref = buildProductWhatsAppLink(product, {
    settings,
    categories,
    showPrice: priceVisible,
  });

  return (
    <article className="card group flex flex-col overflow-hidden bg-white rounded-2xl border border-[#F0DFD1] shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
      {/* Product Image Area */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FFFAF5] to-[#F8EBDD]/40 p-3 flex items-center justify-center">
        <Link
          to={`/shop/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="w-full block overflow-hidden rounded-xl bg-white"
        >
          <SafeImage
            src={product.image}
            alt={product.name}
            aspectRatio="aspect-[4/3]"
            fit="contain"
            className="w-full transition-transform duration-500 group-hover:scale-105 rounded-xl bg-white"
          />
        </Link>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={() => toggle(product.id, product.name)}
          className="absolute right-5 top-5 rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-md transition-all duration-200 hover:scale-110 hover:bg-white"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              saved ? 'fill-[#F36B0A] text-[#F36B0A]' : 'text-[#82746B] hover:text-[#F36B0A]'
            }`}
          />
        </button>

        {/* Discount Tag (only shown when price is visible) */}
        {priceVisible && product.discountPrice && (
          <span className="absolute left-5 top-5 bg-[#29160D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Sale
          </span>
        )}
      </div>

      {/* Info Area */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 pt-3">
        <div>
          <h3 className="font-bold text-[#24150F] text-base group-hover:text-[#F36B0A] transition-colors line-clamp-1">
            <Link to={`/shop/${product.slug}`}>{product.name}</Link>
          </h3>

          {priceVisible && (
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#F36B0A]">
                {formatNaira(product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-[#82746B] line-through">
                  {formatNaira(product.discountPrice)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* WhatsApp Buy Button */}
        <div className="mt-4 pt-1">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F36B0A] to-[#D94D00] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:brightness-105 hover:shadow-md"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>{priceVisible ? 'Buy via WhatsApp' : 'Order via WhatsApp'}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
