import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, FileText, ExternalLink, Calendar, User } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ImageUploadInput from '../../components/common/ImageUploadInput';
import SafeImage from '../../components/common/SafeImage';
import { useStore } from '../../context/StoreContext';

const PRESET_BLOG_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=80',
];

export default function BlogManagement() {
  const { blogs, addBlog, updateBlog, deleteBlog } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Home & More Styling Team');
  const [category, setCategory] = useState('Interior Design');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState(PRESET_BLOG_IMAGES[0]);
  const [readTime, setReadTime] = useState('4 min read');
  const [status, setStatus] = useState('published');

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, title: '' });

  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('edit');

    if (action === 'add') {
      handleOpenAdd();
    } else if (editId) {
      const b = blogs.find((item) => item.id === editId);
      if (b) handleOpenEdit(b);
    }
  }, [searchParams, blogs]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setAuthor('Home & More Styling Team');
    setCategory('Interior Design');
    setExcerpt('');
    setContent('');
    setFeaturedImage(PRESET_BLOG_IMAGES[0]);
    setReadTime('4 min read');
    setStatus('published');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingId(b.id);
    setTitle(b.title);
    setAuthor(b.author || 'Home & More Styling Team');
    setCategory(b.category || 'Interior Design');
    setExcerpt(b.excerpt || '');
    setContent(b.content || '');
    setFeaturedImage(b.featuredImage || b.image || PRESET_BLOG_IMAGES[0]);
    setReadTime(b.readTime || '4 min read');
    setStatus(b.status || 'published');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      featuredImage,
      readTime: readTime.trim(),
      status,
    };

    if (editingId) {
      updateBlog(editingId, payload);
    } else {
      addBlog(payload);
    }

    setIsModalOpen(false);
    setSearchParams({});
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.id) {
      deleteBlog(deleteDialog.id);
      setDeleteDialog({ isOpen: false, id: null, title: '' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24150F] tracking-tight">
            Blog Post Management
          </h1>
          <p className="text-xs sm:text-sm text-[#82746B] mt-0.5">
            Publish design guides, furniture styling tips, and home care articles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-primary text-xs sm:text-sm py-2.5 px-5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Blogs Table */}
      <div className="card overflow-hidden bg-white border border-[#F0DFD1]">
        <div className="p-4 sm:p-5 border-b border-[#F0DFD1] flex items-center justify-between">
          <h2 className="font-bold text-base text-[#24150F]">Published Articles</h2>
          <span className="text-xs font-semibold text-[#82746B]">{blogs.length} articles</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FFFAF5] border-b border-[#F0DFD1] text-[11px] font-bold uppercase tracking-wider text-[#82746B]">
              <tr>
                <th className="py-3.5 px-4">Article</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0DFD1]">
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-[#FFFAF5]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 rounded-xl overflow-hidden border border-[#F0DFD1] shrink-0 bg-[#FFFAF5]">
                        <SafeImage
                          src={b.featuredImage || b.image}
                          alt={b.title}
                          aspectRatio="aspect-auto"
                          fit="cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-[#24150F] line-clamp-1">{b.title}</p>
                        <span className="text-[11px] text-[#82746B] line-clamp-1">{b.excerpt}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-[#24150F]">{b.category}</td>

                  <td className="py-3.5 px-4 text-xs text-[#82746B]">{b.author}</td>

                  <td className="py-3.5 px-4 text-xs text-[#82746B]">{b.publishedAt || b.date}</td>

                  <td className="py-3.5 px-4">
                    <Badge variant={b.status === 'published' ? 'published' : 'draft'}>
                      {b.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <a
                        href={`/blog/${b.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-[#82746B] hover:text-[#24150F] hover:bg-[#F8EBDD]/60"
                        title="View Article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(b)}
                        className="p-1.5 rounded-lg text-[#82746B] hover:text-[#F36B0A] hover:bg-[#FFF3EA]"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteDialog({ isOpen: true, id: b.id, title: b.title })}
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

      {/* Add / Edit Article Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSearchParams({});
        }}
        title={editingId ? 'Edit Article' : 'Write New Article'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
              Article Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Modern Living Tips for Your Home"
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A] bg-white"
              >
                <option value="Interior Design">Interior Design</option>
                <option value="Buying Guide">Buying Guide</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Living Room">Living Room</option>
                <option value="Woodcare">Woodcare</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Read Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="4 min read"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
              Short Excerpt *
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary for listings..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
              Article Content *
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here. Use ### for subheadings."
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              required
            />
          </div>

          <ImageUploadInput
            label="Featured Article Image"
            helpText="Upload a featured image from your device or select from presets."
            value={featuredImage}
            onChange={(newVal) => setFeaturedImage(newVal)}
            presets={PRESET_BLOG_IMAGES}
            required
          />

          <div className="pt-2 border-t border-[#F0DFD1] flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs font-semibold">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="blog_status"
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
                  name="blog_status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="text-[#82746B]"
                />
                <span className="text-stone-600">Draft</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSearchParams({});
                }}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs py-2 px-6">
                {editingId ? 'Save Changes' : 'Publish Article'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null, title: '' })}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deleteDialog.title}"?`}
        message="This article will be removed from your blog."
      />
    </div>
  );
}
