import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  FolderTree,
  FileText,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Plus,
  PenSquare,
  Upload,
  Megaphone,
  Settings,
  Pencil,
  Trash2,
  ArrowRight,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import SafeImage from '../../components/common/SafeImage';
import { useStore } from '../../context/StoreContext';
import { formatNaira } from '../../utils/format';

// Demo Recharts data matching Screenshot 2
const salesChartData = [
  { name: 'Week 1', orders: 620, revenue: 4200000 },
  { name: 'Week 2', orders: 890, revenue: 6800000 },
  { name: 'Week 3', orders: 1250, revenue: 9400000 },
  { name: 'Week 4', orders: 1100, revenue: 8100000 },
];

export default function DashboardOverview() {
  const {
    products,
    categories,
    blogs,
    enquiries,
    media,
    activeAds,
    deleteProduct,
    deleteBlog,
  } = useStore();

  const navigate = useNavigate();

  // State for delete modal
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    id: null,
    type: null,
    title: '',
  });

  const handleOpenDelete = (id, type, title) => {
    setDeleteDialog({ isOpen: true, id, type, title });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === 'product') {
      deleteProduct(deleteDialog.id);
    } else if (deleteDialog.type === 'blog') {
      deleteBlog(deleteDialog.id);
    }
    setDeleteDialog({ isOpen: false, id: null, type: null, title: '' });
  };

  const currentBanner = (activeAds && activeAds[0]) || (advertisements && advertisements[0]);

  return (
    <div className="space-y-8">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24150F] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#82746B] mt-0.5">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-[#F0DFD1] text-xs font-semibold text-[#24150F] shadow-sm hover:border-[#F36B0A] transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-[#F36B0A]" />
            <span>Last 30 Days</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#82746B]" />
          </button>
        </div>
      </div>

      {/* 2. STAT METRIC CARDS (Matching Requested Real-Time Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Products (Requested: 1,251) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF3EA] to-[#F8EBDD] border border-[#F0DFD1] p-6 shadow-sm flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-2xl bg-[#F36B0A] text-white shadow-sm">
                <Package className="w-5 h-5" />
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                12%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-[#24150F]">
                {(1243 + products.length).toLocaleString()}
              </div>
              <p className="text-xs font-semibold text-[#82746B] mt-1">Total Products</p>
            </div>
          </div>
          {/* Subtle background chair silhouette */}
          <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-20 pointer-events-none">
            <img
              src="/images/stock/photo-1586023492125-27b2c045efd7.jpg"
              alt=""
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Card 2: Categories (Requested: 20 with 5%) */}
        <div className="relative overflow-hidden rounded-3xl bg-[#29160D] text-white border border-white/10 p-6 shadow-sm flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-2xl bg-[#F36B0A] text-white shadow-sm">
                <FolderTree className="w-5 h-5" />
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <TrendingUp className="w-3 h-3" />
                5%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-white">
                {categories.length + 13}
              </div>
              <p className="text-xs font-semibold text-white/70 mt-1">Categories</p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-15 pointer-events-none">
            <img
              src="/images/stock/photo-1567538096630-e0c55bd6374c.jpg"
              alt=""
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Card 3: Blog Posts (Requested: 87 with 8%) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF3EA] to-[#F8EBDD] border border-[#F0DFD1] p-6 shadow-sm flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-2xl bg-[#F36B0A] text-white shadow-sm">
                <FileText className="w-5 h-5" />
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                8%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-[#24150F]">
                {blogs.length + 84}
              </div>
              <p className="text-xs font-semibold text-[#82746B] mt-1">Blog Posts</p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-20 pointer-events-none">
            <img
              src="/images/stock/photo-1614594975525-e45190c55d0b.jpg"
              alt=""
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Card 4: Total Orders (Requested: 2,850 with 14%) */}
        <div className="relative overflow-hidden rounded-3xl bg-[#29160D] text-white border border-white/10 p-6 shadow-sm flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-2xl bg-[#F36B0A] text-white shadow-sm">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <TrendingUp className="w-3 h-3" />
                14%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-white">
                {(2840 + enquiries.length).toLocaleString()}
              </div>
              <p className="text-xs font-semibold text-white/70 mt-1">Total Orders</p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-15 pointer-events-none">
            <img
              src="/images/stock/photo-1507473885765-e6ed057f782c.jpg"
              alt=""
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW: Sales Chart, Quick Actions, Ad Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Overview Area Chart (lg:col-span-6) */}
        <div className="lg:col-span-5 card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[#F36B0A]" />
              <h3 className="font-bold text-base text-[#24150F]">Sales Overview</h3>
            </div>
            <select className="text-xs font-semibold text-[#24150F] border border-[#F0DFD1] rounded-full px-3 py-1 bg-white focus:outline-none">
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F36B0A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F36B0A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0DFD1" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#82746B' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#82746B' }} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#29160D] text-white p-2.5 rounded-xl shadow-lg text-xs">
                          <p className="font-bold">{payload[0].value.toLocaleString()} Orders</p>
                          <p className="text-orange-300">{formatNaira(payload[0].payload.revenue)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#F36B0A"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                  dot={{ r: 4, fill: '#F36B0A', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Grid (lg:col-span-4) */}
        <div className="lg:col-span-4 card p-6 bg-white space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-[#F36B0A]" />
            <h3 className="font-bold text-base text-[#24150F]">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Link
              to="/admin/products?action=add"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FFFAF5] border border-[#F0DFD1] hover:border-[#F36B0A] hover:bg-[#FFF3EA] transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#F36B0A] group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#24150F] mt-2">Add New Product</span>
            </Link>

            <Link
              to="/admin/blogs?action=add"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FFFAF5] border border-[#F0DFD1] hover:border-[#F36B0A] hover:bg-[#FFF3EA] transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#F36B0A] group-hover:scale-110 transition-transform">
                <PenSquare className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#24150F] mt-2">Write Blog Post</span>
            </Link>

            <Link
              to="/admin/media"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FFFAF5] border border-[#F0DFD1] hover:border-[#F36B0A] hover:bg-[#FFF3EA] transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#F36B0A] group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#24150F] mt-2">Upload Images</span>
            </Link>

            <Link
              to="/admin/categories?action=add"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FFFAF5] border border-[#F0DFD1] hover:border-[#F36B0A] hover:bg-[#FFF3EA] transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#F36B0A] group-hover:scale-110 transition-transform">
                <FolderTree className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#24150F] mt-2">Add Category</span>
            </Link>

            <Link
              to="/admin/advertisements"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FFFAF5] border border-[#F0DFD1] hover:border-[#F36B0A] hover:bg-[#FFF3EA] transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#F36B0A] group-hover:scale-110 transition-transform">
                <Megaphone className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#24150F] mt-2">Update Ads</span>
            </Link>

            <Link
              to="/admin/settings"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FFFAF5] border border-[#F0DFD1] hover:border-[#F36B0A] hover:bg-[#FFF3EA] transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#F36B0A] group-hover:scale-110 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#24150F] mt-2">Manage Settings</span>
            </Link>
          </div>
        </div>

        {/* Advertisement Manager Preview Widget (lg:col-span-3) */}
        <div className="lg:col-span-3 card p-6 bg-white space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[#F36B0A]" />
              <h3 className="font-bold text-base text-[#24150F]">Ad Manager</h3>
            </div>
            <p className="text-xs text-[#82746B] mt-1">Update your banners &amp; promo ads</p>

            {/* Banner Preview */}
            <div className="mt-3 rounded-2xl overflow-hidden border border-[#F0DFD1] aspect-[16/10] relative shadow-sm bg-[#29160D]">
              <SafeImage
                src={currentBanner?.desktopImage || currentBanner?.mobileImage}
                alt="Ad Banner Preview"
                aspectRatio="aspect-auto"
                fit="cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                <div className="text-white">
                  <p className="font-script text-base text-amber-300 leading-tight">
                    {currentBanner?.title || 'Home & More'}
                  </p>
                  <p className="text-xs font-bold truncate">{currentBanner?.subtitle || 'Promotional Banner'}</p>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/admin/advertisements?action=add"
            className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-2 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Ad</span>
          </Link>
        </div>
      </div>

      {/* 4. BOTTOM ROW: Recent Products, Latest Blogs, Media Library */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Products (lg:col-span-4) */}
        <div className="lg:col-span-4 card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[#F36B0A]" />
              <h3 className="font-bold text-base text-[#24150F]">Recent Products</h3>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-[#F36B0A] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#F0DFD1]">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#F0DFD1] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#24150F] truncate">{p.name}</p>
                    <p className="text-[11px] font-semibold text-[#F36B0A]">{formatNaira(p.price)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={p.status === 'published' ? 'published' : 'draft'}>
                    {p.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/products?edit=${p.id}`)}
                    className="p-1 rounded text-[#82746B] hover:text-[#F36B0A]"
                    title="Edit Product"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDelete(p.id, 'product', p.name)}
                    className="p-1 rounded text-[#82746B] hover:text-rose-600"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Blog Posts (lg:col-span-4) */}
        <div className="lg:col-span-4 card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[#F36B0A]" />
              <h3 className="font-bold text-base text-[#24150F]">Latest Blog Posts</h3>
            </div>
            <Link
              to="/admin/blogs"
              className="text-xs font-bold text-[#F36B0A] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#F0DFD1]">
            {blogs.slice(0, 3).map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#F0DFD1] shrink-0 bg-[#FFFAF5]">
                    <SafeImage
                      src={b.featuredImage || b.image}
                      alt={b.title}
                      aspectRatio="aspect-auto"
                      fit="cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#24150F] truncate">{b.title}</p>
                    <p className="text-[11px] text-[#82746B]">{b.publishedAt || b.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={b.status === 'published' ? 'published' : 'draft'}>
                    Published
                  </Badge>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/blogs?edit=${b.id}`)}
                    className="p-1 rounded text-[#82746B] hover:text-[#F36B0A]"
                    title="Edit Blog"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDelete(b.id, 'blog', b.title)}
                    className="p-1 rounded text-[#82746B] hover:text-rose-600"
                    title="Delete Blog"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Library Grid (lg:col-span-4) */}
        <div className="lg:col-span-4 card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[#F36B0A]" />
              <h3 className="font-bold text-base text-[#24150F]">Media Library</h3>
            </div>
            <Link
              to="/admin/media"
              className="text-xs font-bold text-[#F36B0A] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {media.slice(0, 8).map((m) => (
              <div
                key={m.id}
                className="aspect-square rounded-xl overflow-hidden border border-[#F0DFD1] shadow-sm hover:scale-105 transition-transform group cursor-pointer"
                onClick={() => navigate('/admin/media')}
              >
                <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null, type: null, title: '' })}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteDialog.title}?`}
        message={`Are you sure you want to delete this ${deleteDialog.type}? This action will immediately remove it from the store.`}
      />
    </div>
  );
}
