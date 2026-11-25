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

  const categoryObj = (categories || []).find((c) => c.slug === product.categorySlug);
  const discountPct =
    priceVisible && product.discountPrice && product.discountPrice > product.price
      ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)
      : 0;

  return (
    <article className="group flex flex-col overflow-hidden bg-white rounded-xl border border-[#EAE2D9] hover:border-[#D9CBBF] hover:shadow-card-hover transition-all duration-300">
      {/* Clean Catalogue Product Image Frame */}
      <div className="relative overflow-hidden bg-white border-b border-[#EAE2D9]/70">
        <Link
          to={`/shop/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="block w-full p-2.5"
        >
          <SafeImage
            src={product.image}
            alt={product.name}
            aspectRatio="aspect-[4/3]"
            fit="contain"
            className="w-full rounded-lg bg-white transition-transform duration-500 group-hover:scale-104"
          />
        </Link>

        {/* Discount Badge (only when prices are visible) */}
        {discountPct > 0 && (
          <span className="absolute left-3 top-3 bg-[#F36B0A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-sm tracking-wide">
            -{discountPct}%
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={() => toggle(product.id, product.name)}
          className="absolute right-3 top-3 rounded-full bg-white/95 backdrop-blur-sm p-2 border border-[#EAE2D9] shadow-xs transition-all duration-200 hover:border-[#F36B0A] hover:scale-105"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              saved ? 'fill-[#F36B0A] text-[#F36B0A]' : 'text-[#786B62] hover:text-[#F36B0A]'
            }`}
          />
        </button>
      </div>

      {/* Merchandising Info Area */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-1.5">
          {categoryObj && (
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#786B62]">
              {categoryObj.name}
            </span>
          )}

          <h3 className="font-semibold text-[#24150F] text-sm sm:text-[15px] leading-snug group-hover:text-[#F36B0A] transition-colors line-clamp-1">
            <Link to={`/shop/${product.slug}`}>{product.name}</Link>
          </h3>

          {priceVisible && (
            <div className="pt-0.5 flex items-baseline gap-2 flex-wrap">
              <span className="text-base sm:text-[17px] font-bold text-[#24150F]">
                {formatNaira(product.price)}
              </span>
              {product.discountPrice && product.discountPrice > product.price && (
                <span className="text-xs text-[#786B62] line-through">
                  {formatNaira(product.discountPrice)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Preserved WhatsApp Purchase Action */}
        <div className="mt-4 pt-3 border-t border-[#EAE2D9]/70">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-[#F36B0A] hover:bg-[#D94D00] px-4 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:shadow-md"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 fill-white shrink-0" />
            <span>{priceVisible ? 'Buy via WhatsApp' : 'Order via WhatsApp'}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
