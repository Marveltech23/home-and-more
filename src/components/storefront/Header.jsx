import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  Phone,
  MapPin,
  Truck,
  ArrowRight,
} from 'lucide-react';
import Logo from '../common/Logo';
import { WhatsAppIcon } from '../common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { useWishlist } from '../../context/WishlistContext';
import { categories as initialCategories } from '../../data/categories';
import { buildWhatsAppLink, DEFAULT_WHATSAPP_NUMBER } from '../../utils/whatsapp';

const PRIMARY_NAV_SLUGS = [
  'sofa-sets',
  'bedroom-sets',
  'dining-sets',
  'center-table',
  'office-furniture',
  'single-chairs',
];

export default function Header() {
  const { settings, categories, featuredProducts } = useStore();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const activeCategories = (categories && categories.length > 0 ? categories : initialCategories)
    .filter((c) => c.isActive !== false)
    .sort((a, b) => (Number(a.displayOrder) || 99) - (Number(b.displayOrder) || 99));

  const primaryCatLinks = PRIMARY_NAV_SLUGS.map((slug) =>
    activeCategories.find((c) => c.slug === slug)
  ).filter(Boolean);

  const featuredSpotlight = featuredProducts?.[0];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const megaMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setMegaMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const navLinkClass = ({ isActive }) =>
    `relative py-3 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
      isActive
        ? 'text-[#F36B0A] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#F36B0A]'
        : 'text-[#24150F] hover:text-[#F36B0A]'
    }`;

  const phoneDisplay = settings.phone || '+234 803 351 3144';
  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber || DEFAULT_WHATSAPP_NUMBER,
    'Hello Home & More Furniture, I am browsing your showroom website and would like to enquire about your furniture collections.'
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/98 backdrop-blur-md border-b border-[#EAE2D9]">
      {/* 1. REFINED ANNOUNCEMENT BAR */}
      <div className="bg-[#24150F] text-white text-[11px] sm:text-xs py-2 px-4">
        <div className="container-page flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-5 text-white/85">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F36B0A]" />
              <span>Abuja Showroom: 3rd Avenue, Gwarinpa</span>
            </span>
            <span className="text-white/25">|</span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#F36B0A]" />
              <span>White-Glove Delivery &amp; Installation Across Abuja</span>
            </span>
          </div>

          <div className="flex md:hidden items-center gap-1.5 text-[11px] text-white/90 truncate">
            <Truck className="w-3.5 h-3.5 text-[#F36B0A] shrink-0" />
            <span className="truncate">Abuja Showroom • Fast Delivery &amp; Setup</span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href={`tel:${phoneDisplay.replace(/\s+/g, '')}`}
              className="hidden sm:flex items-center gap-1.5 text-white/85 hover:text-[#F36B0A] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#F36B0A]" />
              <span>{phoneDisplay}</span>
            </a>
            <span className="hidden sm:inline text-white/25">|</span>
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#4ADE80] hover:text-white transition-colors font-semibold"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN 3-ZONE SHOWROOM UTILITY BAR (Search Left | Logo Center | Actions Right) */}
      <div className="container-page py-3 sm:py-3.5">
        <div className="grid grid-cols-12 items-center gap-3">
          {/* Left: Desktop Search Input / Mobile Menu & Search */}
          <div className="col-span-3 lg:col-span-4 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-[#24150F] hover:bg-[#FAF7F3]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-lg text-[#24150F] hover:bg-[#FAF7F3]"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center relative w-full max-w-xs"
            >
              <Search className="absolute left-3.5 w-4 h-4 text-[#786B62] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sofas, tables, beds..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-[#F7F3EE] border border-[#EAE2D9] text-xs text-[#24150F] placeholder-[#786B62] focus:outline-none focus:bg-white focus:border-[#F36B0A] transition-colors"
              />
            </form>
          </div>

          {/* Center: Prominent Brand Logo */}
          <div className="col-span-6 lg:col-span-4 flex justify-center">
            <Logo size="md" />
          </div>

          {/* Right: Wishlist & Direct WhatsApp CTA */}
          <div className="col-span-3 lg:col-span-4 flex items-center justify-end gap-2 sm:gap-3">
            <Link
              to="/wishlist"
              className="relative inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-full text-[#24150F] hover:bg-[#FAF7F3] hover:text-[#F36B0A] transition-colors"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden xl:inline text-xs font-medium">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:static sm:ml-0.5 w-4 h-4 rounded-full bg-[#F36B0A] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#1EAA52] hover:bg-[#179045] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:shadow-md"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. STICKY UPPERCASE SHOWROOM CATEGORY BAR (Desktop) */}
      <div className="hidden lg:block border-t border-[#EAE2D9]/80 bg-white">
        <div className="container-page">
          <nav className="flex items-center justify-center gap-6 xl:gap-7">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>

            {/* Shop All Furniture Mega-Menu */}
            <div
              className="relative"
              ref={megaMenuRef}
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setMegaMenuOpen((prev) => !prev)}
                className={`flex items-center gap-1 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                  megaMenuOpen ? 'text-[#F36B0A]' : 'text-[#24150F] hover:text-[#F36B0A]'
                }`}
              >
                <span>Shop All Furniture</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    megaMenuOpen ? 'rotate-180 text-[#F36B0A]' : ''
                  }`}
                />
              </button>

              {megaMenuOpen && (
                <div className="absolute left-0 top-full w-[660px] max-w-[calc(100vw-2rem)] rounded-b-2xl bg-white p-6 shadow-2xl border border-[#EAE2D9] z-50">
                  <div className="grid grid-cols-12 gap-6">
                    {/* All 11 Categories in 2 Clean Columns */}
                    <div className="col-span-7 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#EAE2D9] pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#786B62]">
                          All Furniture Departments
                        </span>
                        <Link
                          to="/shop"
                          onClick={() => setMegaMenuOpen(false)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#F36B0A] hover:underline"
                        >
                          <span>View Full Catalog</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {activeCategories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.slug}`}
                            onClick={() => setMegaMenuOpen(false)}
                            className="py-1.5 px-2 rounded-lg text-xs font-medium text-[#24150F] hover:bg-[#FAF7F3] hover:text-[#F36B0A] transition-colors flex items-center justify-between group"
                          >
                            <span>{cat.name}</span>
                            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#F36B0A]" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Featured Showroom Spotlight Card */}
                    {featuredSpotlight && (
                      <div className="col-span-5 border-l border-[#EAE2D9] pl-5 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F36B0A]">
                            Showroom Highlight
                          </span>
                          <Link
                            to={`/shop/${featuredSpotlight.slug}`}
                            onClick={() => setMegaMenuOpen(false)}
                            className="block mt-2 group"
                          >
                            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#EAE2D9] bg-[#FAF7F3]">
                              <img
                                src={featuredSpotlight.image}
                                alt={featuredSpotlight.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <p className="mt-2.5 text-xs font-bold text-[#24150F] group-hover:text-[#F36B0A] line-clamp-1">
                              {featuredSpotlight.name}
                            </p>
                            <p className="text-[11px] text-[#786B62] line-clamp-2 mt-0.5">
                              {featuredSpotlight.tagline}
                            </p>
                          </Link>
                        </div>

                        <Link
                          to={`/shop/${featuredSpotlight.slug}`}
                          onClick={() => setMegaMenuOpen(false)}
                          className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#F36B0A] hover:underline"
                        >
                          <span>Explore Piece</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Quick Category Links */}
            {primaryCatLinks.map((cat) => (
              <NavLink
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={navLinkClass}
              >
                {cat.name}
              </NavLink>
            ))}

            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/blog" className={navLinkClass}>
              Journal
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>
        </div>
      </div>

      {/* MOBILE SEARCH DRAWER */}
      {mobileSearchOpen && (
        <div className="lg:hidden border-t border-[#EAE2D9] bg-[#FAF7F3] py-3 px-4">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-[#786B62]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sofas, center tables, beds..."
              className="w-full pl-10 pr-24 py-2.5 rounded-full border border-[#EAE2D9] bg-white text-sm text-[#24150F] focus:outline-none focus:border-[#F36B0A]"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 rounded-full bg-[#F36B0A] text-white text-xs font-semibold"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EAE2D9] bg-white px-5 py-6 space-y-5 shadow-2xl max-h-[82vh] overflow-y-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-[#786B62]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entire showroom..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#EAE2D9] bg-[#FAF7F3] text-sm text-[#24150F] focus:outline-none focus:border-[#F36B0A]"
            />
          </form>

          <nav className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold uppercase tracking-wider text-[#24150F] hover:text-[#F36B0A]"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold uppercase tracking-wider text-[#F36B0A]"
            >
              Shop All Furniture
            </Link>

            {/* Mobile Categories Grid */}
            <div className="grid grid-cols-2 gap-1.5 pl-3 py-2 border-l-2 border-[#EAE2D9]">
              {activeCategories.map((c) => (
                <Link
                  key={c.id}
                  to={`/category/${c.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 text-xs font-medium text-[#786B62] hover:text-[#F36B0A]"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold uppercase tracking-wider text-[#24150F] hover:text-[#F36B0A]"
            >
              About &amp; Showroom
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold uppercase tracking-wider text-[#24150F] hover:text-[#F36B0A]"
            >
              Design Journal
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold uppercase tracking-wider text-[#24150F] hover:text-[#F36B0A]"
            >
              Contact Us
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm font-semibold uppercase tracking-wider text-[#24150F] hover:text-[#F36B0A] flex items-center justify-between"
            >
              <span>Saved Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-[#F36B0A] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </nav>

          <div className="pt-4 border-t border-[#EAE2D9]">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#1EAA52] hover:bg-[#179045] text-white py-3 rounded-full font-semibold text-sm shadow-sm"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              <span>Order / Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
