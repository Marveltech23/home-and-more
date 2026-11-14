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
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Products', to: '/admin/products', icon: Package },
    { label: 'Categories', to: '/admin/categories', icon: FolderTree },
    { label: 'Blog Posts', to: '/admin/blogs', icon: FileText },
    { label: 'Media Library', to: '/admin/media', icon: ImageIcon },
    { label: 'Advertisements', to: '/admin/advertisements', icon: Megaphone },
    {
      label: 'Orders & Enquiries',
      to: '/admin/orders',
      icon: ShoppingBag,
      badge: pendingEnquiriesCount,
    },
    { label: 'Testimonials', to: '/admin/testimonials', icon: Users },
    { label: 'Website Settings', to: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    addToast({ message: 'Logged out of admin session', type: 'info' });
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
    <div className="min-h-screen bg-[#FFFAF5] flex flex-col lg:flex-row text-[#24150F]">
      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#29160D]/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#29160D] text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
          {/* Sidebar Top: Logo & Close */}
          <div className="p-6 flex items-center justify-between border-b border-white/10">
            <Logo variant="light" size="md" />
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-[#F36B0A] text-white shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge !== undefined && (
                    <span className="bg-[#D94D00] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </NavLink>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-rose-300 hover:text-rose-100 hover:bg-white/10 transition-colors mt-4"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>

          {/* Decorative Sidebar Bottom Card matching screenshot */}
          <div className="p-4 mt-auto">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#431B0E] to-[#29160D] border border-orange-500/30 p-4 shadow-lg text-center">
              <div className="relative z-10 space-y-1">
                <div className="font-script text-2xl text-[#F36B0A]">
                  Better Living.
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-white">
                  Better You.
                </div>
                <p className="text-[10px] text-white/60 pt-1">
                  Home &amp; More Furniture CMS
                </p>
              </div>

              {/* Glowing decorative background */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#F36B0A]/20 blur-xl pointer-events-none" />
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN BODY */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#F0DFD1] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#24150F] hover:bg-[#F8EBDD]/60"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Admin Search Bar */}
            <form onSubmit={handleAdminSearch} className="relative w-48 sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#82746B]" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search anything..."
                className="w-full pl-9 pr-4 py-2 rounded-full border border-[#F0DFD1] bg-[#FFFAF5] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A] text-[#24150F]"
              />
            </form>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* View Live Store */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#F36B0A] bg-[#FFF3EA] border border-[#F36B0A]/30 hover:bg-[#F36B0A] hover:text-white transition-all"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                className="relative p-2 rounded-full hover:bg-[#F8EBDD]/60 text-[#24150F] transition-colors"
                aria-label="Notifications"
                onClick={() => addToast({ message: 'You have 3 new product enquiries pending', type: 'info' })}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#F36B0A] text-white text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            {/* Admin Profile Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-[#F8EBDD]/60 transition-colors"
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt="Admin Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-[#F0DFD1]"
                />
                <span className="hidden sm:inline text-xs font-bold text-[#24150F]">Admin</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#82746B] hidden sm:inline" />
              </button>

              {profileDropdownOpen && (
                <div
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-48 rounded-2xl bg-white p-2 shadow-2xl border border-[#F0DFD1] z-50 text-xs font-medium space-y-1 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3 py-2 border-b border-[#F0DFD1]">
                    <p className="font-bold text-[#24150F]">Super Admin</p>
                    <p className="text-[11px] text-[#82746B]">admin@homeandmore.ng</p>
                  </div>
                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-3 py-2 rounded-xl text-[#24150F] hover:bg-[#F8EBDD]/50 hover:text-[#F36B0A]"
                  >
                    Store Settings
                  </Link>
                  <Link
                    to="/"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-3 py-2 rounded-xl text-[#24150F] hover:bg-[#F8EBDD]/50 hover:text-[#F36B0A]"
                  >
                    View Storefront
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50"
                  >
                    Logout
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
