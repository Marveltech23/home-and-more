import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  Send,
  ArrowLeft,
  Check,
  Share2,
  PackageCheck,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Ruler,
  Compass
} from 'lucide-react';
import SafeImage from '../../components/common/SafeImage';
import ProductCard from '../../components/storefront/ProductCard';
import SectionHeading from '../../components/common/SectionHeading';
import Modal from '../../components/common/Modal';
import SEO from '../../components/common/SEO';
import { WhatsAppIcon } from '../../components/common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/common/Toast';
import { formatNaira } from '../../utils/format';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, getProductBySlug, settings, addEnquiry } = useStore();
  const { has, toggle } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const product = getProductBySlug(slug);

  // Gallery state
  const [selectedImage, setSelectedImage] = useState(product?.image);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState('specs'); // 'specs' | 'craft' | 'delivery' | 'care'

  // Enquiry modal state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when slug changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedColor(product.colors?.[0] || '');
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [slug, product]);

  if (!product) {
    return (
      <div className="container-page py-24 text-center space-y-4">
        <h2 className="font-luxury-serif text-3xl font-light text-[#1C1815]">Piece Not Found</h2>
        <p className="text-xs text-[#7A7268]">The requested furniture piece may have been relocated or archived.</p>
        <div className="pt-2">
          <Link to="/shop" className="btn-primary text-xs tracking-wide-caps inline-flex">
            Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = has(product.id);

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id && p.status === 'published')
    .slice(0, 4);

  // WhatsApp Concierge Link
  const colorText = selectedColor ? ` Color: ${selectedColor}.` : '';
  const qtyText = quantity > 1 ? ` Qty: ${quantity}.` : '';
  const whatsappMsg = `${settings.whatsappGreeting} "${product.name}" (${formatNaira(product.price)}).${colorText}${qtyText} Is this available for showroom inspection or delivery in Abuja?`;
  const whatsappUrl = buildWhatsAppLink(settings.whatsappNumber, whatsappMsg);

  const handleAddToCart = () => {
    addToCart(product, quantity, {
      selectedColor,
      selectedMaterial: product.material,
    });
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      addToast({ message: 'Please provide your name and phone number', type: 'error' });
      return;
    }
    setIsSubmitting(true);
    addEnquiry({
      customerName: customerName.trim(),
      phone: customerPhone.trim(),
      email: customerEmail.trim() || 'Not provided',
      productName: product.name,
      productId: product.id,
      price: product.price * quantity,
      message: customerMessage.trim() || `Interested in custom commissioning for ${quantity}x ${product.name} (${selectedColor || 'Default'}).`,
    });

    setIsSubmitting(false);
    setEnquiryModalOpen(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setCustomerMessage('');
    addToast({
      message: 'Your enquiry has been logged with our showroom architects.',
      type: 'success',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `View ${product.name} on Home & More Furniture:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast({ message: 'Link copied to clipboard.', type: 'success' });
    }
  };

  const galleryImages = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description || product.tagline,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'Home & More Furniture',
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.homeandmorefurniture.com/product/${product.slug}`,
      priceCurrency: 'NGN',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Home & More Furniture',
      },
    },
  };

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  return (
    <div className="container-page py-8 sm:py-14 space-y-12">
      <SEO
        title={`${product.name} | Contemporary Luxury in Abuja`}
        description={`${product.name} - ${formatNaira(product.price)}. ${product.tagline || product.description || 'Modern luxury furniture handcrafted for Nigerian homes.'} Fast delivery in Abuja.`}
        canonical={`/product/${product.slug}`}
        image={product.image}
        schema={productSchema}
      />

      {/* Architectural Breadcrumbs */}
      <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-4 text-[10px] uppercase tracking-ultra-caps text-[#9A9185]">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>&bull;</span>
          <Link to={`/category/${product.categorySlug}`} className="hover:text-black">
            {product.categorySlug ? product.categorySlug.replace('-', ' ') : 'Collection'}
          </Link>
          <span>&bull;</span>
          <span className="text-[#1C1815] font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-[#7A7268] hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return</span>
        </button>
      </div>

      {/* Main Luxury Exhibition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Multi-Angle Gallery & Architecture Diagram (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Exhibition View */}
          <div className="relative aspect-[16/11] bg-[#EFECE6] border border-[#E8E3DA] overflow-hidden group">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103 brightness-[0.97]"
            />

            {/* Quick Share / Wishlist overlay */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share piece"
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#1C1815] hover:text-[#B89358] transition-colors shadow-xs"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toggle(product.id, product.name)}
                aria-label="Save piece"
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#1C1815] transition-colors shadow-xs"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isSaved ? 'fill-[#1C1815] text-[#1C1815]' : 'text-[#7A7268] hover:text-[#B89358]'
                  }`}
                />
              </button>
            </div>

            {/* In-stock Badge */}
            <div className="absolute bottom-4 left-4">
              <span className="bg-[#1C1815]/90 backdrop-blur-xs text-white text-[10px] uppercase tracking-wide-caps font-semibold px-3 py-1.5 border border-white/10">
                Gwarinpa Showroom Display
              </span>
            </div>
          </div>

          {/* Thumbnails Row */}
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square bg-[#EFECE6] overflow-hidden border transition-all ${
                    selectedImage === img
                      ? 'border-[#1C1815] p-0.5'
                      : 'border-[#E8E3DA] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Scale & Dimensions Diagram Card */}
          <div className="p-6 bg-white border border-[#E8E3DA] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1C1815]">
              <Ruler className="w-4 h-4 text-[#B89358]" />
              <span>Architectural Dimensions &amp; Scale</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-light">
              <div className="p-3 bg-[#FBF9F5] border border-[#E8E3DA]">
                <span className="text-[10px] uppercase tracking-wider text-[#7A7268] block">Overall Footprint</span>
                <strong className="text-sm font-medium text-[#1C1815] block mt-0.5">{product.dimensions || 'Custom Specification'}</strong>
              </div>
              <div className="p-3 bg-[#FBF9F5] border border-[#E8E3DA]">
                <span className="text-[10px] uppercase tracking-wider text-[#7A7268] block">Primary Core</span>
                <strong className="text-sm font-medium text-[#1C1815] block mt-0.5">Kiln-Dried Hardwood</strong>
              </div>
              <div className="p-3 bg-[#FBF9F5] border border-[#E8E3DA]">
                <span className="text-[10px] uppercase tracking-wider text-[#7A7268] block">Seat Springing</span>
                <strong className="text-sm font-medium text-[#1C1815] block mt-0.5">Pocket Coils / HR</strong>
              </div>
              <div className="p-3 bg-[#FBF9F5] border border-[#E8E3DA]">
                <span className="text-[10px] uppercase tracking-wider text-[#7A7268] block">Assembly</span>
                <strong className="text-sm font-medium text-[#1C1815] block mt-0.5">White-Glove Included</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Purchasing & Curatorial Specifications (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-[#E8E3DA] pb-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-ultra-caps text-[#B89358] font-bold">
                SKU: {product.sku || 'HM-ATELIER'}
              </span>
              <span className="text-xs font-medium text-[#2e7d32] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]"></span>
                In Stock &bull; Abuja
              </span>
            </div>

            <h1 className="font-luxury-serif text-3xl sm:text-5xl font-light text-[#1C1815] tracking-tight leading-[1.08]">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="text-xs text-[#7A7268] font-light leading-relaxed pt-1">
                {product.tagline}
              </p>
            )}

            {/* Price Presentation */}
            <div className="pt-3 flex items-baseline gap-3">
              <span className="font-luxury-serif text-3xl sm:text-4xl font-medium text-[#1C1815]">
                {formatNaira(product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-sm text-[#9A9185] line-through font-light">
                  {formatNaira(product.discountPrice)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#7A7268] pt-1">
              Includes complimentary white-glove unboxing and room placement in Abuja.
            </p>
          </div>

          {/* Description */}
          <div className="text-xs text-[#5C554E] font-light leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Swatch Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-wide-caps text-[11px] font-semibold text-[#1C1815]">
                  Selected Finish: <strong className="font-medium text-[#B89358]">{selectedColor}</strong>
                </span>
                <span className="text-[10px] text-[#7A7268]">{product.colors.length} choices available</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-2 text-xs transition-all uppercase tracking-wider text-[11px] border ${
                        isSelected
                          ? 'border-[#1C1815] bg-[#1C1815] text-white font-semibold'
                          : 'border-[#E8E3DA] bg-white text-[#5C554E] hover:border-black'
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Purchasing Suite */}
          <div className="space-y-3 pt-3">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#E8E3DA] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-3 text-xs text-[#7A7268] hover:text-black transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-mono text-xs font-bold text-[#1C1815]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-3 text-xs text-[#7A7268] hover:text-black transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag (Triggers Slide-Out Drawer) */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-[#1C1815] hover:bg-[#B89358] text-white text-xs uppercase tracking-wide-caps font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Shopping Bag</span>
              </button>
            </div>

            {/* Direct WhatsApp Concierge CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 border border-[#1C1815] bg-transparent hover:bg-white text-[#1C1815] text-xs uppercase tracking-wide-caps font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current text-[#25D366]" />
              <span>Inquire on WhatsApp (+234 803 351 3144)</span>
            </a>

            {/* Bespoke Dimension Commission */}
            <button
              type="button"
              onClick={() => setEnquiryModalOpen(true)}
              className="w-full text-center text-[11px] text-[#7A7268] hover:text-[#1C1815] underline pt-1"
            >
              Need bespoke measurements or commercial quantities? Request a custom quote &rarr;
            </button>
          </div>

          {/* Luxury Accordion Specifications */}
          <div className="border-t border-[#E8E3DA] text-xs divide-y divide-[#E8E3DA] pt-2">
            {/* 1. Craftsmanship */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('craft')}
                className="w-full py-3.5 flex items-center justify-between text-left font-semibold uppercase tracking-wider text-[#1C1815]"
              >
                <span>Timber &amp; Upholstery Standards</span>
                {openAccordion === 'craft' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'craft' && (
                <div className="pb-4 text-[#5C554E] font-light leading-relaxed space-y-2">
                  <p>
                    Engineered from sustainably sourced timber seasoned in industrial kilns to 8–10% moisture content to prevent seasonal cracking or warping during the harmattan season.
                  </p>
                  <p>
                    Internal joinery utilizes reinforced corner blocking, dowel reinforcement, and individual pocket coils wrapped in high-resilience memory foam.
                  </p>
                </div>
              )}
            </div>

            {/* 2. Logistics & Setup */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('delivery')}
                className="w-full py-3.5 flex items-center justify-between text-left font-semibold uppercase tracking-wider text-[#1C1815]"
              >
                <span>Abuja &amp; Nationwide Delivery Logistics</span>
                {openAccordion === 'delivery' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'delivery' && (
                <div className="pb-4 text-[#5C554E] font-light leading-relaxed space-y-2">
                  <p>
                    <strong>Abuja (FCT):</strong> Delivered within 24 to 48 hours for in-stock pieces. Includes unboxing, debris removal, and room placement by our logistics personnel.
                  </p>
                  <p>
                    <strong>Nationwide (Lagos, Port Harcourt, Kano):</strong> Secure wooden crating and transit insurance via verified freight handlers.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Warranty & Care */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('care')}
                className="w-full py-3.5 flex items-center justify-between text-left font-semibold uppercase tracking-wider text-[#1C1815]"
              >
                <span>10-Year Structural Guarantee &amp; Care</span>
                {openAccordion === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'care' && (
                <div className="pb-4 text-[#5C554E] font-light leading-relaxed space-y-2">
                  <p>
                    All solid timber frames carry a 10-year structural integrity guarantee. Fabric upholstery can be vacuumed lightly; spot clean with warm water and mild detergent. Avoid harsh solvent cleaners.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[#E8E3DA] pt-14 space-y-8">
          <SectionHeading
            eyebrow="HARMONIOUS PIECES"
            title="Complete The Living Space"
            subtitle="Complementary furniture masterworks styled to accompany this piece."
            actionLabel="View Collection"
            actionTo={`/category/${product.categorySlug}`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Custom Commission Modal */}
      <Modal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        title={`Bespoke Commission: ${product.name}`}
      >
        <form onSubmit={handleEnquirySubmit} className="space-y-4 text-xs">
          <p className="text-[#7A7268] leading-relaxed">
            Our Dei-Dei workshop accommodates custom dimensions, timber stains, and fabric imports. Provide your details below and an architectural consultant will be in touch.
          </p>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1815] mb-1">Your Full Name *</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Hajia Fatima Bello"
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8E3DA] focus:outline-none focus:border-[#1C1815]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1815] mb-1">Phone Number (WhatsApp) *</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+234 803 351 3144"
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8E3DA] focus:outline-none focus:border-[#1C1815]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1815] mb-1">Custom Requirements / Room Dimensions</label>
            <textarea
              rows={3}
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              placeholder="e.g. Would like this sectional lengthened to 340cm in Milk White bouclé for a Maitama living room."
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8E3DA] focus:outline-none focus:border-[#1C1815]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary text-xs tracking-wide-caps py-3"
            >
              {isSubmitting ? 'Logging Enquiry...' : 'Submit Bespoke Inquiry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
