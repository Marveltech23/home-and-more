import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import { WhatsAppIcon } from '../common/BrandIcons';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import { formatNaira } from '../../utils/format';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function ProductCard({ product, settings: propSettings }) {
  const { settings: contextSettings } = useStore();
  const settings = propSettings || contextSettings;
  const { has, toggle } = useWishlist();

  if (!product) return null;

  const saved = has(product.id);
  const message = `${settings?.whatsappGreeting || 'Hello, I want to enquire about'} ${product.name} (${formatNaira(product.price)}).`;

  return (
    <article className="card group flex flex-col overflow-hidden bg-white rounded-2xl border border-[#EDE5DC] shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
      {/* Product Image Area with Warm Neutral Matting */}
      <div className="relative overflow-hidden bg-[#FAF7F4] p-3 flex items-center justify-center">
        <Link
          to={`/shop/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="w-full block overflow-hidden rounded-xl bg-white"
        >
          <SafeImage
            src={product.image}
            alt={product.name}
            aspectRatio="aspect-[4/3]"
            className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-106 rounded-xl"
          />
        </Link>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={() => toggle(product.id, product.name)}
          className="absolute right-5 top-5 rounded-full bg-white/95 backdrop-blur-sm p-2 shadow-sm border border-[#EDE5DC]/60 transition-all duration-200 hover:scale-110 hover:bg-white"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              saved ? 'fill-[#E05A00] text-[#E05A00]' : 'text-[#7A6E65] hover:text-[#E05A00]'
            }`}
          />
        </button>

        {/* Micro Trust Tag: In Stock Abuja / Sale */}
        <div className="absolute left-5 top-5 flex items-center gap-1.5">
          {product.discountPrice ? (
            <span className="bg-[#201611] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Sale
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-800 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full shadow-xs border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              In Stock Abuja
            </span>
          )}
        </div>
      </div>

      {/* Info Area */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 pt-3 justify-between">
        <div>
          <h3 className="font-semibold text-[#1F1612] text-sm sm:text-base group-hover:text-[#E05A00] transition-colors line-clamp-1">
            <Link to={`/shop/${product.slug}`}>{product.name}</Link>
          </h3>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-[#E05A00]">
              {formatNaira(product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-[#7A6E65] line-through">
                {formatNaira(product.discountPrice)}
              </span>
            )}
          </div>
        </div>

        {/* WhatsApp Buy Button */}
        <div className="mt-4 pt-1">
          <a
            href={buildWhatsAppLink(settings?.whatsappNumber, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E05A00] to-[#C84800] hover:from-[#C84800] hover:to-[#B33E00] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>Buy via WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
}
