import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { products as initialProducts } from '../data/products';
import { categories as initialCategories } from '../data/categories';
import { advertisements as initialAds } from '../data/advertisements';
import { blogs as initialBlogs } from '../data/blogs';
import { mediaItems as initialMedia } from '../data/media';
import { enquiries as initialEnquiries } from '../data/enquiries';
import { testimonials as initialTestimonials } from '../data/testimonials';
import { siteSettings as initialSettings, heroSlides as initialHeroSlides } from '../data/siteSettings';
import { useToast } from '../components/common/Toast';

const StoreContext = createContext(null);

const STORAGE_KEYS = {
  PRODUCTS: 'hm_store_products_v1',
  CATEGORIES: 'hm_store_categories_v1',
  ADS: 'hm_store_ads_v1',
  BLOGS: 'hm_store_blogs_v1',
  MEDIA: 'hm_store_media_v1',
  ENQUIRIES: 'hm_store_enquiries_v1',
  TESTIMONIALS: 'hm_store_testimonials_v1',
  SETTINGS: 'hm_store_settings_v1',
  HERO: 'hm_store_hero_v1',
};

function getStoredOr(key, fallback) {
  try {
    const val = sessionStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }) {
  const { addToast } = useToast();

  const [products, setProducts] = useState(() => getStoredOr(STORAGE_KEYS.PRODUCTS, initialProducts));
  const [categories, setCategories] = useState(() => getStoredOr(STORAGE_KEYS.CATEGORIES, initialCategories));
  const [advertisements, setAdvertisements] = useState(() => getStoredOr(STORAGE_KEYS.ADS, initialAds));
  const [blogs, setBlogs] = useState(() => getStoredOr(STORAGE_KEYS.BLOGS, initialBlogs));
  const [media, setMedia] = useState(() => getStoredOr(STORAGE_KEYS.MEDIA, initialMedia));
  const [enquiries, setEnquiries] = useState(() => getStoredOr(STORAGE_KEYS.ENQUIRIES, initialEnquiries));
  const [testimonials, setTestimonials] = useState(() => getStoredOr(STORAGE_KEYS.TESTIMONIALS, initialTestimonials));
  const [settings, setSettings] = useState(() => getStoredOr(STORAGE_KEYS.SETTINGS, initialSettings));
  const [heroSlides, setHeroSlides] = useState(() => getStoredOr(STORAGE_KEYS.HERO, initialHeroSlides));

  // Sync to sessionStorage so navigation and refresh in same session keeps edits
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      sessionStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      sessionStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(advertisements));
      sessionStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
      sessionStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
      sessionStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
      sessionStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
      sessionStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      sessionStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(heroSlides));
    } catch (e) {
      console.warn('Storage sync issue:', e);
    }
  }, [products, categories, advertisements, blogs, media, enquiries, testimonials, settings, heroSlides]);

  // PRODUCT ACTIONS
  const addProduct = useCallback((productData) => {
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct = {
      ...productData,
      id: `p_${Date.now()}`,
      slug: productData.slug || slug,
      price: Number(productData.price) || 0,
      discountPrice: productData.discountPrice ? Number(productData.discountPrice) : null,
      stock: Number(productData.stock) || 0,
      featured: Boolean(productData.featured),
      status: productData.status || 'published',
      image: productData.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      gallery: productData.gallery?.length ? productData.gallery : [productData.image],
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast({ message: `Product "${newProduct.name}" added successfully!`, type: 'success' });
    return newProduct;
  }, [addToast]);

  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const price = updates.price !== undefined ? Number(updates.price) : p.price;
        const discountPrice = updates.discountPrice !== undefined ? (updates.discountPrice ? Number(updates.discountPrice) : null) : p.discountPrice;
        return { ...p, ...updates, price, discountPrice };
      })
    );
    addToast({ message: 'Product updated successfully!', type: 'success' });
  }, [addToast]);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast({ message: 'Product deleted from store', type: 'info' });
  }, [addToast]);

  // CATEGORY ACTIONS
  const addCategory = useCallback((categoryData) => {
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCategory = {
      ...categoryData,
      id: `c_${Date.now()}`,
      slug: categoryData.slug || slug,
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
      displayOrder: categoryData.displayOrder || 99,
      image: categoryData.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    };
    setCategories((prev) => [...prev, newCategory]);
    addToast({ message: `Category "${newCategory.name}" created!`, type: 'success' });
    return newCategory;
  }, [addToast]);

  const updateCategory = useCallback((id, updates) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    addToast({ message: 'Category updated successfully!', type: 'success' });
  }, [addToast]);

  const deleteCategory = useCallback((id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addToast({ message: 'Category removed', type: 'info' });
  }, [addToast]);

  // ADVERTISEMENT ACTIONS
  const addAd = useCallback((adData) => {
    const newAd = {
      ...adData,
      id: `a_${Date.now()}`,
      isActive: adData.isActive !== undefined ? adData.isActive : true,
      clicks: 0,
      placement: adData.placement || 'hero_bottom',
      desktopImage: adData.desktopImage || 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=1600&q=80',
      mobileImage: adData.mobileImage || adData.desktopImage || 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=800&q=80',
    };
    setAdvertisements((prev) => [newAd, ...prev]);
    addToast({ message: `Advertisement "${newAd.title}" published!`, type: 'success' });
    return newAd;
  }, [addToast]);

  const updateAd = useCallback((id, updates) => {
    setAdvertisements((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    addToast({ message: 'Advertisement updated!', type: 'success' });
  }, [addToast]);

  const deleteAd = useCallback((id) => {
    setAdvertisements((prev) => prev.filter((a) => a.id !== id));
    addToast({ message: 'Advertisement deleted', type: 'info' });
  }, [addToast]);

  const toggleAdStatus = useCallback((id) => {
    setAdvertisements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
    addToast({ message: 'Advertisement status updated', type: 'info' });
  }, [addToast]);

  // BLOG ACTIONS
  const addBlog = useCallback((blogData) => {
    const slug = blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newBlog = {
      ...blogData,
      id: `b_${Date.now()}`,
      slug: blogData.slug || slug,
      publishedAt: new Date().toISOString().split('T')[0],
      status: blogData.status || 'published',
      featuredImage: blogData.featuredImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      readTime: blogData.readTime || '4 min read',
    };
    setBlogs((prev) => [newBlog, ...prev]);
    addToast({ message: `Article "${newBlog.title}" published!`, type: 'success' });
    return newBlog;
  }, [addToast]);

  const updateBlog = useCallback((id, updates) => {
    setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    addToast({ message: 'Blog article updated!', type: 'success' });
  }, [addToast]);

  const deleteBlog = useCallback((id) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    addToast({ message: 'Blog article deleted', type: 'info' });
  }, [addToast]);

  // MEDIA ACTIONS
  const addMedia = useCallback((item) => {
    const newItem = {
      ...item,
      id: `m_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      type: item.type || 'image/jpeg',
      size: item.size || '1.5 MB',
      dimensions: item.dimensions || '1920x1080',
    };
    setMedia((prev) => [newItem, ...prev]);
    addToast({ message: `Image "${newItem.name}" uploaded to Media Library!`, type: 'success' });
    return newItem;
  }, [addToast]);

  const deleteMedia = useCallback((id) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
    addToast({ message: 'Image deleted from Media Library', type: 'info' });
  }, [addToast]);

  // ENQUIRY ACTIONS
  const addEnquiry = useCallback((enquiryData) => {
    const newEnquiry = {
      ...enquiryData,
      id: `e_${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);
    addToast({ message: 'Enquiry sent successfully! Our representative will contact you.', type: 'success' });
    return newEnquiry;
  }, [addToast]);

  const updateEnquiryStatus = useCallback((id, status, notes) => {
    setEnquiries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        return {
          ...e,
          status,
          notes: notes !== undefined ? notes : e.notes,
        };
      })
    );
    addToast({ message: `Enquiry status updated to ${status}`, type: 'success' });
  }, [addToast]);

  const deleteEnquiry = useCallback((id) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    addToast({ message: 'Enquiry removed', type: 'info' });
  }, [addToast]);

  // TESTIMONIAL ACTIONS
  const addTestimonial = useCallback((data) => {
    const newTestimonial = {
      ...data,
      id: `t_${Date.now()}`,
      rating: Number(data.rating) || 5,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      createdAt: new Date().toISOString().split('T')[0],
      photo: data.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    };
    setTestimonials((prev) => [newTestimonial, ...prev]);
    addToast({ message: 'Testimonial added!', type: 'success' });
    return newTestimonial;
  }, [addToast]);

  const updateTestimonial = useCallback((id, updates) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    addToast({ message: 'Testimonial updated!', type: 'success' });
  }, [addToast]);

  const deleteTestimonial = useCallback((id) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    addToast({ message: 'Testimonial deleted', type: 'info' });
  }, [addToast]);

  const toggleTestimonialPublish = useCallback((id) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPublished: !t.isPublished } : t))
    );
    addToast({ message: 'Testimonial status toggled', type: 'info' });
  }, [addToast]);

  // SETTINGS ACTION
  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast({ message: 'Website settings saved!', type: 'success' });
  }, [addToast]);

  // RESET TO DEFAULT
  const resetToDefaults = useCallback(() => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setAdvertisements(initialAds);
    setBlogs(initialBlogs);
    setMedia(initialMedia);
    setEnquiries(initialEnquiries);
    setTestimonials(initialTestimonials);
    setSettings(initialSettings);
    setHeroSlides(initialHeroSlides);
    sessionStorage.clear();
    addToast({ message: 'All demo data has been reset to defaults', type: 'info' });
  }, [addToast]);

  // GETTERS & DERIVED DATA
  const activeAds = useMemo(() => advertisements.filter((a) => a.isActive), [advertisements]);
  const featuredProducts = useMemo(() => products.filter((p) => p.featured && p.status === 'published'), [products]);
  const publishedBlogs = useMemo(() => blogs.filter((b) => b.status === 'published'), [blogs]);
  const publishedTestimonials = useMemo(() => testimonials.filter((t) => t.isPublished), [testimonials]);

  const getProductBySlug = useCallback((slug) => products.find((p) => p.slug === slug), [products]);
  const getCategoryBySlug = useCallback((slug) => categories.find((c) => c.slug === slug), [categories]);

  return (
    <StoreContext.Provider
      value={{
        // Data
        products,
        categories,
        advertisements,
        blogs,
        media,
        enquiries,
        testimonials,
        settings,
        heroSlides,

        // Derived
        activeAds,
        featuredProducts,
        publishedBlogs,
        publishedTestimonials,

        // Product CRUD
        addProduct,
        updateProduct,
        deleteProduct,
        getProductBySlug,

        // Category CRUD
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryBySlug,

        // Ad CRUD
        addAd,
        updateAd,
        deleteAd,
        toggleAdStatus,

        // Blog CRUD
        addBlog,
        updateBlog,
        deleteBlog,

        // Media CRUD
        addMedia,
        deleteMedia,

        // Enquiry CRUD
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,

        // Testimonial CRUD
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        toggleTestimonialPublish,

        // Settings
        updateSettings,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
