import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import { WhatsAppIcon } from '../common/BrandIcons';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatNaira } from '../../utils/format';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function ProductCard({ product, settings: propSettings }) {
  const { settings: contextSettings } = useStore();
  const settings = propSettings || contextSettings;
  const { has, toggle } = useWishlist();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const saved = has(product.id);
  const message = `${settings?.whatsappGreeting || 'Hello, I want to enquire about'} ${product.name} (${formatNaira(product.price)}).`;

  // Secondary image for hover effect
  const primaryImage = product.image;
  const secondaryImage = product.gallery && product.gallery.length > 1 ? product.gallery[1] : primaryImage;

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col bg-white border border-[#E8E3DA] overflow-hidden transition-all duration-500 hover:border-[#B89358] hover:shadow-card"
    >
      {/* Product Image Area (4/5 Luxury Portrait) */}
      <div className="relative overflow-hidden aspect-[4/5] bg-[#EFECE6]">
        <Link
          to={`/product/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="w-full h-full block"
        >
          <img
            src={isHovered ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-104 brightness-[0.97]"
            loading="lazy"
          />
        </Link>

        {/* Minimalist Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.discountPrice && (
            <span className="bg-[#1C1815] text-[#FBF9F5] text-[9px] font-semibold px-2 py-0.5 uppercase tracking-wider">
              Curated Price
            </span>
          )}
          {product.categorySlug === 'sofa-sets' && (
            <span className="bg-[#B89358] text-white text-[9px] font-semibold px-2 py-0.5 uppercase tracking-wider">
              Showroom Ready
            </span>
          )}
        </div>

        {/* Minimalist Wishlist Button */}
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={() => toggle(product.id, product.name)}
          className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#1C1815] hover:text-[#B89358] transition-colors shadow-xs"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              saved ? 'fill-[#1C1815] text-[#1C1815]' : 'text-[#7A7268]'
            }`}
          />
        </button>

        {/* Slide-Up Hover Action Deck */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#1C1815]/90 via-[#1C1815]/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            className="flex-1 py-2 px-3 bg-white text-[#1C1815] hover:bg-[#B89358] hover:text-white text-[10px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Add To Bag</span>
          </button>

          <a
            href={buildWhatsAppLink(settings?.whatsappNumber, message)}
            target="_blank"
            rel="noopener noreferrer"
            title="Enquire on WhatsApp"
            className="p-2 bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
          </a>
        </div>
      </div>

      {/* Info Area */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 justify-between space-y-2">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-ultra-caps text-[#9A9185] block">
            {product.categorySlug ? product.categorySlug.replace('-', ' ') : 'Luxury Living'}
          </span>
          <h3 className="font-luxury-serif text-lg sm:text-xl font-normal text-[#1C1815] group-hover:text-[#B89358] transition-colors line-clamp-1 leading-snug">
            <Link to={`/product/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-[11px] text-[#7A7268] line-clamp-1 font-light">
            {product.tagline || product.material || 'Kiln-dried hardwood construction.'}
          </p>
        </div>

        {/* Pricing */}
        <div className="pt-2 border-t border-[#E8E3DA] flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold text-[#1C1815]">
              {formatNaira(product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-[#9A9185] line-through font-light">
                {formatNaira(product.discountPrice)}
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-wide text-[#7A7268]">
            Abuja Delivery
          </span>
        </div>
      </div>
    </article>
  );
}
