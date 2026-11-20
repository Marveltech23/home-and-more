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
    `px-4 py-2 rounded-full text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#F36B0A] text-white shadow-sm font-semibold'
        : 'text-[#24150F] hover:text-[#F36B0A] hover:bg-[#F8EBDD]/50'
    }`;

  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber,
    `${settings.whatsappGreeting} your furniture catalog.`
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-[#D94D00] via-[#F36B0A] to-[#D94D00] text-white text-[12px] font-medium py-2 px-4 border-b border-orange-600/30">
        <div className="container-page flex items-center justify-between">
          {/* Left: Trust Badges */}
          <div className="hidden md:flex items-center gap-6">
            <span className="flex items-center gap-1.5 opacity-95">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-200" />
              Quality Guaranteed
            </span>
            <span className="opacity-40">|</span>
            <span className="flex items-center gap-1.5 opacity-95">
              <Truck className="w-3.5 h-3.5 text-orange-200" />
              Fast Delivery in Abuja
            </span>
            <span className="opacity-40">|</span>
            <span className="flex items-center gap-1.5 opacity-95">
              <Sparkles className="w-3.5 h-3.5 text-orange-200" />
              Trusted by Thousands
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
              className="hidden sm:flex items-center gap-1.5 hover:text-orange-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.phone}</span>
            </a>
            <span className="hidden sm:inline opacity-40">|</span>
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-orange-200 transition-colors font-semibold"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <div className="container-page py-3.5 sm:py-4 flex items-center justify-between gap-4">
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
              className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-[#24150F] hover:text-[#F36B0A] hover:bg-[#F8EBDD]/50 transition-colors"
            >
              <span>Shop</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  shopDropdownOpen ? 'rotate-180 text-[#F36B0A]' : ''
                }`}
              />
            </button>

            {shopDropdownOpen && (
              <div
                onMouseLeave={() => setShopDropdownOpen(false)}
                className="absolute left-0 mt-1 w-64 rounded-2xl bg-white p-3 shadow-2xl border border-[#F0DFD1] z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#82746B] px-3 py-1.5">
                  Browse by Category
                </div>
                <div className="flex flex-col gap-0.5">
                  <Link
                    to="/shop"
                    onClick={() => setShopDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-[#F36B0A] hover:bg-[#FFF3EA] transition-colors"
                  >
                    <span>All Furniture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      onClick={() => setShopDropdownOpen(false)}
                      className="px-3 py-1.5 rounded-xl text-sm text-[#24150F] hover:bg-[#F8EBDD]/60 hover:text-[#F36B0A] transition-colors"
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

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Search furniture"
            className="p-2.5 rounded-full text-[#24150F] hover:text-[#F36B0A] hover:bg-[#F8EBDD]/60 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative p-2.5 rounded-full text-[#24150F] hover:text-[#F36B0A] hover:bg-[#F8EBDD]/60 transition-colors"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F36B0A] text-[10px] font-bold text-white shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* WhatsApp CTA Button */}
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1eb956] text-white px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl text-[#24150F] hover:bg-[#F8EBDD]/60"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* SEARCH BAR ACCORDION */}
      {searchOpen && (
        <div className="border-t border-[#F0DFD1] bg-[#FFFAF5] py-3 px-4 animate-in fade-in slide-in-from-top-1">
          <div className="container-page">
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-[#82746B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sofas, dining tables, armchairs, beds..."
                className="w-full pl-12 pr-28 py-3 rounded-full border border-[#F0DFD1] bg-white text-sm focus:outline-none focus:border-[#F36B0A] shadow-inner text-[#24150F]"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-1.5 rounded-full bg-[#F36B0A] text-white text-xs font-semibold hover:bg-[#D94D00] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F0DFD1] bg-white px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-semibold text-[#24150F] hover:text-[#F36B0A]"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-semibold text-[#24150F] hover:text-[#F36B0A]"
            >
              Shop All Furniture
            </Link>

            {/* Mobile Categories Submenu */}
            <div className="pl-4 border-l-2 border-[#F0DFD1] space-y-1.5 py-1">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/category/${c.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-[#82746B] hover:text-[#F36B0A]"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-semibold text-[#24150F] hover:text-[#F36B0A]"
            >
              About Us
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-semibold text-[#24150F] hover:text-[#F36B0A]"
            >
              Blog
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-semibold text-[#24150F] hover:text-[#F36B0A]"
            >
              Contact
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-semibold text-[#24150F] hover:text-[#F36B0A] flex items-center justify-between"
            >
              <span>Saved Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-[#F36B0A] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </nav>

          <div className="pt-4 border-t border-[#F0DFD1]">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-full font-semibold text-sm shadow-md"
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
