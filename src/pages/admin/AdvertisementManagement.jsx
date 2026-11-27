import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Pencil,
  Megaphone,
  Smartphone,
  Monitor,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Type,
  ArrowLeft,
  Save,
  Send,
  ExternalLink,
  AlertCircle,
  Clock,
  Sparkles,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import ImageUploadInput from '../../components/common/ImageUploadInput';
import AdBannerRenderer from '../../components/storefront/AdBannerRenderer';
import { useStore } from '../../context/StoreContext';
import { sanitizeUrl } from '../../utils/security';

const COLOR_PRESETS = [
  {
    name: 'Warm Ivory & Espresso',
    backgroundColor: '#F4ECE2',
    headlineColor: '#24150F',
    descriptionColor: '#5E5148',
    buttonBackgroundColor: '#F36B0A',
    buttonTextColor: '#FFFFFF',
  },
  {
    name: 'Deep Espresso & Cream',
    backgroundColor: '#24150F',
    headlineColor: '#FAF7F3',
    descriptionColor: '#DDD0C4',
    buttonBackgroundColor: '#F36B0A',
    buttonTextColor: '#FFFFFF',
  },
  {
    name: 'Brand Terracotta Orange',
    backgroundColor: '#D94D00',
    headlineColor: '#FFFFFF',
    descriptionColor: '#FFE8D6',
    buttonBackgroundColor: '#24150F',
    buttonTextColor: '#FFFFFF',
  },
  {
    name: 'Forest Pine & Warm Gold',
    backgroundColor: '#163026',
    headlineColor: '#FAF7F3',
    descriptionColor: '#D6E2DC',
    buttonBackgroundColor: '#E59A38',
    buttonTextColor: '#163026',
  },
  {
    name: 'Charcoal & Stone',
    backgroundColor: '#1E1D1B',
    headlineColor: '#FFFFFF',
    descriptionColor: '#C9C2B8',
    buttonBackgroundColor: '#FFFFFF',
    buttonTextColor: '#1E1D1B',
  },
];

const QUICK_DESTINATIONS = [
  { label: 'All Furniture (/shop)', url: '/shop' },
  { label: 'Sofa Sets', url: '/category/sofa-sets' },
  { label: 'Bedroom Sets', url: '/category/bedroom-sets' },
  { label: 'Center Tables', url: '/category/center-table' },
  { label: 'Dining Sets', url: '/category/dining-sets' },
  { label: 'Contact Showroom', url: '/contact' },
];

function buildDefaultSlotForm(slotPosition) {
  if (slotPosition === 'slot_2') {
    return {
      id: 'a_slot_2',
      name: 'Advertisement 2',
      slotPosition: 'slot_2',
      placement: 'slot_2',
      displayMode: 'text',
      status: 'published',
      isActive: true,
      desktopImage: '',
      mobileImage: '',
      altText: 'Home & More Bedroom & Dining Collection',
      imageFit: 'cover',
      headline: 'Bespoke Bedroom & Dining Suites',
      promotionalLabel: 'SHOWROOM EXCLUSIVE',
      discountText: 'FREE ABUJA SETUP',
      description: 'Crafted in our Dei-Dei factory with kiln-dried hardwood and custom fabric options.',
      ctaText: 'Explore Collections',
      destinationUrl: '/category/bedroom-sets',
      backgroundColor: '#24150F',
      backgroundImage: '',
      headlineColor: '#FAF7F3',
      descriptionColor: '#DDD0C4',
      buttonBackgroundColor: '#F36B0A',
      buttonTextColor: '#FFFFFF',
      textAlignment: 'left',
      contentPosition: 'left',
      bannerStyle: 'framed',
      startDate: '',
      endDate: '',
    };
  }

  if (slotPosition === 'top_banner') {
    return {
      id: 'a_top',
      name: 'Top Strip Banner (Before Hero)',
      slotPosition: 'top_banner',
      placement: 'top_banner',
      displayMode: 'image',
      status: 'published',
      isActive: true,
      desktopImage: '',
      mobileImage: '',
      altText: 'Home & More Festive Sale Strip',
      imageFit: 'cover',
      headline: 'Christmas Festive Sale',
      promotionalLabel: 'LIMITED OFFER',
      discountText: '',
      description: 'Special festive offers on luxury living, dining & bedroom furniture.',
      ctaText: 'Shop Now',
      destinationUrl: '/shop',
      backgroundColor: '#24150F',
      backgroundImage: '',
      headlineColor: '#FFFFFF',
      descriptionColor: '#F3ECE4',
      buttonBackgroundColor: '#F36B0A',
      buttonTextColor: '#FFFFFF',
      textAlignment: 'center',
      contentPosition: 'center',
      bannerStyle: 'editorial',
      startDate: '',
      endDate: '',
    };
  }

  return {
    id: 'a1',
    name: 'Advertisement 1',
    slotPosition: 'slot_1',
    placement: 'slot_1',
    displayMode: 'text',
    status: 'published',
    isActive: true,
    desktopImage: '',
    mobileImage: '',
    altText: 'Home & More Seasonal Living Room Sale',
    imageFit: 'cover',
    headline: 'Festive Living Room Offers',
    promotionalLabel: 'SEASONAL PROMOTION',
    discountText: 'SPECIAL SAVINGS',
    description: 'Upgrade your living space with handcrafted Italian-inspired sofas and center tables.',
    ctaText: 'Shop Sofa Sets',
    destinationUrl: '/category/sofa-sets',
    backgroundColor: '#F4ECE2',
    backgroundImage: '',
    headlineColor: '#24150F',
    descriptionColor: '#5E5148',
    buttonBackgroundColor: '#F36B0A',
    buttonTextColor: '#FFFFFF',
    textAlignment: 'left',
    contentPosition: 'left',
    bannerStyle: 'editorial',
    startDate: '',
    endDate: '',
  };
}

function formatUpdatedAt(dateStr) {
  if (!dateStr) return 'Not saved yet';
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export default function AdvertisementManagement() {
  const { advertisements, addAd, updateAd, deleteAd, toggleAdStatus, settings, updateSettings } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active editing mode: null (Overview) | 'carousel' | 'top_banner'
  const [editingSlot, setEditingSlot] = useState(null);
  const [editingAdId, setEditingAdId] = useState(null);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [validationError, setValidationError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(() => buildDefaultSlotForm('slot_1'));

  const maxCarouselSlides = Math.min(5, Math.max(1, Number(settings?.middleCarouselMaxSlides) || 5));

  // All Middle Carousel slides (1 to 5), sorted by slideOrder
  const carouselSlides = useMemo(
    () =>
      (advertisements || [])
        .filter((a) => a.placement !== 'top_banner' && a.slotPosition !== 'top_banner')
        .sort((a, b) => (Number(a.slideOrder) || 99) - (Number(b.slideOrder) || 99)),
    [advertisements]
  );

  const activeCarouselIds = useMemo(() => {
    const live = carouselSlides
      .filter((a) => a.isActive !== false && a.status !== 'draft')
      .slice(0, maxCarouselSlides);
    return new Set(live.map((a) => a.id));
  }, [carouselSlides, maxCarouselSlides]);

  const topStripAd = useMemo(
    () =>
      (advertisements || []).find(
        (a) => a.slotPosition === 'top_banner' || a.placement === 'top_banner'
      ) || null,
    [advertisements]
  );

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add' && !editingSlot) {
      openNewCarouselSlide();
    }
  }, [searchParams]);

  const openEditor = (slotType, existingAd = null) => {
    setValidationError('');
    setPreviewDevice('desktop');
    const isTop = slotType === 'top_banner';
    const existing = isTop ? topStripAd : existingAd;
    const defaults = buildDefaultSlotForm(isTop ? 'top_banner' : 'slot_1');

    if (existing) {
      setEditingAdId(existing.id);
      setForm({
        ...defaults,
        ...existing,
        slotPosition: isTop ? 'top_banner' : existing.slotPosition || 'slot_1',
        placement: isTop ? 'top_banner' : existing.placement || 'slot_1',
        name: existing.name || defaults.name,
        destinationUrl: existing.destinationUrl || existing.buttonUrl || defaults.destinationUrl,
        headline: existing.headline || existing.title || defaults.headline,
        promotionalLabel: existing.promotionalLabel ?? existing.subtitle ?? defaults.promotionalLabel,
        ctaText: existing.ctaText ?? existing.buttonText ?? defaults.ctaText,
      });
    } else {
      setEditingAdId(null);
      setForm(defaults);
    }
    setEditingSlot(slotType);
  };

  const openNewCarouselSlide = () => {
    if (carouselSlides.length >= 5) return;
    const nextOrder = carouselSlides.length + 1;
    setValidationError('');
    setPreviewDevice('desktop');
    setEditingAdId(null);
    setForm({
      ...buildDefaultSlotForm('slot_1'),
      id: `a_slide_${Date.now()}`,
      name: `Middle Carousel Slide ${nextOrder}`,
      slotPosition: `slot_${nextOrder}`,
      placement: `slot_${nextOrder}`,
      displayMode: 'image',
      desktopImage: '',
      mobileImage: '',
      headline: `Showroom Offer #${nextOrder}`,
      slideOrder: nextOrder,
      startDate: '',
      endDate: '',
    });
    setEditingSlot('carousel');
  };

  const closeEditor = () => {
    setEditingSlot(null);
    setEditingAdId(null);
    setValidationError('');
    if (searchParams.get('action')) {
      setSearchParams({});
    }
  };

  const handleMoveSlide = async (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= carouselSlides.length) return;
    const a = carouselSlides[index];
    const b = carouselSlides[targetIdx];
    const orderA = Number(a.slideOrder) || index + 1;
    const orderB = Number(b.slideOrder) || targetIdx + 1;
    await Promise.all([
      updateAd(a.id, { slideOrder: orderB }),
      updateAd(b.id, { slideOrder: orderA }),
    ]);
  };

  const updateField = (key, value) => {
    setValidationError('');
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const applyColorPreset = (preset) => {
    setForm((prev) => ({
      ...prev,
      backgroundColor: preset.backgroundColor,
      headlineColor: preset.headlineColor,
      descriptionColor: preset.descriptionColor,
      buttonBackgroundColor: preset.buttonBackgroundColor,
      buttonTextColor: preset.buttonTextColor,
    }));
  };

  const validateForPublish = () => {
    if (!form.name?.trim()) {
      return 'Please enter an Advertisement Name.';
    }
    if (form.displayMode === 'image') {
      if (!form.desktopImage?.trim() && !form.mobileImage?.trim()) {
        return 'Image Mode requires at least a Desktop advertisement image before publishing.';
      }
    } else {
      if (!form.headline?.trim()) {
        return 'Text / Design Mode requires a Main Headline before publishing.';
      }
    }
    if (form.destinationUrl?.trim()) {
      const safe = sanitizeUrl(form.destinationUrl, '');
      if (!safe) {
        return 'Please enter a valid Destination URL (e.g. /shop, /category/sofa-sets, or https://...).';
      }
    }
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      return 'Schedule End Date cannot be earlier than the Start Date.';
    }
    return '';
  };

  const handleSave = async (targetStatus) => {
    if (targetStatus === 'published') {
      const err = validateForPublish();
      if (err) {
        setValidationError(err);
        return;
      }
    } else if (!form.name?.trim()) {
      setValidationError('Please enter an Advertisement Name to save a draft.');
      return;
    }

    const cleanUrl = sanitizeUrl(form.destinationUrl, '/shop');
    const isPublished = targetStatus === 'published';

    const isTop = editingSlot === 'top_banner';
    const resolvedSlot = isTop ? 'top_banner' : form.slotPosition || 'slot_1';

    const payload = {
      ...form,
      name: form.name.trim(),
      title: form.headline?.trim() || form.name.trim(),
      headline: form.headline?.trim() || '',
      promotionalLabel: form.promotionalLabel?.trim() || '',
      subtitle: form.promotionalLabel?.trim() || '',
      discountText: form.discountText?.trim() || '',
      description: form.description?.trim() || '',
      ctaText: form.ctaText?.trim() || '',
      buttonText: form.ctaText?.trim() || '',
      destinationUrl: cleanUrl,
      buttonUrl: cleanUrl,
      altText: form.altText?.trim() || form.headline?.trim() || form.name.trim(),
      slotPosition: resolvedSlot,
      placement: resolvedSlot,
      slideOrder: Number(form.slideOrder) || carouselSlides.length + 1,
      status: targetStatus,
      isActive: isPublished ? form.isActive !== false : false,
      updatedAt: new Date().toISOString(),
    };

    setIsSaving(true);
    try {
      const res = editingAdId
        ? await updateAd(editingAdId, payload)
        : await addAd(payload);

      if (res && res.ok === false) {
        setValidationError(
          `Could not save to database: ${res.error || 'Please sign out and sign back in.'}`
        );
        return;
      }
      closeEditor();
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickToggle = (slotPosition, existingAd) => {
    if (existingAd) {
      // If it was a draft and admin enables it, also mark published
      if (!existingAd.isActive && existingAd.status === 'draft') {
        updateAd(existingAd.id, { isActive: true, status: 'published' });
      } else {
        toggleAdStatus(existingAd.id);
      }
    } else {
      // Initialize slot cleanly if it doesn't exist yet
      const defaults = buildDefaultSlotForm(slotPosition);
      addAd({ ...defaults, isActive: true, status: 'published' });
    }
  };

  // ==========================================
  // RENDER: ADVERTISEMENT STUDIO EDITOR VIEW
  // ==========================================
  if (editingSlot) {
    const isTopStrip = editingSlot === 'top_banner';
    const slotLabel = isTopStrip
      ? 'Top Strip Banner (Before Hero — 1920 × 108 px)'
      : form.name || 'Middle Carousel Slide (1920 × 600 px)';

    return (
      <div className="space-y-6">
        {/* Editor Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE2D9]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeEditor}
              className="p-2 rounded-xl border border-[#EAE2D9] bg-white text-[#24150F] hover:border-[#F36B0A] hover:text-[#F36B0A] transition-colors"
              aria-label="Back to Advertisement Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F36B0A]">
                Advertisement Studio
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#24150F] tracking-tight">
                Editing {slotLabel}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave('draft')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#EAE2D9] bg-white hover:bg-[#FAF7F3] text-[#24150F] text-xs font-bold transition-colors disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save as Draft'}</span>
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave('published')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F36B0A] hover:bg-[#D94D00] text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Publishing...' : 'Publish Advertisement'}</span>
            </button>
          </div>
        </div>

        {/* Validation Banner */}
        {validationError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        {/* 2-Column Studio Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* LEFT: Configuration Form */}
          <div className="xl:col-span-7 space-y-6">
            {/* 1. Name & Mode Selector */}
            <div className="bg-white rounded-2xl border border-[#EAE2D9] p-5 sm:p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#24150F] mb-1.5">
                  1. Advertisement Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g. Christmas Sofa Clearance"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EAE2D9] text-sm text-[#24150F] focus:outline-none focus:border-[#F36B0A]"
                />
              </div>

              {!isTopStrip && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#24150F] mb-2">
                    2. Advertisement Creation Mode
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateField('displayMode', 'image')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.displayMode === 'image'
                          ? 'border-[#F36B0A] bg-[#FFF7F1]'
                          : 'border-[#EAE2D9] bg-white hover:border-[#D9CBBF]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            form.displayMode === 'image'
                              ? 'bg-[#F36B0A] text-white'
                              : 'bg-[#FAF7F3] text-[#786B62]'
                          }`}
                        >
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm text-[#24150F]">
                          Image Mode
                        </span>
                      </div>
                      <p className="text-[11px] text-[#786B62] leading-relaxed">
                        Upload your own designed promotional graphic. Displays pure artwork with zero text overlays.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateField('displayMode', 'text')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.displayMode === 'text'
                          ? 'border-[#F36B0A] bg-[#FFF7F1]'
                          : 'border-[#EAE2D9] bg-white hover:border-[#D9CBBF]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            form.displayMode === 'text'
                              ? 'bg-[#F36B0A] text-white'
                              : 'bg-[#FAF7F3] text-[#786B62]'
                          }`}
                        >
                          <Type className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm text-[#24150F]">
                          Text / Design Mode
                        </span>
                      </div>
                      <p className="text-[11px] text-[#786B62] leading-relaxed">
                        Design a luxury promotional banner directly here with custom colours, typography &amp; CTA.
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. MODE A: IMAGE ADVERTISEMENT CONTROLS */}
            {(form.displayMode === 'image' || isTopStrip) && (
              <div className="bg-white rounded-2xl border border-[#EAE2D9] p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-extrabold text-[#24150F] uppercase tracking-wider">
                      Image Advertisement Artwork
                    </h2>
                    <p className="text-xs text-[#786B62] mt-0.5">
                      {isTopStrip
                        ? 'Recommended Desktop: 1920 × 108 px (or 1024 × 57 px, exact 18:1 ratio).'
                        : 'Recommended Desktop: 1920 × 600 px (or 1024 × 318 px, exact 3.22:1 panoramic ratio).'}
                    </p>
                  </div>
                  {form.desktopImage && (
                    <button
                      type="button"
                      onClick={() => updateField('desktopImage', '')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Desktop</span>
                    </button>
                  )}
                </div>

                <ImageUploadInput
                  label="Desktop Advertisement Image *"
                  helpText="Upload high-resolution artwork (JPG, PNG, WebP) or pick from Media Library."
                  value={form.desktopImage}
                  onChange={(val) => updateField('desktopImage', val)}
                />

                <div className="pt-3 border-t border-[#EAE2D9] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#24150F]">
                      Mobile Advertisement Image (Optional)
                    </span>
                    {form.mobileImage && (
                      <button
                        type="button"
                        onClick={() => updateField('mobileImage', '')}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Mobile</span>
                      </button>
                    )}
                  </div>
                  <ImageUploadInput
                    label=""
                    helpText="Optional mobile artwork (recommended 1080 × 600 px). If empty, desktop image adapts cleanly."
                    value={form.mobileImage}
                    onChange={(val) => updateField('mobileImage', val)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EAE2D9]">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                      Alternative Text (SEO &amp; Accessibility)
                    </label>
                    <input
                      type="text"
                      value={form.altText}
                      onChange={(e) => updateField('altText', e.target.value)}
                      placeholder="Describe the promotion artwork"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2D9] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                      Image Fit Mode
                    </label>
                    <select
                      value={form.imageFit}
                      onChange={(e) => updateField('imageFit', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2D9] text-xs sm:text-sm bg-white focus:outline-none focus:border-[#F36B0A]"
                    >
                      <option value="cover">Cover (Edge-to-Edge Fill)</option>
                      <option value="contain">Contain (Show Entire Image Uncropped)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3. MODE B: CUSTOM TEXT / DESIGN CONTROLS */}
            {form.displayMode === 'text' && !isTopStrip && (
              <>
                <div className="bg-white rounded-2xl border border-[#EAE2D9] p-5 sm:p-6 space-y-4">
                  <h2 className="text-sm font-extrabold text-[#24150F] uppercase tracking-wider">
                    Promotional Copy &amp; Content
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                        Promotional Label (Optional)
                      </label>
                      <input
                        type="text"
                        value={form.promotionalLabel}
                        onChange={(e) => updateField('promotionalLabel', e.target.value)}
                        placeholder="e.g. CHRISTMAS SALE"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2D9] text-sm focus:outline-none focus:border-[#F36B0A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                        Discount Highlight (Optional)
                      </label>
                      <input
                        type="text"
                        value={form.discountText}
                        onChange={(e) => updateField('discountText', e.target.value)}
                        placeholder="e.g. UP TO 30% OFF"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2D9] text-sm focus:outline-none focus:border-[#F36B0A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                      Main Headline *
                    </label>
                    <input
                      type="text"
                      value={form.headline}
                      onChange={(e) => updateField('headline', e.target.value)}
                      placeholder="e.g. Festive Living Room Collection"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2D9] text-sm focus:outline-none focus:border-[#F36B0A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                      Supporting Description
                    </label>
                    <textarea
                      rows={2}
                      value={form.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Short persuasive line about your furniture offer..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2D9] text-sm focus:outline-none focus:border-[#F36B0A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                      CTA Button Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.ctaText}
                      onChange={(e) => updateField('ctaText', e.target.value)}
                      placeholder="e.g. Shop Sofa Sets"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2D9] text-sm focus:outline-none focus:border-[#F36B0A]"
                    />
                  </div>
                </div>

                {/* Design & Colour Settings */}
                <div className="bg-white rounded-2xl border border-[#EAE2D9] p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-sm font-extrabold text-[#24150F] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#F36B0A]" />
                      <span>Design &amp; Colour Settings</span>
                    </h2>
                  </div>

                  {/* Quick Showroom Colour Palettes */}
                  <div>
                    <span className="block text-[11px] font-bold uppercase text-[#786B62] mb-2">
                      One-Click Luxury Palettes
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => applyColorPreset(preset)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#EAE2D9] bg-[#FAF7F3] hover:border-[#F36B0A] text-xs font-medium text-[#24150F] transition-colors"
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15"
                            style={{ backgroundColor: preset.backgroundColor }}
                          />
                          <span>{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5 Individual Colour Pickers */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                      { key: 'backgroundColor', label: 'Background' },
                      { key: 'headlineColor', label: 'Headline' },
                      { key: 'descriptionColor', label: 'Description' },
                      { key: 'buttonBackgroundColor', label: 'Button BG' },
                      { key: 'buttonTextColor', label: 'Button Text' },
                    ].map((c) => (
                      <label
                        key={c.key}
                        className="flex flex-col gap-1.5 p-2.5 rounded-xl border border-[#EAE2D9] bg-[#FAF7F3] cursor-pointer"
                      >
                        <span className="text-[10px] font-bold uppercase text-[#786B62]">
                          {c.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={form[c.key] || '#24150F'}
                            onChange={(e) => updateField(c.key, e.target.value)}
                            className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0"
                          />
                          <span className="text-[11px] font-mono text-[#24150F]">
                            {form[c.key]}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Alignment, Positioning & Banner Style */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#EAE2D9]">
                    <div>
                      <span className="block text-xs font-bold uppercase text-[#24150F] mb-1.5">
                        Text Alignment
                      </span>
                      <div className="flex rounded-xl border border-[#EAE2D9] overflow-hidden">
                        {[
                          { val: 'left', Icon: AlignLeft },
                          { val: 'center', Icon: AlignCenter },
                          { val: 'right', Icon: AlignRight },
                        ].map(({ val, Icon }) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateField('textAlignment', val)}
                            className={`flex-1 py-2 flex items-center justify-center transition-colors ${
                              form.textAlignment === val
                                ? 'bg-[#24150F] text-white'
                                : 'bg-white text-[#786B62] hover:bg-[#FAF7F3]'
                            }`}
                            aria-label={`Align ${val}`}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#24150F] mb-1.5">
                        Content Position
                      </label>
                      <select
                        value={form.contentPosition}
                        onChange={(e) => updateField('contentPosition', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#EAE2D9] text-xs sm:text-sm bg-white focus:outline-none focus:border-[#F36B0A]"
                      >
                        <option value="left">Left Aligned</option>
                        <option value="center">Centered</option>
                        <option value="right">Right Aligned</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#24150F] mb-1.5">
                        Banner Style
                      </label>
                      <select
                        value={form.bannerStyle}
                        onChange={(e) => updateField('bannerStyle', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#EAE2D9] text-xs sm:text-sm bg-white focus:outline-none focus:border-[#F36B0A]"
                      >
                        <option value="editorial">Editorial Clean</option>
                        <option value="framed">Architectural Frame</option>
                        <option value="bold">Bold Accent Strip</option>
                      </select>
                    </div>
                  </div>

                  {/* Optional Background Image */}
                  <div className="pt-3 border-t border-[#EAE2D9] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-[#24150F]">
                        Optional Background Photo
                      </span>
                      {form.backgroundImage && (
                        <button
                          type="button"
                          onClick={() => updateField('backgroundImage', '')}
                          className="text-xs font-semibold text-rose-600 hover:underline"
                        >
                          Remove Background Photo
                        </button>
                      )}
                    </div>
                    <ImageUploadInput
                      label=""
                      helpText="Optional lifestyle photo blended softly behind your typography."
                      value={form.backgroundImage}
                      onChange={(val) => updateField('backgroundImage', val)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* 4. Destination URL, Schedule & Active Status */}
            <div className="bg-white rounded-2xl border border-[#EAE2D9] p-5 sm:p-6 space-y-4">
              <h2 className="text-sm font-extrabold text-[#24150F] uppercase tracking-wider">
                Destination Link, Schedule &amp; Visibility
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                  Click Destination URL *
                </label>
                <input
                  type="text"
                  value={form.destinationUrl}
                  onChange={(e) => updateField('destinationUrl', e.target.value)}
                  placeholder="/shop or https://wa.me/2348033513144"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2D9] text-sm focus:outline-none focus:border-[#F36B0A]"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {QUICK_DESTINATIONS.map((d) => (
                    <button
                      key={d.url}
                      type="button"
                      onClick={() => updateField('destinationUrl', d.url)}
                      className="px-2.5 py-1 rounded-full bg-[#FAF7F3] border border-[#EAE2D9] text-[11px] font-medium text-[#786B62] hover:border-[#F36B0A] hover:text-[#F36B0A]"
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                    Schedule Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={form.startDate || ''}
                    onChange={(e) => updateField('startDate', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2D9] text-sm focus:outline-none focus:border-[#F36B0A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                    Schedule End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={form.endDate || ''}
                    onChange={(e) => updateField('endDate', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2D9] text-sm focus:outline-none focus:border-[#F36B0A]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF7F3] border border-[#EAE2D9] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive !== false}
                  onChange={(e) => updateField('isActive', e.target.checked)}
                  className="w-4 h-4 accent-[#F36B0A] rounded"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#24150F] block">
                    Active on Storefront
                  </span>
                  <span className="text-[11px] text-[#786B62]">
                    Uncheck to temporarily hide this slot without losing your design.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* RIGHT: Sticky Live Desktop & Mobile Preview */}
          <div className="xl:col-span-5 xl:sticky xl:top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-[#EAE2D9] p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-extrabold text-[#24150F]">Live Preview</h2>
                  <p className="text-[11px] text-[#786B62]">
                    Updates instantly as you edit
                  </p>
                </div>

                <div className="flex items-center bg-[#FAF7F3] border border-[#EAE2D9] rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      previewDevice === 'desktop'
                        ? 'bg-[#24150F] text-white'
                        : 'text-[#786B62] hover:text-[#24150F]'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      previewDevice === 'mobile'
                        ? 'bg-[#24150F] text-white'
                        : 'text-[#786B62] hover:text-[#24150F]'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              {/* Preview Stage */}
              <div className="rounded-2xl bg-[#FAF7F3] border border-[#EAE2D9] p-4 flex justify-center overflow-hidden">
                <div
                  className={
                    previewDevice === 'mobile'
                      ? 'w-full max-w-[360px] transition-all duration-300'
                      : 'w-full transition-all duration-300'
                  }
                >
                  {isTopStrip ? (
                    form.desktopImage ? (
                      <div className="w-full overflow-hidden rounded-lg border border-[#EAE2D9]">
                        <img
                          src={
                            previewDevice === 'mobile'
                              ? form.mobileImage || form.desktopImage
                              : form.desktopImage
                          }
                          alt={form.altText || form.name}
                          className={`w-full ${
                            previewDevice === 'mobile' ? 'h-auto max-h-20' : 'aspect-[1024/57]'
                          } object-cover`}
                        />
                      </div>
                    ) : (
                      <div className="w-full py-3 px-4 rounded-lg bg-[#24150F] text-white text-center text-xs">
                        Upload a 1920 × 108 px (18:1) strip image to preview
                      </div>
                    )
                  ) : (
                    <AdBannerRenderer
                      ad={form}
                      previewDevice={previewDevice}
                      isSingleFullWidth={!isTopStrip}
                      disableNavigation
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#786B62] pt-1">
                <span>
                  Mode:{' '}
                  <strong className="text-[#24150F] uppercase">
                    {form.displayMode === 'image' ? 'Image Artwork' : 'Custom Text / Design'}
                  </strong>
                </span>
                <span className="truncate max-w-[200px]">
                  Link: <strong className="text-[#F36B0A]">{form.destinationUrl || '/shop'}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: ADVERTISEMENT OVERVIEW (2 SLOTS + TOP STRIP)
  // ==========================================
  const renderSlotCard = (slotKey, titleLabel, subtitleLabel, existingAd) => {
    const displayAd = existingAd || buildDefaultSlotForm(slotKey);
    const isLive = Boolean(existingAd && existingAd.isActive !== false && existingAd.status !== 'draft');
    const isDraft = Boolean(existingAd && existingAd.status === 'draft');

    return (
      <div className="bg-white rounded-2xl border border-[#EAE2D9] shadow-xs overflow-hidden flex flex-col justify-between">
        <div className="p-5 sm:p-6 space-y-4">
          {/* Card Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-extrabold text-[#24150F]">{titleLabel}</h2>
                {isLive ? (
                  <Badge variant="success">Live</Badge>
                ) : isDraft ? (
                  <Badge variant="warning">Draft</Badge>
                ) : (
                  <Badge variant="neutral">Disabled</Badge>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F3] border border-[#EAE2D9] text-[11px] font-semibold text-[#786B62]">
                  {displayAd.displayMode === 'image' ? (
                    <>
                      <ImageIcon className="w-3 h-3 text-[#F36B0A]" />
                      <span>Image Mode</span>
                    </>
                  ) : (
                    <>
                      <Type className="w-3 h-3 text-[#F36B0A]" />
                      <span>Text / Design Mode</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-[#786B62] mt-1">{subtitleLabel}</p>
            </div>

            {/* Enable / Disable Toggle */}
            <button
              type="button"
              onClick={() => handleQuickToggle(slotKey, existingAd)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors shrink-0 ${
                isLive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-[#FAF7F3] text-[#786B62] border-[#EAE2D9] hover:border-[#F36B0A] hover:text-[#F36B0A]'
              }`}
            >
              {isLive ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enabled</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Disabled</span>
                </>
              )}
            </button>
          </div>

          {/* Live Visual Preview */}
          <div className="rounded-xl bg-[#FAF7F3] p-3 border border-[#EAE2D9]">
            <AdBannerRenderer
              ad={displayAd}
              previewDevice="desktop"
              isSingleFullWidth={slotKey === 'slot_1'}
              disableNavigation
            />
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#786B62]">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F36B0A]" />
              <span>Updated: {formatUpdatedAt(existingAd?.updatedAt || existingAd?.createdAt)}</span>
            </span>
            <span className="truncate max-w-[220px]">
              Links to: <strong className="text-[#24150F]">{displayAd.destinationUrl || '/shop'}</strong>
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-[#FAF7F3] border-t border-[#EAE2D9] flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-[#24150F] truncate">
            {existingAd ? existingAd.name || existingAd.title : 'Not configured yet'}
          </span>
          <button
            type="button"
            onClick={() => openEditor(slotKey)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F36B0A] hover:bg-[#D94D00] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit {titleLabel}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24150F] tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-[#F36B0A]" />
            <span>Advertisement Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#786B62] mt-1">
            Independently manage your two Homepage Promotional Slots (Image Mode or Custom Text/Design Mode) and Top Announcement Strip.
          </p>
        </div>

        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#EAE2D9] bg-white hover:border-[#F36B0A] hover:text-[#F36B0A] text-xs font-bold text-[#24150F] transition-colors shrink-0"
        >
          <span>View Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* MIDDLE PROMOTIONAL CAROUSEL (1 to 5 Full-Width Slides — 1920x600 / 1024x318) */}
      <div className="bg-white rounded-2xl border border-[#EAE2D9] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#EAE2D9]">
          <div>
            <h2 className="text-lg font-extrabold text-[#24150F]">
              Middle Promotional Carousel (1–5 Slides)
            </h2>
            <p className="text-xs text-[#786B62] mt-0.5">
              Full-width left/right sliding carousel (exact <strong>1920 × 600 px</strong> / <strong>1024 × 318 px</strong> panoramic ratio). Add up to 5 slides and choose how many appear on the storefront.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Backend Slide Count Selector */}
            <div className="flex items-center gap-2 bg-[#FAF7F3] border border-[#EAE2D9] rounded-xl px-3 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#F36B0A]" />
              <span className="text-[11px] font-bold text-[#24150F] whitespace-nowrap">
                Show on Storefront:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => updateSettings({ middleCarouselMaxSlides: count })}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                      maxCarouselSlides === count
                        ? 'bg-[#F36B0A] text-white shadow-xs'
                        : 'bg-white text-[#786B62] border border-[#EAE2D9] hover:border-[#F36B0A] hover:text-[#F36B0A]'
                    }`}
                    title={`Show up to ${count} slide${count > 1 ? 's' : ''} on the storefront`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={carouselSlides.length >= 5}
              onClick={openNewCarouselSlide}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F36B0A] hover:bg-[#D94D00] text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add Slide ({carouselSlides.length}/5)</span>
            </button>
          </div>
        </div>

        {/* Slide Cards List */}
        <div className="grid grid-cols-1 gap-5">
          {carouselSlides.map((slide, idx) => {
            const isLive = slide.isActive !== false && slide.status !== 'draft';
            const isShowingOnFront = activeCarouselIds.has(slide.id);

            return (
              <div
                key={slide.id}
                className="rounded-2xl border border-[#EAE2D9] bg-[#FAF7F3]/50 overflow-hidden"
              >
                <div className="p-4 sm:p-5 space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#24150F] text-white text-[11px] font-bold">
                        Slide #{idx + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-extrabold text-[#24150F]">
                        {slide.name || slide.title || `Carousel Slide ${idx + 1}`}
                      </h3>
                      {isShowingOnFront ? (
                        <Badge variant="success">Showing on Storefront</Badge>
                      ) : isLive ? (
                        <Badge variant="warning">Hidden (Limit: {maxCarouselSlides})</Badge>
                      ) : slide.status === 'draft' ? (
                        <Badge variant="warning">Draft</Badge>
                      ) : (
                        <Badge variant="neutral">Disabled</Badge>
                      )}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-[#EAE2D9] text-[11px] font-semibold text-[#786B62]">
                        {slide.displayMode === 'image' ? (
                          <>
                            <ImageIcon className="w-3 h-3 text-[#F36B0A]" />
                            <span>Image Mode</span>
                          </>
                        ) : (
                          <>
                            <Type className="w-3 h-3 text-[#F36B0A]" />
                            <span>Text Mode</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSlide(idx, -1)}
                        className="p-1.5 rounded-lg border border-[#EAE2D9] bg-white text-[#24150F] hover:border-[#F36B0A] hover:text-[#F36B0A] disabled:opacity-40"
                        title="Move slide earlier"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === carouselSlides.length - 1}
                        onClick={() => handleMoveSlide(idx, 1)}
                        className="p-1.5 rounded-lg border border-[#EAE2D9] bg-white text-[#24150F] hover:border-[#F36B0A] hover:text-[#F36B0A] disabled:opacity-40"
                        title="Move slide later"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickToggle(slide.slotPosition || 'slot_1', slide)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                          isLive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-white text-[#786B62] border-[#EAE2D9] hover:border-[#F36B0A] hover:text-[#F36B0A]'
                        }`}
                      >
                        {isLive ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Enabled</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Full-width 1024x318 Preview */}
                  <div className="rounded-xl bg-white p-2.5 border border-[#EAE2D9]">
                    <AdBannerRenderer
                      ad={slide}
                      previewDevice="desktop"
                      isSingleFullWidth
                      disableNavigation
                    />
                  </div>

                  {/* Footer Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#786B62]">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#F36B0A]" />
                        <span>Updated: {formatUpdatedAt(slide.updatedAt || slide.createdAt)}</span>
                      </span>
                      <span>
                        Links to: <strong className="text-[#24150F]">{slide.destinationUrl || '/shop'}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {carouselSlides.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteAd(slide.id)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => openEditor('carousel', slide)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F36B0A] hover:bg-[#D94D00] text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit Slide #{idx + 1}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Strip Banner (Before Hero) Management Panel */}
      <div className="bg-white rounded-2xl border border-[#EAE2D9] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#24150F]">
                Top Strip Banner (Before Hero Section)
              </h2>
              {topStripAd?.isActive ? (
                <Badge variant="success">Live</Badge>
              ) : (
                <Badge variant="neutral">Disabled</Badge>
              )}
            </div>
            <p className="text-xs text-[#786B62] mt-0.5">
              Slim full-width promotional ribbon above the Hero Banner. Recommended graphic size: <strong>1920 × 108 px</strong> (or 1024 × 57 px, 18:1 ratio).
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleQuickToggle('top_banner', topStripAd)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                topStripAd?.isActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-[#FAF7F3] text-[#786B62] border-[#EAE2D9]'
              }`}
            >
              {topStripAd?.isActive ? 'Enabled' : 'Disabled'}
            </button>
            <button
              type="button"
              onClick={() => openEditor('top_banner')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#24150F] hover:bg-[#3A2218] text-white text-xs font-bold transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Top Strip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
