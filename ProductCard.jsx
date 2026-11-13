import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import { WhatsAppIcon } from '../common/BrandIcons';
import { useWishlist } from '../../context/WishlistContext';
import { formatNaira } from '../../utils/format';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function ProductCard({ product, settings }) {
  const { has, toggle } = useWishlist();
  const saved = has(product.id);
  const message = `${settings.whatsappGreeting} ${product.name} (${formatNaira(product.price)}).`;

  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative">
        <Link to={`/shop/${product.slug}`} aria-label={`View ${product.name}`}>
          <SafeImage
            src={product.image}
            alt={product.name}
            fit="contain"
            className="h-44 w-full bg-gradient-to-b from-white to-beige/50 p-3 transition duration-300 group-hover:scale-105 sm:h-48"
          />
        </Link>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={() => toggle(product.id)}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 shadow transition hover:scale-110"
        >
          <Heart className={`h-5 w-5 ${saved ? 'fill-brand text-brand' : 'text-ink'}`} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4 pt-3">
        <h3 className="font-medium text-ink">
          <Link to={`/shop/${product.slug}`} className="hover:text-brand">{product.name}</Link>
        </h3>
        <p className="mt-1 text-lg font-bold text-brand">{formatNaira(product.price)}</p>
        <a
          href={buildWhatsAppLink(settings.whatsappNumber, message)}
          target="_blank"
          rel="noreferrer"
          className="mt-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-deep px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:brightness-110"
          style={{ marginTop: '0.75rem' }}
        >
          <WhatsAppIcon className="h-4 w-4" /> Buy via WhatsApp <ArrowRight className="sr-only" />
        </a>
      </div>
    </article>
  );
}
