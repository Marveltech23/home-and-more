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
import { setBrowserFavicon } from '../utils/dynamicFavicon';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  fetchAllSupabaseData,
  syncCategoryToDb,
  deleteCategoryFromDb,
  syncProductToDb,
  deleteProductFromDb,
  syncAdToDb,
  deleteAdFromDb,
  syncBlogToDb,
  deleteBlogFromDb,
  syncTestimonialToDb,
  deleteTestimonialFromDb,
  syncEnquiryToDb,
  updateEnquiryStatusInDb,
  deleteEnquiryFromDb,
  syncSettingsToDb,
} from '../lib/supabaseService';

const StoreContext = createContext(null);

// Shared localStorage keys
const STORAGE_KEYS = {
  PRODUCTS: 'hm_store_products_v2',
  CATEGORIES: 'hm_store_categories_v2',
  ADS: 'hm_store_ads_v2',
  BLOGS: 'hm_store_blogs_v2',
  MEDIA: 'hm_store_media_v2',
  ENQUIRIES: 'hm_store_enquiries_v2',
  TESTIMONIALS: 'hm_store_testimonials_v2',
  SETTINGS: 'hm_store_settings_v2',
  HERO: 'hm_store_hero_v2',
};

function getStoredOr(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Storage quota exceeded or error writing ${key}:`, e);
  }
}

// Cross-tab broadcast channel for instantaneous sync between Admin and Storefront tabs
const syncChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('hm_store_broadcast_channel')
    : null;

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
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);

  // Sync state to localStorage cache
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.PRODUCTS, products);
    safeSetItem(STORAGE_KEYS.CATEGORIES, categories);
    safeSetItem(STORAGE_KEYS.ADS, advertisements);
    safeSetItem(STORAGE_KEYS.BLOGS, blogs);
    safeSetItem(STORAGE_KEYS.MEDIA, media);
    safeSetItem(STORAGE_KEYS.ENQUIRIES, enquiries);
    safeSetItem(STORAGE_KEYS.TESTIMONIALS, testimonials);
    safeSetItem(STORAGE_KEYS.SETTINGS, settings);
    safeSetItem(STORAGE_KEYS.HERO, heroSlides);
  }, [products, categories, advertisements, blogs, media, enquiries, testimonials, settings, heroSlides]);

  // Synchronize browser tab icon (favicon) with active brand logo
  useEffect(() => {
    setBrowserFavicon(settings?.logoUrl);
  }, [settings?.logoUrl]);

  const notifyChange = useCallback(() => {
    try {
      syncChannel?.postMessage('sync_store');
    } catch {}
  }, []);

  // Reload data from localStorage (used when another tab broadcasts an update)
  const reloadFromStorage = useCallback(() => {
    setProducts(getStoredOr(STORAGE_KEYS.PRODUCTS, initialProducts));
    setCategories(getStoredOr(STORAGE_KEYS.CATEGORIES, initialCategories));
    setAdvertisements(getStoredOr(STORAGE_KEYS.ADS, initialAds));
    setBlogs(getStoredOr(STORAGE_KEYS.BLOGS, initialBlogs));
    setMedia(getStoredOr(STORAGE_KEYS.MEDIA, initialMedia));
    setEnquiries(getStoredOr(STORAGE_KEYS.ENQUIRIES, initialEnquiries));
    setTestimonials(getStoredOr(STORAGE_KEYS.TESTIMONIALS, initialTestimonials));
    setSettings(getStoredOr(STORAGE_KEYS.SETTINGS, initialSettings));
    setHeroSlides(getStoredOr(STORAGE_KEYS.HERO, initialHeroSlides));
  }, []);

  // INITIAL SUPABASE HYDRATION
  useEffect(() => {
    let isMounted = true;
    if (isSupabaseConfigured) {
      fetchAllSupabaseData().then((remoteData) => {
        if (!isMounted || !remoteData) return;
        setIsSupabaseReady(true);

        if (remoteData.settings) {
          setSettings((prev) => ({ ...prev, ...remoteData.settings }));
        }
        if (remoteData.categories && remoteData.categories.length > 0) {
          setCategories(remoteData.categories);
        }
        if (remoteData.products && remoteData.products.length > 0) {
          setProducts(remoteData.products);
        }
        if (remoteData.advertisements && remoteData.advertisements.length > 0) {
          setAdvertisements(remoteData.advertisements);
        }
        if (remoteData.blogs && remoteData.blogs.length > 0) {
          setBlogs(remoteData.blogs);
        }
        if (remoteData.testimonials && remoteData.testimonials.length > 0) {
          setTestimonials(remoteData.testimonials);
        }
        if (remoteData.enquiries) {
          setEnquiries(remoteData.enquiries);
        }
        if (remoteData.media) {
          setMedia(remoteData.media);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  // SUPABASE REALTIME SUBSCRIPTION
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel('public:realtime_store')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchAllSupabaseData().then((remoteData) => {
          if (!remoteData) return;
          if (remoteData.settings) setSettings(remoteData.settings);
          if (remoteData.categories) setCategories(remoteData.categories);
          if (remoteData.products) setProducts(remoteData.products);
          if (remoteData.advertisements) setAdvertisements(remoteData.advertisements);
          if (remoteData.blogs) setBlogs(remoteData.blogs);
          if (remoteData.testimonials) setTestimonials(remoteData.testimonials);
          if (remoteData.enquiries) setEnquiries(remoteData.enquiries);
          if (remoteData.media) setMedia(remoteData.media);
          notifyChange();
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [notifyChange]);

  // Listen for updates from other tabs (Admin -> Storefront or Storefront -> Admin)
  useEffect(() => {
    if (syncChannel) {
      const handleBroadcast = (e) => {
        if (e.data === 'sync_store') {
          reloadFromStorage();
        }
      };
      syncChannel.addEventListener('message', handleBroadcast);
      return () => syncChannel.removeEventListener('message', handleBroadcast);
    }
  }, [reloadFromStorage]);

  // Fallback native storage event listener
  useEffect(() => {
    const handleStorageEvent = (e) => {
      if (Object.values(STORAGE_KEYS).includes(e.key)) {
        reloadFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, [reloadFromStorage]);

  // ==========================================
  // PRODUCT ACTIONS
  // ==========================================
  const addProduct = useCallback(
    (productData) => {
      const slug =
        productData.slug ||
        productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      const newProduct = {
        ...productData,
        id: `p_${Date.now()}`,
        slug,
        price: Number(productData.price) || 0,
        discountPrice: productData.discountPrice ? Number(productData.discountPrice) : null,
        stock: Number(productData.stock) || 0,
        featured: Boolean(productData.featured),
        status: productData.status || 'published',
        image:
          productData.image ||
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        gallery: productData.gallery?.length ? productData.gallery : [productData.image],
        createdAt: new Date().toISOString(),
      };

      setProducts((prev) => [newProduct, ...prev]);
      syncProductToDb(newProduct);
      notifyChange();
      addToast({ message: `Product "${newProduct.name}" added successfully!`, type: 'success' });
      return newProduct;
    },
    [addToast, notifyChange]
  );

  const updateProduct = useCallback(
    (id, updates) => {
      let updatedProduct = null;
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id && p.slug !== id) return p;
          const price = updates.price !== undefined ? Number(updates.price) : p.price;
          const discountPrice =
            updates.discountPrice !== undefined
              ? updates.discountPrice
                ? Number(updates.discountPrice)
                : null
              : p.discountPrice;
          updatedProduct = { ...p, ...updates, price, discountPrice };
          return updatedProduct;
        })
      );
      if (updatedProduct) {
        syncProductToDb(updatedProduct);
      }
      notifyChange();
      addToast({ message: 'Product updated successfully!', type: 'success' });
    },
    [addToast, notifyChange]
  );

  const deleteProduct = useCallback(
    (id) => {
      setProducts((prev) => prev.filter((p) => p.id !== id && p.slug !== id));
      deleteProductFromDb(id);
      notifyChange();
      addToast({ message: 'Product deleted from store', type: 'info' });
    },
    [addToast, notifyChange]
  );

  // ==========================================
  // CATEGORY ACTIONS
  // ==========================================
  const addCategory = useCallback(
    (categoryData) => {
      const slug =
        categoryData.slug ||
        categoryData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      const newCategory = {
        ...categoryData,
        id: `c_${Date.now()}`,
        slug,
        isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
        displayOrder: Number(categoryData.displayOrder) || 1,
        image:
          categoryData.image ||
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
      };

      setCategories((prev) => [...prev, newCategory]);
      syncCategoryToDb(newCategory);
      notifyChange();
      addToast({ message: `Category "${newCategory.name}" created!`, type: 'success' });
      return newCategory;
    },
    [addToast, notifyChange]
  );

  const updateCategory = useCallback(
    (id, updates) => {
      let updatedCategory = null;
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id !== id && c.slug !== id) return c;
          updatedCategory = { ...c, ...updates };
          return updatedCategory;
        })
      );
      if (updatedCategory) {
        syncCategoryToDb(updatedCategory);
      }
      notifyChange();
      addToast({ message: 'Category updated successfully!', type: 'success' });
    },
    [addToast, notifyChange]
  );

  const deleteCategory = useCallback(
    (id) => {
      setCategories((prev) => prev.filter((c) => c.id !== id && c.slug !== id));
      deleteCategoryFromDb(id);
      notifyChange();
      addToast({ message: 'Category removed', type: 'info' });
    },
    [addToast, notifyChange]
  );

  // ==========================================
  // ADVERTISEMENT ACTIONS
  // ==========================================
  const addAd = useCallback(
    (adData) => {
      const newAd = {
        ...adData,
        id: `a_${Date.now()}`,
        isActive: adData.isActive !== undefined ? adData.isActive : true,
        clicks: 0,
        placement: adData.placement || 'hero_bottom',
        desktopImage:
          adData.desktopImage ||
          'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=1600&q=80',
        mobileImage:
          adData.mobileImage ||
          adData.desktopImage ||
          'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=800&q=80',
      };

      setAdvertisements((prev) => [newAd, ...prev]);
      syncAdToDb(newAd);
      notifyChange();
      addToast({ message: `Advertisement "${newAd.title}" published!`, type: 'success' });
      return newAd;
    },
    [addToast, notifyChange]
  );

  const updateAd = useCallback(
    (id, updates) => {
      let updatedAd = null;
      setAdvertisements((prev) =>
        prev.map((a) => {
          if (a.id !== id) return a;
          updatedAd = { ...a, ...updates };
          return updatedAd;
        })
      );
      if (updatedAd) {
        syncAdToDb(updatedAd);
      }
      notifyChange();
      addToast({ message: 'Advertisement updated!', type: 'success' });
    },
    [addToast, notifyChange]
  );

  const deleteAd = useCallback(
    (id) => {
      setAdvertisements((prev) => prev.filter((a) => a.id !== id));
      deleteAdFromDb(id);
      notifyChange();
      addToast({ message: 'Advertisement deleted', type: 'info' });
    },
    [addToast, notifyChange]
  );

  const toggleAdStatus = useCallback(
    (id) => {
      let updatedAd = null;
      setAdvertisements((prev) =>
        prev.map((a) => {
          if (a.id !== id) return a;
          updatedAd = { ...a, isActive: !a.isActive };
          return updatedAd;
        })
      );
      if (updatedAd) {
        syncAdToDb(updatedAd);
      }
      notifyChange();
      addToast({ message: 'Advertisement status updated', type: 'info' });
    },
    [addToast, notifyChange]
  );

  // ==========================================
  // BLOG ACTIONS
  // ==========================================
  const addBlog = useCallback(
    (blogData) => {
      const slug =
        blogData.slug ||
        blogData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      const newBlog = {
        ...blogData,
        id: `b_${Date.now()}`,
        slug,
        date: blogData.date || new Date().toISOString().split('T')[0],
        status: blogData.status || 'published',
        image:
          blogData.image ||
          blogData.featuredImage ||
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
        readTime: blogData.readTime || '4 min read',
      };

      setBlogs((prev) => [newBlog, ...prev]);
      syncBlogToDb(newBlog);
      notifyChange();
      addToast({ message: `Article "${newBlog.title}" published!`, type: 'success' });
      return newBlog;
    },
    [addToast, notifyChange]
  );

  const updateBlog = useCallback(
    (id, updates) => {
      let updatedBlog = null;
      setBlogs((prev) =>
        prev.map((b) => {
          if (b.id !== id && b.slug !== id) return b;
          updatedBlog = { ...b, ...updates };
          return updatedBlog;
        })
      );
      if (updatedBlog) {
        syncBlogToDb(updatedBlog);
      }
      notifyChange();
      addToast({ message: 'Blog article updated!', type: 'success' });
    },
    [addToast, notifyChange]
  );

  const deleteBlog = useCallback(
    (id) => {
      setBlogs((prev) => prev.filter((b) => b.id !== id && b.slug !== id));
      deleteBlogFromDb(id);
      notifyChange();
      addToast({ message: 'Blog article deleted', type: 'info' });
    },
    [addToast, notifyChange]
  );

  // ==========================================
  // MEDIA ACTIONS
  // ==========================================
  const addMedia = useCallback(
    (item) => {
      const newItem = {
        ...item,
        id: `m_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        type: item.type || 'image/jpeg',
        size: item.size || '1.5 MB',
        dimensions: item.dimensions || '1920x1080',
      };
      setMedia((prev) => [newItem, ...prev]);
      if (isSupabaseConfigured && supabase) {
        supabase.from('media').upsert(newItem).catch(console.warn);
      }
      notifyChange();
      addToast({ message: `Image "${newItem.name}" added to Media Library!`, type: 'success' });
      return newItem;
    },
    [addToast, notifyChange]
  );

  const deleteMedia = useCallback(
    (id) => {
      setMedia((prev) => prev.filter((m) => m.id !== id));
      if (isSupabaseConfigured && supabase) {
        supabase.from('media').delete().eq('id', id).catch(console.warn);
      }
      notifyChange();
      addToast({ message: 'Image deleted from Media Library', type: 'info' });
    },
    [addToast, notifyChange]
  );

  // ==========================================
  // ENQUIRY ACTIONS
  // ==========================================
  const addEnquiry = useCallback(
    (enquiryData) => {
      const newEnquiry = {
        ...enquiryData,
        id: `e_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      setEnquiries((prev) => [newEnquiry, ...prev]);
      syncEnquiryToDb(newEnquiry);
      notifyChange();
      addToast({
        message: 'Enquiry sent successfully! Our representative will contact you.',
        type: 'success',
      });
      return newEnquiry;
    },
    [addToast, notifyChange]
  );

  const updateEnquiryStatus = useCallback(
    (id, status, notes) => {
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
      updateEnquiryStatusInDb(id, status);
      notifyChange();
      addToast({ message: `Enquiry status updated to ${status}`, type: 'success' });
    },
    [addToast, notifyChange]
  );

  const deleteEnquiry = useCallback(
    (id) => {
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      deleteEnquiryFromDb(id);
      notifyChange();
      addToast({ message: 'Enquiry removed', type: 'info' });
    },
    [addToast, notifyChange]
  );

  // ==========================================
  // TESTIMONIAL ACTIONS
  // ==========================================
  const addTestimonial = useCallback(
    (data) => {
      const newTestimonial = {
        ...data,
        id: `t_${Date.now()}`,
        rating: Number(data.rating) || 5,
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
        createdAt: new Date().toISOString().split('T')[0],
        photo:
          data.photo ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      };
      setTestimonials((prev) => [newTestimonial, ...prev]);
      syncTestimonialToDb(newTestimonial);
      notifyChange();
      addToast({ message: 'Testimonial added!', type: 'success' });
      return newTestimonial;
    },
    [addToast, notifyChange]
  );

  const updateTestimonial = useCallback(
    (id, updates) => {
      let updatedTestimonial = null;
      setTestimonials((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          updatedTestimonial = { ...t, ...updates };
          return updatedTestimonial;
        })
      );
      if (updatedTestimonial) {
        syncTestimonialToDb(updatedTestimonial);
      }
      notifyChange();
      addToast({ message: 'Testimonial updated!', type: 'success' });
    },
    [addToast, notifyChange]
  );

  const deleteTestimonial = useCallback(
    (id) => {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      deleteTestimonialFromDb(id);
      notifyChange();
      addToast({ message: 'Testimonial deleted', type: 'info' });
    },
    [addToast, notifyChange]
  );

  const toggleTestimonialPublish = useCallback(
    (id) => {
      let updatedTestimonial = null;
      setTestimonials((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          updatedTestimonial = { ...t, isPublished: !t.isPublished };
          return updatedTestimonial;
        })
      );
      if (updatedTestimonial) {
        syncTestimonialToDb(updatedTestimonial);
      }
      notifyChange();
      addToast({ message: 'Testimonial status toggled', type: 'info' });
    },
    [addToast, notifyChange]
  );

  // ==========================================
  // WEBSITE SETTINGS ACTION
  // ==========================================
  const updateSettings = useCallback(
    (newSettings) => {
      const merged = { ...settings, ...newSettings };
      setSettings(merged);
      syncSettingsToDb(merged);
      notifyChange();
      addToast({ message: 'Website settings saved!', type: 'success' });
    },
    [settings, addToast, notifyChange]
  );

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
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    notifyChange();
    addToast({ message: 'All demo data has been reset to defaults', type: 'info' });
  }, [addToast, notifyChange]);

  // GETTERS & DERIVED DATA
  const activeAds = useMemo(() => advertisements.filter((a) => a.isActive !== false), [advertisements]);
  const featuredProducts = useMemo(
    () => products.filter((p) => p.featured && p.status === 'published'),
    [products]
  );
  const publishedBlogs = useMemo(() => blogs.filter((b) => b.status === 'published'), [blogs]);
  const publishedTestimonials = useMemo(
    () => testimonials.filter((t) => t.isPublished !== false),
    [testimonials]
  );

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
        isSupabaseReady,

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
        reloadFromStorage,
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
