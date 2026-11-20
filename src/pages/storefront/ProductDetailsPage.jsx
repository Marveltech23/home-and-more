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
  PackageCheck
} from 'lucide-react';
import SafeImage from '../../components/common/SafeImage';
import ProductCard from '../../components/storefront/ProductCard';
import SectionHeading from '../../components/common/SectionHeading';
import Modal from '../../components/common/Modal';
import SEO from '../../components/common/SEO';
import { WhatsAppIcon } from '../../components/common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../components/common/Toast';
import { formatNaira } from '../../utils/format';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, getProductBySlug, settings, addEnquiry } = useStore();
  const { has, toggle } = useWishlist();
  const { addToast } = useToast();

  const product = getProductBySlug(slug);

  // Gallery state
  const [selectedImage, setSelectedImage] = useState(product?.image);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);

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
      <div className="container-page py-20 text-center">
        <h2 className="text-2xl font-bold text-[#1F1612]">Product not found</h2>
        <p className="text-[#7A6E65] mt-2">The furniture piece you are looking for may have been moved.</p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">
          Browse Furniture Catalog
        </Link>
      </div>
    );
  }

  const isSaved = has(product.id);

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id && p.status === 'published')
    .slice(0, 4);

  // WhatsApp Enquiry Link
  const colorText = selectedColor ? ` Color: ${selectedColor}.` : '';
  const qtyText = quantity > 1 ? ` Qty: ${quantity}.` : '';
  const whatsappMsg = `${settings.whatsappGreeting} "${product.name}" (${formatNaira(product.price)}).${colorText}${qtyText} Is this available for delivery in Abuja?`;
  const whatsappUrl = buildWhatsAppLink(settings.whatsappNumber, whatsappMsg);

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
      message: customerMessage.trim() || `Interested in ${quantity}x ${product.name} (${selectedColor || 'Default'}).`,
    });
    setIsSubmitting(false);
    setEnquiryModalOpen(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setCustomerMessage('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Home & More Furniture:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast({ message: 'Product link copied to clipboard!', type: 'success' });
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

  return (
    <div className="container-page py-6 sm:py-10">
      <SEO
        title={`${product.name} | Premium Furniture Abuja`}
        description={`${product.name} - ${formatNaira(product.price)}. ${product.tagline || product.description || 'Modern luxury furniture handcrafted for Nigerian homes.'} Fast delivery in Abuja.`}
        canonical={`/product/${product.slug}`}
        image={product.image}
        schema={productSchema}
      />

      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#7A6E65] hover:text-[#E05A00] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to products</span>
        </button>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Large Main Image */}
          <div className="relative rounded-3xl overflow-hidden bg-[#FAF7F4] border border-[#EDE5DC] shadow-card aspect-[4/3] flex items-center justify-center p-4">
            <SafeImage
              src={selectedImage || product.image}
              alt={product.name}
              aspectRatio="aspect-auto"
              className="w-full h-full object-contain"
            />

            {/* Quick action buttons on image */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share product"
                className="p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-sm border border-[#EDE5DC]/60 text-[#1F1612] hover:text-[#E05A00] hover:bg-white transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toggle(product.id, product.name)}
                aria-label="Toggle wishlist"
                className="p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-sm border border-[#EDE5DC]/60 transition-all hover:bg-white"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isSaved ? 'fill-[#E05A00] text-[#E05A00]' : 'text-[#7A6E65] hover:text-[#E05A00]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Thumbnails list */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white ${
                    selectedImage === img
                      ? 'border-[#E05A00] shadow-md scale-102'
                      : 'border-[#EDE5DC] opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumb ${i + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E05A00] bg-[#FDF5EF] px-3 py-1 rounded-full border border-[#E05A00]/30">
              SKU: {product.sku}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1612] mt-3 tracking-tight">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-sm font-medium text-[#7A6E65] mt-1">{product.tagline}</p>
            )}

            {/* Price block */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#E05A00]">
                {formatNaira(product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-base text-[#7A6E65] line-through">
                  {formatNaira(product.discountPrice)}
                </span>
              )}
              {product.stock > 0 ? (
                <span className="ml-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock Abuja ({product.stock} available)
                </span>
              ) : (
                <span className="ml-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  Made to Order
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-[#EDE5DC] pt-4">
            <p className="text-sm text-[#1F1612]/90 leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          {/* Color Variations (if applicable) */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#1F1612] tracking-wider">
                Select Finish / Fabric: <span className="text-[#E05A00]">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedColor === color
                        ? 'bg-[#E05A00] text-white shadow-sm'
                        : 'bg-white text-[#1F1612] border border-[#EDE5DC] hover:border-[#E05A00]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <label className="text-xs font-bold uppercase text-[#1F1612] tracking-wider">
              Quantity:
            </label>
            <div className="flex items-center rounded-full border border-[#EDE5DC] bg-white p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#1F1612] hover:bg-[#FDF5EF] transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-[#1F1612]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#1F1612] hover:bg-[#FDF5EF] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            {/* Primary: Buy via WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#E05A00] to-[#C84800] hover:from-[#C84800] hover:to-[#B33E00] text-white py-3.5 px-6 font-bold text-sm sm:text-base shadow-md shadow-orange-950/15 hover:shadow-lg transition-all"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              <span>Buy via WhatsApp ({formatNaira(product.price * quantity)})</span>
            </a>

            {/* Secondary: Request On-Site Callback / Enquiry */}
            <button
              type="button"
              onClick={() => setEnquiryModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-full border border-[#EDE5DC] bg-white hover:bg-[#FDF5EF] text-[#1F1612] hover:text-[#E05A00] py-3 px-6 font-semibold text-sm transition-all"
            >
              <Send className="w-4 h-4 text-[#E05A00]" />
              <span>Submit Enquiry / Custom Quote</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="rounded-2xl border border-[#EDE5DC] bg-[#FAF8F5] p-4 space-y-3 text-xs text-[#7A6E65]">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-[#E05A00] shrink-0" />
              <span>White-glove delivery &amp; assembly available throughout Abuja.</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#E05A00] shrink-0" />
              <span>12-month craftsmanship guarantee on all solid timber frames.</span>
            </div>
            <div className="flex items-center gap-3">
              <PackageCheck className="w-4 h-4 text-[#E05A00] shrink-0" />
              <span>Inspected and verified before dispatch to your home.</span>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="border-t border-[#EDE5DC] pt-5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1612]">
              Specifications
            </h4>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#EDE5DC]">
                <dt className="text-[#7A6E65]">Dimensions</dt>
                <dd className="font-semibold text-[#1F1612] mt-0.5">{product.dimensions || 'Custom Specification'}</dd>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#EDE5DC]">
                <dt className="text-[#7A6E65]">Primary Material</dt>
                <dd className="font-semibold text-[#1F1612] mt-0.5">{product.material || 'Kiln-Dried Hardwood'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 sm:mt-20 border-t border-[#EDE5DC] pt-12">
          <SectionHeading
            title="Complete Your Room"
            subtitle="Complementary furniture pieces matching this aesthetic"
            actionLabel="View Category"
            actionTo={`/category/${product.categorySlug}`}
          />
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Enquiry Modal */}
      <Modal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        title={`Enquire about ${product.name}`}
      >
        <form onSubmit={handleEnquirySubmit} className="space-y-4">
          <p className="text-xs text-[#7A6E65]">
            Our sales team in Abuja will review your enquiry and contact you immediately via phone or WhatsApp.
          </p>

          <div>
            <label className="block text-xs font-bold text-[#1F1612] uppercase mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Hajia Fatima Bello"
              className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5DC] text-sm focus:outline-none focus:border-[#E05A00]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F1612] uppercase mb-1">
              Phone Number (WhatsApp) *
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+234 803 351 3144"
              className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5DC] text-sm focus:outline-none focus:border-[#E05A00]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F1612] uppercase mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5DC] text-sm focus:outline-none focus:border-[#E05A00]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F1612] uppercase mb-1">
              Delivery Address or Specific Request
            </label>
            <textarea
              rows={3}
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              placeholder="e.g. Delivery to Maitama, Abuja. Would like to see fabric swatches."
              className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5DC] text-sm focus:outline-none focus:border-[#E05A00]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setEnquiryModalOpen(false)}
              className="btn-secondary text-xs py-2.5 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-xs py-2.5 px-5 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Send Enquiry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
