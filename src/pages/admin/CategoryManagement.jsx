import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, FolderTree, ExternalLink, Check, Eye } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ImageUploadInput from '../../components/common/ImageUploadInput';
import { useStore } from '../../context/StoreContext';

const PRESET_CAT_IMAGES = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=600&q=80',
];

export default function CategoryManagement() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(PRESET_CAT_IMAGES[0]);
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, name: '' });

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      handleOpenAdd();
    }
  }, [searchParams]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage(PRESET_CAT_IMAGES[0]);
    setDisplayOrder(String(categories.length + 1));
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingId(c.id);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || '');
    setImage(c.image);
    setDisplayOrder(String(c.displayOrder || 1));
    setIsActive(c.isActive !== false);
    setIsModalOpen(true);
  };

  const handleNameChange = (val) => {
    setName(val);
    if (!editingId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      image,
      displayOrder: Number(displayOrder) || 1,
      isActive,
    };

    if (editingId) {
      updateCategory(editingId, payload);
    } else {
      addCategory(payload);
    }

    setIsModalOpen(false);
    setSearchParams({});
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.id) {
      deleteCategory(deleteDialog.id);
      setDeleteDialog({ isOpen: false, id: null, name: '' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24150F] tracking-tight">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-[#82746B] mt-0.5">
            Organize products by room type, collections, and styling departments.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-primary text-xs sm:text-sm py-2.5 px-5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid / Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((c) => {
          const productCount = products.filter((p) => p.categorySlug === c.slug).length;
          return (
            <div
              key={c.id}
              className="card p-5 bg-white border border-[#F0DFD1] flex flex-col justify-between hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#F0DFD1] bg-[#FFFAF5] shrink-0 p-1">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#82746B] uppercase tracking-wider">
                      Order #{c.displayOrder || 1}
                    </span>
                    <Badge variant={c.isActive ? 'published' : 'inactive'}>
                      {c.isActive ? 'Active' : 'Hidden'}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-base text-[#24150F] mt-1 truncate">{c.name}</h3>
                  <p className="text-xs text-[#82746B] mt-1 line-clamp-2">
                    {c.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#F0DFD1] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#82746B]">
                  {productCount} {productCount === 1 ? 'product' : 'products'}
                </span>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`/category/${c.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-[#82746B] hover:text-[#24150F] hover:bg-[#F8EBDD]/60"
                    title="View on Storefront"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded-lg text-[#82746B] hover:text-[#F36B0A] hover:bg-[#FFF3EA]"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteDialog({ isOpen: true, id: c.id, name: c.name })}
                    className="p-1.5 rounded-lg text-[#82746B] hover:text-rose-600 hover:bg-rose-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSearchParams({});
        }}
        title={editingId ? 'Edit Category' : 'Add New Category'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Dining Sets"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Slug (URL Path) *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dining-sets"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description for category banner..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
            />
          </div>

          <ImageUploadInput
            label="Category Image"
            helpText="Upload a category photo directly from your Mac or device."
            value={image}
            onChange={(newVal) => setImage(newVal)}
            presets={PRESET_CAT_IMAGES}
            required
          />

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#24150F]">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-[#F0DFD1] text-[#F36B0A] focus:ring-[#F36B0A] w-4 h-4"
                />
                <span>Active on Storefront</span>
              </label>
            </div>
          </div>

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
              {editingId ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title={`Delete Category "${deleteDialog.name}"?`}
        message="Deleting this category will unassign associated products from it."
      />
    </div>
  );
}
