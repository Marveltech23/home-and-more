import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Truck,
  Wrench,
  ShieldCheck,
  CreditCard,
  Minus,
  Plus,
  Send,
  ArrowLeft,
  Share2,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
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
import { buildProductWhatsAppLink, isProductPriceVisible } from '../../utils/whatsapp';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, categories, getProductBySlug, settings, addEnquiry } = useStore();
  const { has, toggle } = useWishlist();
  const { addToast } = useToast();

  const product = getProductBySlug(slug);

  const [selectedImage, setSelectedImage] = useState(product?.image);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'specs' | 'delivery'
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Enquiry modal state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedColor(product.colors?.[0] || '');
      setQuantity(1);
      setActiveTab('description');
      setLightboxOpen(false);
      window.scrollTo(0, 0);
    }
  }, [slug, product]);

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h2 className="font-editorial text-3xl font-semibold text-[#24150F]">Product not found</h2>
        <p className="text-sm text-[#786B62] mt-2">
          The furniture piece you are looking for may have been moved.
        </p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex text-sm">
          Browse Furniture Catalog
        </Link>
      </div>
    );
  }

  const isSaved = has(product.id);
  const priceVisible = isProductPriceVisible(product, settings);
  const categoryObj = (categories || []).find((c) => c.slug === product.categorySlug);

  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id && p.status === 'published')
    .slice(0, 4);

  const whatsappUrl = buildProductWhatsAppLink(product, {
    settings,
    categories,
    selectedColor,
    quantity,
    showPrice: priceVisible,
  });

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
      price: priceVisible ? product.price * quantity : 0,
      message:
        customerMessage.trim() ||
        `Interested in ${quantity}x ${product.name} (${selectedColor || 'Default'}).`,
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
      navigator
        .share({
          title: product.name,
          text: `Check out ${product.name} on Home & More Furniture:`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast({ message: 'Product link copied to clipboard!', type: 'success' });
    }
  };

  const galleryImages =
    product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const currentGalleryIdx = Math.max(0, galleryImages.indexOf(selectedImage || product.image));

  const discountPct =
    priceVisible && product.discountPrice && product.discountPrice > product.price
      ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)
      : 0;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description || product.tagline,
    sku: product.sku || product.id,
    brand: { '@type': 'Brand', name: 'Home & More Furniture' },
    offers: {
      '@type': 'Offer',
      url: `https://www.homeandmorefurniture.com/product/${product.slug}`,
      priceCurrency: 'NGN',
      ...(priceVisible ? { price: product.price } : {}),
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'Home & More Furniture' },
    },
  };

  return (
    <div className="container-page py-6 sm:py-10">
      <SEO
        title={`${product.name} | Premium Furniture Abuja`}
        description={`${product.name}${priceVisible ? ` - ${formatNaira(product.price)}` : ''}. ${product.tagline || product.description || 'Modern luxury furniture handcrafted for Nigerian homes.'} Fast delivery in Abuja.`}
        canonical={`/product/${product.slug}`}
        image={product.image}
        schema={productSchema}
      />

      {/* Breadcrumbs & Back Link */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#786B62]">
          <Link to="/" className="hover:text-[#F36B0A]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#F36B0A]">Shop</Link>
          {categoryObj && (
            <>
              <span>/</span>
              <Link to={`/category/${categoryObj.slug}`} className="hover:text-[#F36B0A]">
                {categoryObj.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#24150F] truncate max-w-[180px] sm:max-w-xs">{product.name}</span>
        </nav>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#786B62] hover:text-[#F36B0A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Editorial 2-Column Showroom Layout (58% Gallery / 42% Purchase Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: Large Gallery with Click-to-Zoom */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-white border border-[#EAE2D9] aspect-[4/3] flex items-center justify-center p-3 sm:p-5 group">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="Zoom product image"
              className="w-full h-full flex items-center justify-center cursor-zoom-in"
            >
              <SafeImage
                src={selectedImage || product.image}
                alt={product.name}
                aspectRatio="aspect-auto"
                fit="contain"
                className="w-full h-full"
              />
            </button>

            {discountPct > 0 && (
              <span className="absolute top-4 left-4 bg-[#F36B0A] text-white text-xs font-bold px-3 py-1 rounded-sm">
                Save {discountPct}%
              </span>
            )}

            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Enlarge image"
                className="p-2.5 rounded-full bg-white/95 border border-[#EAE2D9] shadow-xs text-[#24150F] hover:border-[#F36B0A] hover:text-[#F36B0A] transition-all"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share product"
                className="p-2.5 rounded-full bg-white/95 border border-[#EAE2D9] shadow-xs text-[#24150F] hover:border-[#F36B0A] hover:text-[#F36B0A] transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toggle(product.id, product.name)}
                aria-label="Toggle wishlist"
                className="p-2.5 rounded-full bg-white/95 border border-[#EAE2D9] shadow-xs hover:border-[#F36B0A] transition-all"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isSaved ? 'fill-[#F36B0A] text-[#F36B0A]' : 'text-[#786B62] hover:text-[#F36B0A]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Horizontal Thumbnail Strip */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white ${
                    (selectedImage || product.image) === img
                      ? 'border-[#F36B0A] shadow-sm'
                      : 'border-[#EAE2D9] opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Concierge Purchase Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-36 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE2D9]">
          <div>
            <div className="flex items-center justify-between gap-2">
              {categoryObj && (
                <Link
                  to={`/category/${categoryObj.slug}`}
                  className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#F36B0A] hover:underline"
                >
                  {categoryObj.name}
                </Link>
              )}
              {product.sku && (
                <span className="text-[11px] font-mono text-[#786B62]">SKU: {product.sku}</span>
              )}
            </div>

            <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#24150F] mt-2 leading-tight">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="text-sm text-[#786B62] mt-1.5 leading-relaxed">{product.tagline}</p>
            )}

            {/* Price & Stock Block (Respects Admin Price Visibility Toggle) */}
            <div className="mt-4 pt-4 border-t border-[#EAE2D9] flex flex-wrap items-baseline gap-3">
              {priceVisible && (
                <>
                  <span className="text-2xl sm:text-3xl font-bold text-[#24150F]">
                    {formatNaira(product.price)}
                  </span>
                  {product.discountPrice && product.discountPrice > product.price && (
                    <span className="text-base text-[#786B62] line-through">
                      {formatNaira(product.discountPrice)}
                    </span>
                  )}
                </>
              )}
              {product.stock > 0 ? (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  Made to Order
                </span>
              )}
            </div>
          </div>

          {/* Finish / Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#24150F]">
                Finish / Upholstery: <span className="text-[#F36B0A] font-semibold">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedColor === color
                        ? 'bg-[#24150F] text-white'
                        : 'bg-[#FAF7F3] text-[#24150F] border border-[#EAE2D9] hover:border-[#F36B0A]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="flex items-center gap-4">
            <label className="text-xs font-bold uppercase tracking-wider text-[#24150F]">
              Quantity:
            </label>
            <div className="flex items-center rounded-full border border-[#EAE2D9] bg-[#FAF7F3] p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#24150F] hover:bg-white transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-[#24150F]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#24150F] hover:bg-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Primary WhatsApp Order CTA + Custom Quote */}
          <div className="space-y-3 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 rounded-full bg-[#1EAA52] hover:bg-[#179045] text-white py-3.5 px-6 font-bold text-sm sm:text-base shadow-md transition-all hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white shrink-0" />
              <span>
                {priceVisible
                  ? `Order via WhatsApp (${formatNaira(product.price * quantity)})`
                  : 'Order via WhatsApp'}
              </span>
            </a>

            <button
              type="button"
              onClick={() => setEnquiryModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-full border border-[#EAE2D9] bg-[#FAF7F3] hover:border-[#F36B0A] hover:text-[#F36B0A] text-[#24150F] py-3 px-6 font-semibold text-xs sm:text-sm transition-all"
            >
              <Send className="w-4 h-4 text-[#F36B0A]" />
              <span>Request Custom Sizing / Callback</span>
            </button>
          </div>

          {/* Baffi-Inspired 4-Row Vertical Trust Stack */}
          <div className="pt-4 border-t border-[#EAE2D9] space-y-3 text-xs text-[#786B62]">
            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-[#F36B0A] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#24150F]">Fast Abuja Delivery:</strong> Careful 24–48hr delivery within Abuja &amp; nationwide crated freight.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Wrench className="w-4 h-4 text-[#F36B0A] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#24150F]">White-Glove Installation:</strong> Unboxing, room placement, and complete assembly by our team.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#F36B0A] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#24150F]">Quality Guarantee:</strong> 12-month craftsmanship guarantee on kiln-dried hardwood frames.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="w-4 h-4 text-[#F36B0A] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#24150F]">Trusted Payment:</strong> Pay at our Gwarinpa Showroom or via verified bank transfer.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BELOW THE FOLD: Clean Tabbed Description / Specifications / Delivery */}
      <section className="mt-12 bg-white rounded-2xl border border-[#EAE2D9] overflow-hidden">
        <div className="flex items-center gap-1 border-b border-[#EAE2D9] px-3 sm:px-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'description', label: 'Description', mobileLabel: 'Description' },
            { id: 'specs', label: 'Specifications', mobileLabel: 'Specs' },
            { id: 'delivery', label: 'Delivery & Installation', mobileLabel: 'Delivery' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-3 sm:px-4 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-[#F36B0A] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#F36B0A]'
                  : 'text-[#786B62] hover:text-[#24150F]'
              }`}
            >
              <span className="sm:hidden">{tab.mobileLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8 text-sm text-[#24150F]/90 leading-relaxed">
          {activeTab === 'description' && (
            <div className="max-w-3xl space-y-3">
              <p>{product.description}</p>
              <p className="text-xs text-[#786B62]">
                Need custom room dimensions, fabric swatches, or matching pieces? Contact our Gwarinpa showroom advisors directly on WhatsApp.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#EAE2D9]">
                <dt className="text-[#786B62] uppercase tracking-wider text-[10px] font-bold">Dimensions</dt>
                <dd className="font-semibold text-[#24150F] mt-1">{product.dimensions || 'Standard / Custom'}</dd>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#EAE2D9]">
                <dt className="text-[#786B62] uppercase tracking-wider text-[10px] font-bold">Materials</dt>
                <dd className="font-semibold text-[#24150F] mt-1">{product.material || 'Kiln-Dried Hardwood'}</dd>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#EAE2D9]">
                <dt className="text-[#786B62] uppercase tracking-wider text-[10px] font-bold">Available Finishes</dt>
                <dd className="font-semibold text-[#24150F] mt-1">
                  {product.colors?.length ? product.colors.join(', ') : 'Customizable'}
                </dd>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#EAE2D9]">
                <dt className="text-[#786B62] uppercase tracking-wider text-[10px] font-bold">Reference SKU</dt>
                <dd className="font-semibold font-mono text-[#24150F] mt-1">{product.sku || product.id}</dd>
              </div>
            </dl>
          )}

          {activeTab === 'delivery' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-[#786B62]">
              <div className="space-y-2">
                <h4 className="font-bold text-[#24150F]">Abuja &amp; Nationwide Delivery</h4>
                <p>
                  In-stock pieces are delivered within 24–48 hours across Abuja (Gwarinpa, Maitama, Asokoro, Wuse 2, Jabi, Guzape, Central Area) with full room setup. Nationwide deliveries (Lagos, Port Harcourt, Kano, Enugu, Kaduna) are shipped via protected wooden crating.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-[#24150F]">Visit Our Abuja Showroom &amp; Factory</h4>
                <p>
                  <strong className="text-[#24150F]">Showroom:</strong> {settings.showroomAddress || '204 Pa Michael Imoudu Ave, 32 Cres, 3rd Avenue Gwarinpa, 900108, Abuja, Nigeria'}
                </p>
                <p>
                  <strong className="text-[#24150F]">Factory:</strong> {settings.factoryAddress || 'Plot D10 Zauda Pazeri Dei-Dei, Abuja'}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#EAE2D9]">
          <SectionHeading
            eyebrow="You May Also Like"
            title="Complete Your Room"
            subtitle="Complementary furniture pieces curated from the same department."
            actionLabel="View Department"
            actionTo={`/category/${product.categorySlug}`}
          />
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Fullscreen Image Zoom Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close zoom"
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white"
          >
            <X className="w-6 h-6" />
          </button>

          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const prevIdx = currentGalleryIdx === 0 ? galleryImages.length - 1 : currentGalleryIdx - 1;
                  setSelectedImage(galleryImages[prevIdx]);
                }}
                aria-label="Previous photo"
                className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/15 hover:bg-white/25 text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const nextIdx = (currentGalleryIdx + 1) % galleryImages.length;
                  setSelectedImage(galleryImages[nextIdx]);
                }}
                aria-label="Next photo"
                className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/15 hover:bg-white/25 text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <img
            src={selectedImage || product.image}
            alt={product.name}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[92vw] max-h-[86vh] object-contain rounded-xl bg-white p-2 shadow-2xl"
          />
        </div>
      )}

      {/* Custom Enquiry Modal */}
      <Modal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        title={`Enquire about ${product.name}`}
      >
        <form onSubmit={handleEnquirySubmit} className="space-y-4">
          <p className="text-xs text-[#786B62]">
            Our Abuja showroom advisors will review your enquiry and contact you promptly via phone or WhatsApp.
          </p>

          <div>
            <label className="block text-xs font-bold text-[#24150F] uppercase mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Hajia Fatima Bello"
              className="w-full px-4 py-2.5 rounded-xl border border-[#EAE2D9] text-sm focus:outline-none focus:border-[#F36B0A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24150F] uppercase mb-1">
              Phone Number (WhatsApp) *
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+234 803 351 3144"
              className="w-full px-4 py-2.5 rounded-xl border border-[#EAE2D9] text-sm focus:outline-none focus:border-[#F36B0A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24150F] uppercase mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#EAE2D9] text-sm focus:outline-none focus:border-[#F36B0A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24150F] uppercase mb-1">
              Delivery Address or Custom Request
            </label>
            <textarea
              rows={3}
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              placeholder="e.g. Delivery to Maitama, Abuja. Would like to see fabric swatches."
              className="w-full px-4 py-2.5 rounded-xl border border-[#EAE2D9] text-sm focus:outline-none focus:border-[#F36B0A]"
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
