import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FileText,
  Image as ImageIcon,
  Megaphone,
  ShoppingBag,
  Layers,
  Settings,
  Users,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import Logo from '../components/common/Logo';
import { useStore } from '../context/StoreContext';
import { useToast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { enquiries, activeAds } = useStore();
  const { addToast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');

  const pendingEnquiriesCount = enquiries.filter((e) => e.status === 'pending').length || 12;

  const navItems = [
    { label: 'Executive Overview', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Product Atelier', to: '/admin/products', icon: Package },
    { label: 'Showroom Categories', to: '/admin/categories', icon: FolderTree },
    { label: 'Gazette Essays', to: '/admin/blogs', icon: FileText },
    { label: 'Media Archive', to: '/admin/media', icon: ImageIcon },
    { label: 'Curated Campaigns', to: '/admin/advertisements', icon: Megaphone },
    {
      label: 'Client Orders & Enquiries',
      to: '/admin/orders',
      icon: ShoppingBag,
      badge: pendingEnquiriesCount,
    },
    { label: 'Client Endorsements', to: '/admin/testimonials', icon: Users },
    { label: 'Atelier Settings', to: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    addToast({ message: 'Concluded atelier admin session', type: 'info' });
    navigate('/admin/login');
  };

  const handleAdminSearch = (e) => {
    e.preventDefault();
    if (adminSearch.trim()) {
      navigate(`/admin/products?search=${encodeURIComponent(adminSearch.trim())}`);
      setAdminSearch('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col lg:flex-row text-[#1C1815]">
      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1C1815]/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. ARCHITECTURAL SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1C1815] text-[#FBF9F5] flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 border-r border-[#2C2621] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
          {/* Sidebar Top: Logo & Close */}
          <div className="p-6 flex items-center justify-between border-b border-[#2C2621]">
            <Logo variant="light" size="md" />
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#A69E93] hover:text-[#FBF9F5]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 flex-1">
            <div className="px-4 py-2 text-[10px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold">
              Retail Operations
            </div>

            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 text-xs tracking-wider transition-all group ${
                    isActive
                      ? 'bg-[#2A241F] text-[#FBF9F5] font-semibold border-l-2 border-[#C4A470]'
                      : 'text-[#A69E93] hover:text-[#FBF9F5] hover:bg-[#241F1A]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 shrink-0 stroke-[1.4]" />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge !== undefined && (
                    <span className="bg-[#8C6D3B] text-white text-[10px] font-bold px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </NavLink>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs tracking-wider text-rose-300 hover:text-rose-100 hover:bg-[#241F1A] transition-colors mt-6 border-t border-[#2C2621]/60 pt-4"
            >
              <LogOut className="w-4 h-4 stroke-[1.4]" />
              <span>Conclude Session</span>
            </button>
          </nav>

          {/* Sidebar Bottom: Atelier Badge */}
          <div className="p-4 mt-auto border-t border-[#2C2621]">
            <div className="p-4 bg-[#241F1A] border border-[#352E27] text-center space-y-1">
              <span className="text-[10px] uppercase tracking-ultra-caps text-[#C4A470] font-semibold block">
                Atelier Abuja CMS
              </span>
              <p className="text-xs font-luxury-serif text-[#FBF9F5]">
                Modern Living. Better You.
              </p>
              <p className="text-[10px] text-[#A69E93] font-light">
                Gwarinpa Showroom • Dei-Dei Workshop
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN BODY */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E8E3DA] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#1C1815] hover:bg-[#EFECE6]"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Admin Search Bar */}
            <form onSubmit={handleAdminSearch} className="relative w-48 sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#70685E]" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search collection catalogue..."
                className="w-full pl-9 pr-4 py-2 bg-[#FBF9F5] border border-[#E8E3DA] text-xs text-[#1C1815] focus:outline-none focus:border-[#1C1815] transition-colors"
              />
            </form>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* View Live Store */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs uppercase tracking-ultra-caps text-[#1C1815] border border-[#E8E3DA] hover:border-[#1C1815] transition-all bg-[#FBF9F5]"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[1.2]" />
            </Link>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                className="relative p-2 hover:bg-[#EFECE6] text-[#1C1815] transition-colors"
                aria-label="Notifications"
                onClick={() => addToast({ message: 'You have 3 new showroom enquiries pending', type: 'info' })}
              >
                <Bell className="w-4 h-4 stroke-[1.4]" />
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#8C6D3B] text-white text-[9px] font-bold flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            {/* Admin Profile Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 hover:bg-[#EFECE6] transition-colors"
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt="Admin Avatar"
                  className="w-8 h-8 object-cover border border-[#E8E3DA]"
                />
                <span className="hidden sm:inline text-xs font-semibold text-[#1C1815]">Director</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#70685E] hidden sm:inline" />
              </button>

              {profileDropdownOpen && (
                <div
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-48 bg-white p-2 shadow-xl border border-[#E8E3DA] z-50 text-xs font-normal space-y-1"
                >
                  <div className="px-3 py-2 border-b border-[#E8E3DA]">
                    <p className="font-semibold text-[#1C1815]">Atelier Operations</p>
                    <p className="text-[10px] text-[#70685E]">admin@homeandmore.ng</p>
                  </div>
                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-3 py-2 text-[#1C1815] hover:bg-[#EFECE6]"
                  >
                    Atelier Settings
                  </Link>
                  <Link
                    to="/"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-3 py-2 text-[#1C1815] hover:bg-[#EFECE6]"
                  >
                    View Storefront
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50"
                  >
                    Conclude Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
