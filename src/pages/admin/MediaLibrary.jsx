import { useState } from 'react';
import { Upload, Search, Trash2, Copy, Check, Eye, Image as ImageIcon, X } from 'lucide-react';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../components/common/Toast';

export default function MediaLibrary() {
  const { media, addMedia, deleteMedia } = useStore();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Sofas');

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, name: '' });

  const handleCopyUrl = (item) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    addToast({ message: 'Image URL copied to clipboard!', type: 'success' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadName.trim() || !uploadUrl.trim()) return;

    addMedia({
      name: uploadName.trim(),
      url: uploadUrl.trim(),
      category: uploadCategory,
      size: `${(Math.random() * 2 + 0.8).toFixed(1)} MB`,
      dimensions: '1920x1080',
    });

    setIsUploadOpen(false);
    setUploadName('');
    setUploadUrl('');
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.id) {
      deleteMedia(deleteDialog.id);
      if (selectedMedia?.id === deleteDialog.id) {
        setSelectedMedia(null);
      }
      setDeleteDialog({ isOpen: false, id: null, name: '' });
    }
  };

  const filteredMedia = media.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.category?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24150F] tracking-tight">
            Media Library
          </h1>
          <p className="text-xs sm:text-sm text-[#82746B] mt-0.5">
            Manage your furniture product photography, banners, and marketing assets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="btn-primary text-xs sm:text-sm py-2.5 px-5 shadow-sm"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Search and Stats Bar */}
      <div className="card p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#82746B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search images by name or category..."
            className="w-full pl-9 pr-4 py-2 rounded-full border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
          />
        </div>

        <span className="text-xs font-semibold text-[#82746B]">
          {filteredMedia.length} {filteredMedia.length === 1 ? 'file' : 'files'}
        </span>
      </div>

      {/* Main Grid & Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Media Grid */}
        <div className={selectedMedia ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-4">
            {filteredMedia.map((item) => {
              const isSelected = selectedMedia?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMedia(item)}
                  className={`group relative aspect-square rounded-2xl overflow-hidden bg-white border-2 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                    isSelected ? 'border-[#F36B0A] ring-2 ring-[#F36B0A]/20 scale-102' : 'border-[#F0DFD1]'
                  }`}
                >
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                    <span className="text-[10px] font-bold bg-[#F36B0A] px-2 py-0.5 rounded-md self-start">
                      {item.category || 'Asset'}
                    </span>
                    <div>
                      <p className="text-xs font-bold truncate">{item.name}</p>
                      <p className="text-[10px] opacity-75">{item.size}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Image Details Panel */}
        {selectedMedia && (
          <aside className="lg:col-span-4 card p-5 bg-white border border-[#F0DFD1] space-y-5 h-fit sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0DFD1]">
              <h3 className="font-bold text-sm text-[#24150F]">Asset Details</h3>
              <button
                type="button"
                onClick={() => setSelectedMedia(null)}
                className="text-[#82746B] hover:text-[#24150F] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#F0DFD1] bg-[#FFFAF5]">
              <img src={selectedMedia.url} alt={selectedMedia.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#82746B]">File Name:</span>
                <p className="font-bold text-[#24150F] break-all">{selectedMedia.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <span className="text-[#82746B]">Dimensions:</span>
                  <p className="font-semibold text-[#24150F]">{selectedMedia.dimensions || '1920x1080'}</p>
                </div>
                <div>
                  <span className="text-[#82746B]">File Size:</span>
                  <p className="font-semibold text-[#24150F]">{selectedMedia.size || '1.2 MB'}</p>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-[#82746B]">Direct Link:</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    readOnly
                    value={selectedMedia.url}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#F0DFD1] bg-[#FFFAF5] text-[11px] text-[#82746B] truncate font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(selectedMedia)}
                    className="p-1.5 rounded-lg bg-[#F8EBDD] text-[#F36B0A] hover:bg-[#F36B0A] hover:text-white transition-colors shrink-0"
                    title="Copy URL"
                  >
                    {copiedId === selectedMedia.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0DFD1] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setDeleteDialog({ isOpen: true, id: selectedMedia.id, name: selectedMedia.name })}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Asset</span>
              </button>
              <button
                type="button"
                onClick={() => handleCopyUrl(selectedMedia)}
                className="btn-primary text-xs py-1.5 px-4"
              >
                Copy URL
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Upload Image Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Image to Media Library"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
              File Name / Title *
            </label>
            <input
              type="text"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              placeholder="e.g. Modern Sofa Front Angle.jpg"
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
              Image URL *
            </label>
            <input
              type="url"
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
              Category
            </label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A] bg-white"
            >
              <option value="Sofas">Sofas</option>
              <option value="Chairs">Chairs</option>
              <option value="Beds">Beds</option>
              <option value="Tables">Tables</option>
              <option value="Wardrobes">Wardrobes</option>
              <option value="Decor">Decor</option>
              <option value="Banners">Banners</option>
            </select>
          </div>

          <div className="pt-3 border-t border-[#F0DFD1] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs py-2 px-6">
              Add to Library
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deleteDialog.name}"?`}
        message="This image will be removed from your media library."
      />
    </div>
  );
}
