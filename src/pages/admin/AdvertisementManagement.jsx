import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  Megaphone,
  Smartphone,
  Monitor,
  Eye,
  CheckCircle2,
  XCircle,
  Calendar,
  ExternalLink,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ImageUploadInput from '../../components/common/ImageUploadInput';
import SafeImage from '../../components/common/SafeImage';
import { useStore } from '../../context/StoreContext';

const PRESET_BANNERS = [
  {
    label: 'Christmas Festive (Current)',
    desktop: '/images/stock/photo-1543258103-a62bdc069871.jpg',
    mobile: '/images/stock/photo-1543258103-a62bdc069871.jpg',
  },
  {
    label: 'New Year Living Room',
    desktop: '/images/stock/photo-1600585154340-be6161a56a0c.jpg',
    mobile: '/images/stock/photo-1600585154340-be6161a56a0c.jpg',
  },
  {
    label: 'Mid-Season Clearance',
    desktop: '/images/stock/photo-1555041469-a586c61ea9bc.jpg',
    mobile: '/images/stock/photo-1555041469-a586c61ea9bc.jpg',
  },
];

export default function AdvertisementManagement() {
  const { advertisements, addAd, updateAd, deleteAd, toggleAdStatus } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Preview Mode State: 'desktop' or 'mobile'
  const [previewMode, setPreviewMode] = useState('desktop');
  const [selectedPreviewAdId, setSelectedPreviewAdId] = useState(advertisements[0]?.id || null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [buttonText, setButtonText] = useState('Shop Christmas Offers');
  const [buttonUrl, setButtonUrl] = useState('/shop');
  const [placement, setPlacement] = useState('hero_bottom');
  const [desktopImage, setDesktopImage] = useState(PRESET_BANNERS[0].desktop);
  const [mobileImage, setMobileImage] = useState(PRESET_BANNERS[0].mobile);
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [isActive, setIsActive] = useState(true);

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, title: '' });

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      handleOpenAdd();
    }
  }, [searchParams]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('Flash Sale');
    setSubtitle('Weekend Discounts');
    setTagline('Exclusive Savings On Selected Sofas');
    setDescription('Get 20% off all handcrafted sectionals this weekend only.');
    setButtonText('Shop Weekend Offers');
    setButtonUrl('/shop');
    setPlacement('hero_bottom');
    setDesktopImage(PRESET_BANNERS[1].desktop);
    setMobileImage(PRESET_BANNERS[1].mobile);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('2026-12-31');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ad) => {
    setEditingId(ad.id);
    setTitle(ad.title);
    setSubtitle(ad.subtitle || '');
    setTagline(ad.tagline || '');
    setDescription(ad.description || '');
    setButtonText(ad.buttonText || 'Shop Now');
    setButtonUrl(ad.buttonUrl || '/shop');
    setPlacement(ad.placement || 'hero_bottom');
    setDesktopImage(ad.desktopImage);
    setMobileImage(ad.mobileImage || ad.desktopImage);
    setStartDate(ad.startDate || '2026-11-01');
    setEndDate(ad.endDate || '2026-12-31');
    setIsActive(ad.isActive !== false);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      buttonText: buttonText.trim(),
      buttonUrl: buttonUrl.trim(),
      placement,
      desktopImage,
      mobileImage,
      startDate,
      endDate,
      isActive,
    };

    if (editingId) {
      updateAd(editingId, payload);
    } else {
      addAd(payload);
    }

    setIsModalOpen(false);
    setSearchParams({});
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.id) {
      deleteAd(deleteDialog.id);
      setDeleteDialog({ isOpen: false, id: null, title: '' });
    }
  };

  const previewAd = advertisements.find((a) => a.id === selectedPreviewAdId) || advertisements[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24150F] tracking-tight">
            Advertisement Management
          </h1>
          <p className="text-xs sm:text-sm text-[#82746B] mt-0.5">
            Configure promotional marketing banners, seasonal campaigns, and homepage hero takeovers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-primary text-xs sm:text-sm py-2.5 px-5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Advertisement</span>
        </button>
      </div>

      {/* Interactive Desktop & Mobile Live Preview Section */}
      {previewAd && (
        <div className="card p-6 bg-white border border-[#F0DFD1] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0DFD1]">
            <div>
              <span className="text-xs font-bold text-[#F36B0A] uppercase tracking-wider">
                Live Banner Preview
              </span>
              <h3 className="text-base font-bold text-[#24150F]">
                {previewAd.title} {previewAd.subtitle} ({previewAd.placement})
              </h3>
            </div>

            {/* Mode Toggle Buttons */}
            <div className="flex items-center gap-2 bg-[#FFFAF5] p-1 rounded-2xl border border-[#F0DFD1]">
              <button
                type="button"
                onClick={() => setPreviewMode('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  previewMode === 'desktop'
                    ? 'bg-[#F36B0A] text-white shadow-sm'
                    : 'text-[#82746B] hover:text-[#24150F]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (1200px)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  previewMode === 'mobile'
                    ? 'bg-[#F36B0A] text-white shadow-sm'
                    : 'text-[#82746B] hover:text-[#24150F]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (375px)</span>
              </button>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="bg-[#FFFAF5] p-4 sm:p-8 rounded-2xl border border-[#F0DFD1] flex justify-center items-center overflow-x-auto">
            <div
              className={`transition-all duration-300 ${
                previewMode === 'desktop'
                  ? 'w-full max-w-4xl'
                  : 'w-[360px] border-8 border-stone-800 rounded-3xl overflow-hidden shadow-2xl'
              }`}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#29160D] via-[#3d1a0d] to-[#241209] text-white p-5 sm:p-7 shadow-lg border border-amber-900/40">
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shadow-md shrink-0 border border-amber-400/30 bg-black/40">
                      <SafeImage
                        src={
                          (previewMode === 'desktop' ? previewAd?.desktopImage : previewAd?.mobileImage) ||
                          previewAd?.desktopImage ||
                          previewAd?.mobileImage
                        }
                        alt="Preview"
                        aspectRatio="aspect-auto"
                        fit="cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-script text-2xl sm:text-3xl text-amber-300">
                        {previewAd.title}
                      </div>
                      <div className="text-base sm:text-lg font-extrabold uppercase tracking-wide">
                        {previewAd.subtitle}
                      </div>
                      <p className="text-[11px] sm:text-xs text-amber-100/80 mt-0.5">
                        {previewAd.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center sm:items-end justify-center text-center sm:text-right gap-2">
                    <p className="text-xs text-white/90 font-medium max-w-xs">
                      {previewAd.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F36B0A] to-[#D94D00] px-4 py-2 text-xs font-bold text-white shadow-md">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{previewAd.buttonText}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advertisements List Table */}
      <div className="card overflow-hidden bg-white border border-[#F0DFD1]">
        <div className="p-4 sm:p-5 border-b border-[#F0DFD1] flex items-center justify-between">
          <h2 className="font-bold text-base text-[#24150F]">All Campaigns &amp; Banners</h2>
          <span className="text-xs font-semibold text-[#82746B]">{advertisements.length} banners</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FFFAF5] border-b border-[#F0DFD1] text-[11px] font-bold uppercase tracking-wider text-[#82746B]">
              <tr>
                <th className="py-3.5 px-4">Banner</th>
                <th className="py-3.5 px-4">Campaign Title</th>
                <th className="py-3.5 px-4">Placement</th>
                <th className="py-3.5 px-4">Dates</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0DFD1]">
              {advertisements.map((ad) => (
                <tr
                  key={ad.id}
                  className={`hover:bg-[#FFFAF5]/60 transition-colors ${
                    selectedPreviewAdId === ad.id ? 'bg-[#FFF3EA]/40' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div
                      className="w-16 h-10 rounded-lg overflow-hidden border border-[#F0DFD1] cursor-pointer hover:scale-105 transition-transform bg-[#FFFAF5]"
                      onClick={() => setSelectedPreviewAdId(ad.id)}
                      title="Click to preview above"
                    >
                      <SafeImage
                        src={ad.desktopImage || ad.mobileImage}
                        alt={ad.title}
                        aspectRatio="aspect-auto"
                        fit="cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#24150F]">
                      {ad.title} {ad.subtitle}
                    </div>
                    <span className="text-[11px] text-[#82746B] line-clamp-1">{ad.tagline}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-xs">
                    <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                      {ad.placement}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-[#82746B]">
                    {ad.startDate} to {ad.endDate}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => toggleAdStatus(ad.id)}
                      className="cursor-pointer"
                      title="Click to toggle status"
                    >
                      <Badge variant={ad.isActive ? 'published' : 'inactive'}>
                        {ad.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedPreviewAdId(ad.id)}
                        className="p-1.5 rounded-lg text-[#82746B] hover:text-[#24150F] hover:bg-[#F8EBDD]/60"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ad)}
                        className="p-1.5 rounded-lg text-[#82746B] hover:text-[#F36B0A] hover:bg-[#FFF3EA]"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteDialog({ isOpen: true, id: ad.id, title: ad.title })}
                        className="p-1.5 rounded-lg text-[#82746B] hover:text-rose-600 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Advertisement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSearchParams({});
        }}
        title={editingId ? 'Edit Advertisement' : 'Create New Advertisement Banner'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Script Headline (e.g. Christmas, New Year) *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Christmas"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Main Subtitle *
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Special Offers"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Upgrade Your Home This Festive Season"
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
              Description *
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Get Amazing Discounts on Premium Furniture"
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Button Text *
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Shop Christmas Offers"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Destination URL *
              </label>
              <input
                type="text"
                value={buttonUrl}
                onChange={(e) => setButtonUrl(e.target.value)}
                placeholder="/shop"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Banner Placement *
              </label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A] bg-white"
              >
                <option value="hero_bottom">Homepage Hero Bottom</option>
                <option value="shop_banner">Shop Page Header</option>
                <option value="popup">Promotional Modal Popup</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
          </div>

          {/* Banner Images (Upload from Device or Web URL) */}
          <div className="space-y-4 pt-2 border-t border-[#F0DFD1]">
            <ImageUploadInput
              label="Desktop Banner Image"
              helpText="Upload wide format banner from your Mac or computer (recommended: 1600x600)."
              value={desktopImage}
              onChange={(newVal) => setDesktopImage(newVal)}
              presets={PRESET_BANNERS.map((b) => ({ desktop: b.desktop, label: b.label }))}
              required
            />

            <ImageUploadInput
              label="Mobile Banner Image (Optional)"
              helpText="Upload vertical/mobile banner from your device (recommended: 800x800). If empty, desktop image is used."
              value={mobileImage}
              onChange={(newVal) => setMobileImage(newVal)}
              presets={PRESET_BANNERS.map((b) => ({ desktop: b.mobile, label: b.label }))}
            />
          </div>

          <div className="pt-3 border-t border-[#F0DFD1]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#24150F]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-[#F0DFD1] text-[#F36B0A] focus:ring-[#F36B0A] w-4 h-4"
              />
              <span>Activate this advertisement immediately</span>
            </label>
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
              {editingId ? 'Update Advertisement' : 'Publish Advertisement'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null, title: '' })}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deleteDialog.title}" Campaign?`}
        message="This banner will be removed from your website placements."
      />
    </div>
  );
}
