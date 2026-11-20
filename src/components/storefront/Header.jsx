import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Clock,
  Phone
} from 'lucide-react';
import Logo from '../common/Logo';
import { WhatsAppIcon } from '../common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function Header() {
  const { settings, categories } = useStore();
  const { count: wishlistCount } = useWishlist();
  const { openCart, itemCount } = useCart();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);

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
    `text-xs uppercase tracking-wide-caps transition-all py-1.5 border-b ${
      isActive
        ? 'border-[#1C1815] text-[#1C1815] font-semibold'
        : 'border-transparent text-[#5C554E] hover:text-[#1C1815] hover:border-[#B89358]'
    }`;

  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber,
    `${settings.whatsappGreeting} your furniture showroom pieces.`
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FBF9F5] border-b border-[#E8E3DA]">
      {/* 1. TOP ANNOUNCEMENT BAR (Quiet Luxury Dark Espresso) */}
      <div className="bg-[#1C1815] text-[#D8CFBC] text-[11px] py-2 px-6 border-b border-white/5">
        <div className="container-page flex items-center justify-between">
          {/* Left: Showroom & Craftsmanship Credo */}
          <div className="hidden lg:flex items-center gap-6">
            <span className="flex items-center gap-1.5 opacity-90">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89358]"></span>
              Complimentary White-Glove Installation Across Abuja
            </span>
            <span className="opacity-30">|</span>
            <span className="flex items-center gap-1.5 opacity-90">
              <MapPin className="w-3.5 h-3.5 text-[#B89358]" />
              Showroom: 204 Pa Michael Imoudu Ave, Gwarinpa, Abuja
            </span>
            <span className="opacity-30">|</span>
            <span className="flex items-center gap-1.5 opacity-90">
              <Clock className="w-3.5 h-3.5 text-[#B89358]" />
              Mon &ndash; Sat: 9am &ndash; 7pm
            </span>
          </div>

          <div className="flex lg:hidden items-center gap-2 text-[10px] uppercase tracking-wider truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89358]"></span>
            <span>Abuja Showroom &bull; Nationwide Delivery</span>
          </div>

          {/* Right: Direct Concierge & WhatsApp */}
          <div className="flex items-center gap-5 shrink-0 text-[11px]">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="hidden sm:flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#B89358]" />
              <span>{settings.phone}</span>
            </a>
            <span className="hidden sm:inline opacity-30">|</span>
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#B89358] hover:text-white transition-colors uppercase tracking-wider font-semibold"
            >
              <WhatsAppIcon className="w-3 h-3 fill-current" />
              <span>Concierge Chat</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN ATELIER NAVIGATION */}
      <div className="container-page py-4 sm:py-5 flex items-center justify-between gap-6">
        
        {/* Left: Mobile Menu Trigger + Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-[#1C1815] hover:text-[#B89358] transition-colors"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo size="md" />
        </div>

        {/* Center: Curated Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>

          <NavLink to="/category/sofa-sets" className={navLinkClass}>
            Living Room
          </NavLink>

          <NavLink to="/category/dining-sets" className={navLinkClass}>
            Dining Sets
          </NavLink>

          <NavLink to="/category/bedroom-sets" className={navLinkClass}>
            Bedroom
          </NavLink>

          <NavLink to="/category/office-furniture" className={navLinkClass}>
            Executive Office
          </NavLink>

          <NavLink to="/category/tiles" className={navLinkClass}>
            Tiles &amp; Flooring
          </NavLink>

          {/* Catalog Dropdown with All 11 Categories */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShopDropdownOpen((prev) => !prev)}
              onMouseEnter={() => setShopDropdownOpen(true)}
              className="flex items-center gap-1 text-xs uppercase tracking-wide-caps text-[#5C554E] hover:text-[#1C1815] py-1.5 transition-colors"
            >
              <span>Catalog (11)</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  shopDropdownOpen ? 'rotate-180 text-[#B89358]' : ''
                }`}
              />
            </button>

            {shopDropdownOpen && (
              <div
                onMouseLeave={() => setShopDropdownOpen(false)}
                className="absolute left-1/2 -translate-x-1/2 mt-3 w-80 bg-white p-4 shadow-xl border border-[#E8E3DA] z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="text-[10px] font-bold uppercase tracking-ultra-caps text-[#9A9185] pb-2 border-b border-[#E8E3DA] mb-2">
                  All 11 Product Collections
                </div>
                <div className="grid grid-cols-1 gap-1 max-h-80 overflow-y-auto no-scrollbar">
                  <Link
                    to="/shop"
                    onClick={() => setShopDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#1C1815] hover:bg-[#FBF9F5] hover:text-[#B89358] transition-colors"
                  >
                    <span>View Complete Catalogue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id || cat.slug}
                      to={`/category/${cat.slug}`}
                      onClick={() => setShopDropdownOpen(false)}
                      className="px-3 py-1.5 text-xs text-[#5C554E] hover:text-[#1C1815] hover:bg-[#FBF9F5] transition-colors flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-[#9A9185]">&rarr;</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavLink to="/about" className={navLinkClass}>
            Craftsmanship
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Showroom
          </NavLink>
        </nav>

        {/* Right: Client Action Suite (Search, Saved, Bag, Showroom Booking) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Search Collection"
            className="p-2 text-[#1C1815] hover:text-[#B89358] transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Saved / Wishlist Link */}
          <Link
            to="/wishlist"
            aria-label="Saved Pieces"
            className="relative p-2 text-[#1C1815] hover:text-[#B89358] transition-colors"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#1C1815] text-[9px] font-mono text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Bag Drawer Toggle */}
          <button
            type="button"
            onClick={openCart}
            aria-label="Shopping Bag"
            className="relative p-2 text-[#1C1815] hover:text-[#B89358] transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline font-mono text-xs font-semibold">({itemCount})</span>
            {itemCount > 0 && (
              <span className="sm:hidden absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#B89358] text-[9px] font-mono text-white">
                {itemCount}
              </span>
            )}
          </button>

          {/* Private Consultation CTA */}
          <Link
            to="/contact"
            className="hidden xl:inline-flex btn-primary text-[11px] py-2 px-4 tracking-wide-caps font-semibold"
          >
            Book Visit
          </Link>
        </div>
      </div>

      {/* 3. SEARCH OVERLAY DRAWER */}
      {searchOpen && (
        <div className="border-t border-[#E8E3DA] bg-white px-6 py-4 animate-in fade-in slide-in-from-top-1 duration-200">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-4 h-4 text-[#7A7268] shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sectionals, travertine tables, executive desks, tiles..."
              className="flex-1 text-sm bg-transparent border-0 outline-none placeholder-[#9A9185] text-[#1C1815]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#7A7268] hover:text-black"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-[#1C1815] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#B89358] transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-1 text-[#7A7268] hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 4. MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />
          <div className="relative w-4/5 max-w-sm bg-[#FBF9F5] text-[#1C1815] h-full shadow-2xl border-r border-[#E8E3DA] flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-4">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#7A7268] hover:text-black"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-[10px] uppercase tracking-ultra-caps text-[#9A9185]">
                Curated Navigation
              </div>

              <nav className="flex flex-col space-y-3 text-sm uppercase tracking-wide-caps font-medium">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#B89358] py-1 border-b border-[#E8E3DA]/60"
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#B89358] py-1 border-b border-[#E8E3DA]/60 font-semibold text-[#B89358]"
                >
                  All Collections
                </Link>
                <Link
                  to="/category/sofa-sets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#B89358] py-1 border-b border-[#E8E3DA]/60"
                >
                  Sofa Sets
                </Link>
                <Link
                  to="/category/dining-sets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#B89358] py-1 border-b border-[#E8E3DA]/60"
                >
                  Dining Sets
                </Link>
                <Link
                  to="/category/bedroom-sets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#B89358] py-1 border-b border-[#E8E3DA]/60"
                >
                  Bedroom Sets
                </Link>
                <Link
                  to="/category/office-furniture"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#B89358] py-1 border-b border-[#E8E3DA]/60"
                >
                  Office Furniture
                </Link>
                <Link
                  to="/category/tiles"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#B89358] py-1 border-b border-[#E8E3DA]/60"
                >
                  Tiles &amp; Flooring
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#B89358] py-1 border-b border-[#E8E3DA]/60"
                >
                  Craftsmanship &amp; Story
                </Link>
                <Link
                  to="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#B89358] py-1 border-b border-[#E8E3DA]/60"
                >
                  Editorial Journal
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#B89358] py-1 border-b border-[#E8E3DA]/60"
                >
                  Showroom &amp; Factory
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-[#E8E3DA] space-y-3">
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#1C1815] text-white text-xs uppercase tracking-wide-caps font-semibold flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Showroom Concierge</span>
              </a>
              <p className="text-[10px] text-center text-[#7A7268]">
                Showroom: 204 Pa Michael Imoudu Ave, Gwarinpa, Abuja
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
