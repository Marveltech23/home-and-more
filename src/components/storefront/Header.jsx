import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  Phone,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Logo from '../common/Logo';
import { WhatsAppIcon } from '../common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { useWishlist } from '../../context/WishlistContext';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function Header() {
  const { settings, categories } = useStore();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShopDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-[#E05A00] text-white shadow-sm font-semibold'
        : 'text-[#1F1612] hover:text-[#E05A00] hover:bg-[#FDF5EF]'
    }`;

  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber,
    `${settings.whatsappGreeting} your furniture catalog.`
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#EDE5DC] shadow-xs transition-colors">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-[#C84800] via-[#E05A00] to-[#C84800] text-white text-[12px] font-medium py-2 px-4">
        <div className="container-page flex items-center justify-between">
          {/* Left: Trust Badges */}
          <div className="hidden md:flex items-center gap-6">
            <span className="flex items-center gap-1.5 opacity-95">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-100" />
              100% Kiln-Dried Hardwood
            </span>
            <span className="opacity-40">|</span>
            <span className="flex items-center gap-1.5 opacity-95">
              <Truck className="w-3.5 h-3.5 text-orange-100" />
              White-Glove Delivery in Abuja
            </span>
            <span className="opacity-40">|</span>
            <span className="flex items-center gap-1.5 opacity-95">
              <Sparkles className="w-3.5 h-3.5 text-orange-100" />
              Direct Workshop Pricing
            </span>
          </div>

          {/* Center on mobile */}
          <div className="flex md:hidden items-center gap-2 text-[11px] font-normal truncate">
            <Truck className="w-3.5 h-3.5 shrink-0" />
            <span>Fast Delivery in Abuja &amp; Nationwide</span>
          </div>

          {/* Right: Phone & WhatsApp */}
          <div className="flex items-center gap-4 shrink-0 text-xs">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-orange-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.phone}</span>
            </a>
            <span className="hidden sm:inline opacity-40">|</span>
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-orange-100 transition-colors font-semibold"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <div className="container-page py-3 sm:py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Logo size="md" />

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>

          {/* Shop Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShopDropdownOpen((prev) => !prev)}
              onMouseEnter={() => setShopDropdownOpen(true)}
              className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-[#1F1612] hover:text-[#E05A00] hover:bg-[#FDF5EF] transition-colors"
            >
              <span>Shop</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  shopDropdownOpen ? 'rotate-180 text-[#E05A00]' : ''
                }`}
              />
            </button>

            {shopDropdownOpen && (
              <div
                onMouseLeave={() => setShopDropdownOpen(false)}
                className="absolute left-0 mt-2 w-72 rounded-2xl bg-white p-3 shadow-2xl border border-[#EDE5DC] z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] px-3 py-1.5">
                  Browse by Category
                </div>
                <div className="flex flex-col gap-0.5">
                  <Link
                    to="/shop"
                    onClick={() => setShopDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-[#E05A00] hover:bg-[#FDF5EF] transition-colors"
                  >
                    <span>All Furniture Suites</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      onClick={() => setShopDropdownOpen(false)}
                      className="px-3 py-1.5 rounded-xl text-sm text-[#1F1612] hover:bg-[#FDF5EF] hover:text-[#E05A00] transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/blog" className={navLinkClass}>
            Blog
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            className="p-2 rounded-full text-[#1F1612] hover:bg-[#FDF5EF] hover:text-[#E05A00] transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Link with Badge */}
          <Link
            to="/wishlist"
            className="relative p-2 rounded-full text-[#1F1612] hover:bg-[#FDF5EF] hover:text-[#E05A00] transition-colors"
            aria-label="View Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#E05A00] text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Header WhatsApp CTA Button */}
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E05A00] to-[#C84800] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl text-[#1F1612] hover:bg-[#FDF5EF]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* SEARCH BAR ACCORDION */}
      {searchOpen && (
        <div className="border-t border-[#EDE5DC] bg-[#FAF8F5] py-3 px-4 animate-in fade-in slide-in-from-top-1">
          <div className="container-page">
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-[#7A6E65]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sofas, dining tables, armchairs, beds..."
                className="w-full pl-12 pr-28 py-3 rounded-full border border-[#EDE5DC] bg-white text-sm focus:outline-none focus:border-[#E05A00] shadow-inner text-[#1F1612]"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-1.5 rounded-full bg-[#E05A00] text-white text-xs font-semibold hover:bg-[#C84800] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EDE5DC] bg-white px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-semibold text-[#1F1612] hover:text-[#E05A00]"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-semibold text-[#1F1612] hover:text-[#E05A00]"
            >
              Shop All Furniture
            </Link>

            {/* Mobile Categories Submenu */}
            <div className="pl-4 border-l-2 border-[#EDE5DC] space-y-1.5 py-1">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/category/${c.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-[#7A6E65] hover:text-[#E05A00]"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-semibold text-[#1F1612] hover:text-[#E05A00]"
            >
              About Us
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-semibold text-[#1F1612] hover:text-[#E05A00]"
            >
              Blog
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-semibold text-[#1F1612] hover:text-[#E05A00]"
            >
              Contact
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-semibold text-[#1F1612] hover:text-[#E05A00] flex items-center justify-between"
            >
              <span>Saved Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-[#E05A00] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </nav>

          <div className="pt-4 border-t border-[#EDE5DC]">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-full font-semibold text-sm shadow-md hover:bg-[#1EB956] transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
