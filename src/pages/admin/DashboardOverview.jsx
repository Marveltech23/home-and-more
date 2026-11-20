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

  const currentBanner = (activeAds && activeAds[0]);

  return (
    <div className="space-y-8">
      {/* 1. ARCHITECTURAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E3DA] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold">
            Retail Operations Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-luxury-serif font-light text-[#1C1815] tracking-tight">
            Executive Atelier Overview
          </h1>
          <p className="text-xs text-[#70685E] font-light mt-0.5">
            Real-time showroom performance, client commissions, workshop inventory, and editorial status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E3DA] text-xs font-semibold text-[#1C1815]">
            <Calendar className="w-3.5 h-3.5 text-[#8C6D3B]" />
            <span>Fiscal Month: Current</span>
          </div>
        </div>
      </div>

      {/* 2. STAT METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Products */}
        <div className="p-6 bg-white border border-[#E8E3DA] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="p-2.5 bg-[#EFECE6] text-[#8C6D3B]">
              <Package className="w-5 h-5 stroke-[1.4]" />
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
              <TrendingUp className="w-3 h-3" />
              +12%
            </span>
          </div>
          <div>
            <div className="text-3xl font-luxury-serif text-[#1C1815]">
              {(1243 + products.length).toLocaleString()}
            </div>
            <p className="text-[11px] uppercase tracking-ultra-caps text-[#70685E] mt-1 font-semibold">
              Curated Catalogue
            </p>
          </div>
        </div>

        {/* Card 2: Categories */}
        <div className="p-6 bg-[#1C1815] text-[#FBF9F5] border border-[#2C2621] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="p-2.5 bg-[#2A241F] text-[#C4A470]">
              <FolderTree className="w-5 h-5 stroke-[1.4]" />
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-500/30">
              <TrendingUp className="w-3 h-3" />
              11 Suites
            </span>
          </div>
          <div>
            <div className="text-3xl font-luxury-serif text-[#FBF9F5]">
              {categories.length + 11}
            </div>
            <p className="text-[11px] uppercase tracking-ultra-caps text-[#A69E93] mt-1 font-semibold">
              Showroom Departments
            </p>
          </div>
        </div>

        {/* Card 3: Gazette Essays */}
        <div className="p-6 bg-white border border-[#E8E3DA] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="p-2.5 bg-[#EFECE6] text-[#8C6D3B]">
              <FileText className="w-5 h-5 stroke-[1.4]" />
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C6D3B] bg-[#EFECE6] px-2 py-0.5">
              Published
            </span>
          </div>
          <div>
            <div className="text-3xl font-luxury-serif text-[#1C1815]">
              {blogs.length + 5}
            </div>
            <p className="text-[11px] uppercase tracking-ultra-caps text-[#70685E] mt-1 font-semibold">
              Gazette Features
            </p>
          </div>
        </div>

        {/* Card 4: Orders & Commissions */}
        <div className="p-6 bg-[#1C1815] text-[#FBF9F5] border border-[#2C2621] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="p-2.5 bg-[#2A241F] text-[#C4A470]">
              <ShoppingBag className="w-5 h-5 stroke-[1.4]" />
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-500/30">
              <TrendingUp className="w-3 h-3" />
              +14%
            </span>
          </div>
          <div>
            <div className="text-3xl font-luxury-serif text-[#FBF9F5]">
              {(2840 + enquiries.length).toLocaleString()}
            </div>
            <p className="text-[11px] uppercase tracking-ultra-caps text-[#A69E93] mt-1 font-semibold">
              Total Commissions &amp; Orders
            </p>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW: Sales Chart, Quick Actions, Ad Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Overview Area Chart (lg:col-span-5) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-white border border-[#E8E3DA] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold">
                Financial Trajectory
              </span>
              <h3 className="font-luxury-serif text-lg text-[#1C1815]">Revenue &amp; Commission Volume</h3>
            </div>
            <span className="text-xs text-[#70685E] font-light">Abuja Showroom</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8C6D3B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8C6D3B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DA" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#70685E' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#70685E' }} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#1C1815] text-[#FBF9F5] p-3 text-xs space-y-1 border border-[#352E27]">
                          <p className="font-semibold">{payload[0].value.toLocaleString()} Commissions</p>
                          <p className="text-[#C4A470]">{formatNaira(payload[0].payload.revenue)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#8C6D3B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                  dot={{ r: 3, fill: '#8C6D3B', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Grid (lg:col-span-4) */}
        <div className="lg:col-span-4 p-6 sm:p-8 bg-white border border-[#E8E3DA] space-y-4">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold">
              Shortcuts
            </span>
            <h3 className="font-luxury-serif text-lg text-[#1C1815]">Atelier Operations</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Link
              to="/admin/products?action=add"
              className="flex flex-col items-center justify-center p-4 bg-[#FBF9F5] border border-[#E8E3DA] hover:border-[#1C1815] transition-all text-center group"
            >
              <div className="w-9 h-9 border border-[#8C6D3B]/40 text-[#8C6D3B] flex items-center justify-center group-hover:bg-[#1C1815] group-hover:text-white transition-colors">
                <Plus className="w-4 h-4 stroke-[1.4]" />
              </div>
              <span className="text-xs font-semibold text-[#1C1815] mt-2.5">Add Product</span>
            </Link>

            <Link
              to="/admin/blogs?action=add"
              className="flex flex-col items-center justify-center p-4 bg-[#FBF9F5] border border-[#E8E3DA] hover:border-[#1C1815] transition-all text-center group"
            >
              <div className="w-9 h-9 border border-[#8C6D3B]/40 text-[#8C6D3B] flex items-center justify-center group-hover:bg-[#1C1815] group-hover:text-white transition-colors">
                <PenSquare className="w-4 h-4 stroke-[1.4]" />
              </div>
              <span className="text-xs font-semibold text-[#1C1815] mt-2.5">Write Essay</span>
            </Link>

            <Link
              to="/admin/media"
              className="flex flex-col items-center justify-center p-4 bg-[#FBF9F5] border border-[#E8E3DA] hover:border-[#1C1815] transition-all text-center group"
            >
              <div className="w-9 h-9 border border-[#8C6D3B]/40 text-[#8C6D3B] flex items-center justify-center group-hover:bg-[#1C1815] group-hover:text-white transition-colors">
                <Upload className="w-4 h-4 stroke-[1.4]" />
              </div>
              <span className="text-xs font-semibold text-[#1C1815] mt-2.5">Media Library</span>
            </Link>

            <Link
              to="/admin/categories?action=add"
              className="flex flex-col items-center justify-center p-4 bg-[#FBF9F5] border border-[#E8E3DA] hover:border-[#1C1815] transition-all text-center group"
            >
              <div className="w-9 h-9 border border-[#8C6D3B]/40 text-[#8C6D3B] flex items-center justify-center group-hover:bg-[#1C1815] group-hover:text-white transition-colors">
                <FolderTree className="w-4 h-4 stroke-[1.4]" />
              </div>
              <span className="text-xs font-semibold text-[#1C1815] mt-2.5">Categories</span>
            </Link>

            <Link
              to="/admin/advertisements"
              className="flex flex-col items-center justify-center p-4 bg-[#FBF9F5] border border-[#E8E3DA] hover:border-[#1C1815] transition-all text-center group"
            >
              <div className="w-9 h-9 border border-[#8C6D3B]/40 text-[#8C6D3B] flex items-center justify-center group-hover:bg-[#1C1815] group-hover:text-white transition-colors">
                <Megaphone className="w-4 h-4 stroke-[1.4]" />
              </div>
              <span className="text-xs font-semibold text-[#1C1815] mt-2.5">Exhibitions</span>
            </Link>

            <Link
              to="/admin/settings"
              className="flex flex-col items-center justify-center p-4 bg-[#FBF9F5] border border-[#E8E3DA] hover:border-[#1C1815] transition-all text-center group"
            >
              <div className="w-9 h-9 border border-[#8C6D3B]/40 text-[#8C6D3B] flex items-center justify-center group-hover:bg-[#1C1815] group-hover:text-white transition-colors">
                <Settings className="w-4 h-4 stroke-[1.4]" />
              </div>
              <span className="text-xs font-semibold text-[#1C1815] mt-2.5">Settings</span>
            </Link>
          </div>
        </div>

        {/* Advertisement Manager Preview Widget (lg:col-span-3) */}
        <div className="lg:col-span-3 p-6 sm:p-8 bg-white border border-[#E8E3DA] space-y-4 flex flex-col justify-between">
          <div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold">
                Campaign Display
              </span>
              <h3 className="font-luxury-serif text-lg text-[#1C1815]">Curated Banner</h3>
            </div>
            <p className="text-xs text-[#70685E] font-light mt-1">Active homepage exhibition promotion</p>

            <div className="mt-3 overflow-hidden border border-[#E8E3DA] aspect-[16/10] relative bg-[#1C1815]">
              <SafeImage
                src={currentBanner?.desktopImage || currentBanner?.mobileImage}
                alt="Ad Banner Preview"
                aspectRatio="aspect-auto"
                fit="cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <div className="text-white space-y-0.5">
                  <p className="font-luxury-serif text-sm text-[#C4A470] leading-tight">
                    {currentBanner?.title || 'Home & More Atelier'}
                  </p>
                  <p className="text-[10px] uppercase tracking-ultra-caps truncate">{currentBanner?.subtitle || 'Showroom Exhibition'}</p>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/admin/advertisements?action=add"
            className="w-full btn-luxury text-xs py-2.5 flex items-center justify-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Exhibition</span>
          </Link>
        </div>
      </div>

      {/* 4. BOTTOM ROW: Recent Products, Latest Blogs, Media Library */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Products (lg:col-span-4) */}
        <div className="lg:col-span-4 p-6 bg-white border border-[#E8E3DA] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-3">
            <h3 className="font-luxury-serif text-base text-[#1C1815]">Recent Catalog Pieces</h3>
            <Link
              to="/admin/products"
              className="text-[11px] uppercase tracking-ultra-caps text-[#8C6D3B] hover:text-[#1C1815] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[#E8E3DA]">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 object-cover border border-[#E8E3DA] shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-semibold text-[#1C1815] truncate">{p.name}</p>
                    <p className="text-[11px] font-luxury-serif text-[#8C6D3B]">{formatNaira(p.price)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/products?edit=${p.id}`)}
                    className="p-1 text-[#70685E] hover:text-[#1C1815]"
                    title="Edit Product"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDelete(p.id, 'product', p.name)}
                    className="p-1 text-[#70685E] hover:text-rose-600"
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
        <div className="lg:col-span-4 p-6 bg-white border border-[#E8E3DA] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-3">
            <h3 className="font-luxury-serif text-base text-[#1C1815]">Latest Gazette Dispatches</h3>
            <Link
              to="/admin/blogs"
              className="text-[11px] uppercase tracking-ultra-caps text-[#8C6D3B] hover:text-[#1C1815] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[#E8E3DA]">
            {blogs.slice(0, 3).map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 overflow-hidden border border-[#E8E3DA] shrink-0 bg-[#EFECE6]">
                    <SafeImage
                      src={b.featuredImage || b.image}
                      alt={b.title}
                      aspectRatio="aspect-auto"
                      fit="cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-semibold text-[#1C1815] truncate">{b.title}</p>
                    <p className="text-[10px] text-[#70685E]">{b.publishedAt || b.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/blogs?edit=${b.id}`)}
                    className="p-1 text-[#70685E] hover:text-[#1C1815]"
                    title="Edit Blog"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDelete(b.id, 'blog', b.title)}
                    className="p-1 text-[#70685E] hover:text-rose-600"
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
        <div className="lg:col-span-4 p-6 bg-white border border-[#E8E3DA] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-3">
            <h3 className="font-luxury-serif text-base text-[#1C1815]">Media Archive</h3>
            <Link
              to="/admin/media"
              className="text-[11px] uppercase tracking-ultra-caps text-[#8C6D3B] hover:text-[#1C1815] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {media.slice(0, 8).map((m) => (
              <div
                key={m.id}
                className="aspect-square overflow-hidden border border-[#E8E3DA] hover:border-[#1C1815] transition-colors cursor-pointer"
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
