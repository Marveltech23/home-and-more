import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Filter,
  Package,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ImageUploadInput from '../../components/common/ImageUploadInput';
import { useStore } from '../../context/StoreContext';
import { formatNaira } from '../../utils/format';
import { isProductPriceVisible } from '../../utils/whatsapp';

const PRESET_IMAGES = [
  '/images/stock/photo-1555041469-a586c61ea9bc.jpg',
  '/images/stock/photo-1586023492125-27b2c045efd7.jpg',
  '/images/stock/photo-1617806118233-18e1de247200.jpg',
  '/images/stock/photo-1505693416388-ac5ce068fe85.jpg',
  '/images/stock/photo-1595428774223-ef52624120d2.jpg',
  '/images/stock/photo-1600585154526-990dced4db0d.jpg',
  '/images/stock/photo-1600585154340-be6161a56a0c.jpg',
  '/images/stock/photo-1567538096630-e0c55bd6374c.jpg',
];

export default function ProductManagement() {
  const {
    products,
    categories,
    media,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleGlobalPrices,
    setProductPriceVisibility,
    toggleProductPriceVisibility,
  } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const globalPricesVisible = settings?.showPrices !== false;
  const hiddenPriceIds = Array.isArray(settings?.hiddenPriceProductIds)
    ? settings.hiddenPriceProductIds
    : [];

  const mediaPresets = media?.length
    ? media.map((m) => ({ url: m.url, label: m.name }))
    : PRESET_IMAGES;

  // Search & Filter
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || 'sofa-sets');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('5');
  const [image, setImage] = useState(PRESET_IMAGES[0]);
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [material, setMaterial] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState('published');
  const [showProductPrice, setShowProductPrice] = useState(true);

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, name: '' });

  // Handle URL trigger (?action=add or ?edit=id)
  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('edit');

    if (action === 'add') {
      handleOpenAdd();
    } else if (editId) {
      const prod = products.find((p) => p.id === editId);
      if (prod) handleOpenEdit(prod);
    }
  }, [searchParams, products]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setSku(`HM-${Math.floor(100 + Math.random() * 900)}`);
    setCategorySlug(categories[0]?.slug || 'sofa-sets');
    setPrice('');
    setDiscountPrice('');
    setStock('5');
    setImage(PRESET_IMAGES[0]);
    setDescription('');
    setDimensions('180cm W x 90cm D x 85cm H');
    setMaterial('Kiln-dried Hardwood, Premium Fabric');
    setFeatured(false);
    setStatus('published');
    setShowProductPrice(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setSku(p.sku);
    setCategorySlug(p.categorySlug);
    setPrice(String(p.price));
    setDiscountPrice(p.discountPrice ? String(p.discountPrice) : '');
    setStock(String(p.stock));
    setImage(p.image);
    setDescription(p.description || '');
    setDimensions(p.dimensions || '');
    setMaterial(p.material || '');
    setFeatured(Boolean(p.featured));
    setStatus(p.status || 'published');
    setShowProductPrice(!hiddenPriceIds.includes(p.id));
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const productPayload = {
      name: name.trim(),
      sku: sku.trim(),
      categorySlug,
      price: Number(price) || 0,
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: Number(stock),
      image,
      description: description.trim(),
      dimensions: dimensions.trim(),
      material: material.trim(),
      featured,
      status,
    };

    if (editingId) {
      updateProduct(editingId, productPayload);
      setProductPriceVisibility(editingId, showProductPrice, { silent: true });
    } else {
      const created = addProduct(productPayload);
      if (created?.id && !showProductPrice) {
        setProductPriceVisibility(created.id, false, { silent: true });
      }
    }

    setIsModalOpen(false);
    setSearchParams({});
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.id) {
      deleteProduct(deleteDialog.id);
      setDeleteDialog({ isOpen: false, id: null, name: '' });
    }
  };

  // Filtered Products
  const filtered = products.filter((p) => {
    if (categoryFilter !== 'all' && p.categorySlug !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24150F] tracking-tight">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-[#82746B] mt-0.5">
            Manage your furniture catalog, inventory, prices, and status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={toggleGlobalPrices}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-semibold border transition-all shadow-xs ${
              globalPricesVisible
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-[#29160D] text-white border-[#29160D] hover:bg-[#3a1f12]'
            }`}
            title="Toggle whether prices are visible or hidden across the entire storefront"
          >
            {globalPricesVisible ? (
              <>
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Storefront Prices: Visible</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 text-[#F36B0A]" />
                <span>Storefront Prices: Hidden</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn-primary text-xs sm:text-sm py-2.5 px-5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#82746B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-9 pr-4 py-2 rounded-full border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-full border border-[#F0DFD1] text-xs font-semibold text-[#24150F] bg-white focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <span className="text-xs font-semibold text-[#82746B] whitespace-nowrap">
            {filtered.length} products
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden bg-white border border-[#F0DFD1]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FFFAF5] border-b border-[#F0DFD1] text-[11px] font-bold uppercase tracking-wider text-[#82746B]">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0DFD1]">
              {filtered.map((p) => {
                const cat = categories.find((c) => c.slug === p.categorySlug);
                return (
                  <tr key={p.id} className="hover:bg-[#FFFAF5]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#F0DFD1] shrink-0"
                        />
                        <div>
                          <div className="font-bold text-[#24150F] flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.featured && (
                              <Sparkles className="w-3.5 h-3.5 text-[#F36B0A]" title="Featured" />
                            )}
                          </div>
                          <span className="text-[11px] text-[#82746B] line-clamp-1">{p.material}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-[#82746B]">{p.sku}</td>

                    <td className="py-3.5 px-4 font-medium text-[#24150F]">
                      {cat?.name || p.categorySlug}
                    </td>

                    <td className="py-3.5 px-4">
                      {(() => {
                        const visible = isProductPriceVisible(p, settings);
                        return (
                          <div className="space-y-1">
                            <div>
                              <span
                                className={`font-bold ${
                                  visible ? 'text-[#F36B0A]' : 'text-[#82746B] line-through opacity-60'
                                }`}
                              >
                                {formatNaira(p.price)}
                              </span>
                              {p.discountPrice && visible && (
                                <span className="block text-[11px] text-[#82746B] line-through">
                                  {formatNaira(p.discountPrice)}
                                </span>
                              )}
                            </div>
                            {globalPricesVisible ? (
                              <button
                                type="button"
                                onClick={() => toggleProductPriceVisibility(p.id)}
                                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                                  visible
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                                }`}
                                title={
                                  visible
                                    ? 'Click to hide price on storefront (WhatsApp only)'
                                    : 'Click to show price on storefront'
                                }
                              >
                                {visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                <span>{visible ? 'Price Visible' : 'Price Hidden'}</span>
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                                <EyeOff className="w-3 h-3" />
                                <span>Hidden Globally</span>
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>

                    <td className="py-3.5 px-4">
                      {p.stock > 0 ? (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {p.stock} in stock
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Out of stock
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={p.status === 'published' ? 'published' : 'draft'}>
                        {p.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={`/shop/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-[#82746B] hover:text-[#24150F] hover:bg-[#F8EBDD]/60"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-[#82746B] hover:text-[#F36B0A] hover:bg-[#FFF3EA]"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteDialog({ isOpen: true, id: p.id, name: p.name })}
                          className="p-1.5 rounded-lg text-[#82746B] hover:text-rose-600 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSearchParams({});
        }}
        title={editingId ? 'Edit Product' : 'Add New Furniture Product'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Row 1: Name and SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Modern Sofa Set"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                SKU *
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="HM-SOF-001"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
          </div>

          {/* Row 2: Category and Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Category *
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A] bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
          </div>

          {/* Row 3: Price and Discount Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Price (₦) *
              </label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="120000"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Discount / Strikethrough Price (₦)
              </label>
              <input
                type="number"
                min="0"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="140000"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
          </div>

          {/* Product Primary Image (Device Upload or Media Library) */}
          <ImageUploadInput
            label="Product Photo"
            helpText="Upload a high-res photo from your device, or pick directly from your Media Library."
            value={image}
            onChange={(newVal) => setImage(newVal)}
            presets={mediaPresets}
            required
          />

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe materials, cushioning, frame, and comfort..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
            />
          </div>

          {/* Dimensions & Material */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Dimensions
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="220cm W x 95cm D x 85cm H"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Materials &amp; Finish
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Solid Teak, Orange Velvet"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
          </div>

          {/* Featured, Price Visibility & Publish Status */}
          <div className="pt-2 border-t border-[#F0DFD1] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#24150F]">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-[#F0DFD1] text-[#F36B0A] focus:ring-[#F36B0A] w-4 h-4"
                />
                <span>Feature on Storefront Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#24150F]">
                <input
                  type="checkbox"
                  checked={showProductPrice}
                  onChange={(e) => setShowProductPrice(e.target.checked)}
                  className="rounded border-[#F0DFD1] text-[#F36B0A] focus:ring-[#F36B0A] w-4 h-4"
                />
                <span>Show Price on Storefront</span>
              </label>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="text-[#F36B0A]"
                />
                <span className="text-emerald-700">Published</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="text-[#82746B]"
                />
                <span className="text-stone-600">Draft</span>
              </label>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#F0DFD1] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setSearchParams({});
              }}
              className="btn-secondary text-xs py-2.5 px-4"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs py-2.5 px-6">
              {editingId ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deleteDialog.name}"?`}
        message="This product will be permanently removed from your storefront and inventory."
      />
    </div>
  );
}
