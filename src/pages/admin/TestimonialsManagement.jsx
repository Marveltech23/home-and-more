import { useState } from 'react';
import { Plus, Pencil, Trash2, Star, CheckCircle2, Eye, User } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ImageUploadInput from '../../components/common/ImageUploadInput';
import { useStore } from '../../context/StoreContext';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
];

export default function TestimonialsManagement() {
  const {
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleTestimonialPublish,
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Abuja');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState('5');
  const [photo, setPhoto] = useState(PRESET_AVATARS[0]);
  const [isPublished, setIsPublished] = useState(true);

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, name: '' });

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setLocation('Abuja');
    setQuote('');
    setRating('5');
    setPhoto(PRESET_AVATARS[0]);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingId(t.id);
    setName(t.name);
    setLocation(t.location || 'Abuja');
    setQuote(t.quote);
    setRating(String(t.rating || 5));
    setPhoto(t.photo);
    setIsPublished(t.isPublished !== false);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      location: location.trim(),
      quote: quote.trim(),
      rating: Number(rating),
      photo,
      isPublished,
    };

    if (editingId) {
      updateTestimonial(editingId, payload);
    } else {
      addTestimonial(payload);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.id) {
      deleteTestimonial(deleteDialog.id);
      setDeleteDialog({ isOpen: false, id: null, name: '' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24150F] tracking-tight">
            Customer Testimonials
          </h1>
          <p className="text-xs sm:text-sm text-[#82746B] mt-0.5">
            Manage social proof, customer ratings, and reviews displayed on the storefront.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-primary text-xs sm:text-sm py-2.5 px-5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="card p-6 bg-white border border-[#F0DFD1] flex flex-col justify-between hover:shadow-card-hover transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#F36B0A]/40 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-base text-[#24150F]">{t.name}</h3>
                    <p className="text-xs text-[#82746B]">{t.location}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleTestimonialPublish(t.id)}
                  className="cursor-pointer"
                  title="Toggle storefront publish"
                >
                  <Badge variant={t.isPublished ? 'published' : 'inactive'}>
                    {t.isPublished ? 'Published' : 'Hidden'}
                  </Badge>
                </button>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 my-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < t.rating ? 'fill-[#F36B0A] text-[#F36B0A]' : 'fill-stone-200 text-stone-200'
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-[#24150F] italic leading-relaxed">
                "{t.quote}"
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#F0DFD1] flex items-center justify-between text-xs">
              <span className="text-[#82746B]">Added: {t.createdAt || '2026'}</span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(t)}
                  className="p-1.5 rounded-lg text-[#82746B] hover:text-[#F36B0A] hover:bg-[#FFF3EA]"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteDialog({ isOpen: true, id: t.id, name: t.name })}
                  className="p-1.5 rounded-lg text-[#82746B] hover:text-rose-600 hover:bg-rose-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Testimonial' : 'Add Customer Testimonial'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mrs. Adekunle"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Location *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Abuja"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
              Rating (1 to 5 Stars)
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A] bg-white"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
              <option value="3">⭐⭐⭐ (3 Stars)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
              Customer Quote / Feedback *
            </label>
            <textarea
              rows={3}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Excellent quality and stylish designs! My living room looks amazing."
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              required
            />
          </div>

          <ImageUploadInput
            label="Customer Photo / Avatar"
            helpText="Upload a photo from your device or choose from presets."
            value={photo}
            onChange={(newVal) => setPhoto(newVal)}
            presets={PRESET_AVATARS}
          />

          <div className="pt-2 border-t border-[#F0DFD1]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#24150F]">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded border-[#F0DFD1] text-[#F36B0A] focus:ring-[#F36B0A] w-4 h-4"
              />
              <span>Publish this testimonial on the homepage</span>
            </label>
          </div>

          <div className="pt-3 border-t border-[#F0DFD1] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs py-2 px-6">
              {editingId ? 'Save Changes' : 'Add Testimonial'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title={`Delete testimonial from ${deleteDialog.name}?`}
        message="This review will be removed from your website."
      />
    </div>
  );
}
