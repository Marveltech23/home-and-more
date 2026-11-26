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
import { warmLocalImageCache } from '../utils/imageCache';
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
  syncMediaToDb,
  deleteMediaFromDb,
} from '../lib/supabaseService';
import {
  mapCategoryFromDb,
  mapProductFromDb,
  mapAdFromDb,
  mapBlogFromDb,
  mapTestimonialFromDb,
  mapEnquiryFromDb,
  mapSettingsFromDb,
  mapMediaFromDb,
} from '../lib/supabaseMappers';

const StoreContext = createContext(null);

// Shared localStorage keys
const STORAGE_KEYS = {
  PRODUCTS: 'hm_store_products_v6',
  CATEGORIES: 'hm_store_categories_v6',
  ADS: 'hm_store_ads_v6',
  BLOGS: 'hm_store_blogs_v6',
  MEDIA: 'hm_store_media_v6',
  ENQUIRIES: 'hm_store_enquiries_v6',
  TESTIMONIALS: 'hm_store_testimonials_v6',
  SETTINGS: 'hm_store_settings_v6',
  HERO: 'hm_store_hero_v7',
};

// Evict stale localStorage caches from previous versions
if (typeof window !== 'undefined') {
  try {
    [
      'hm_store_hero_v6',
      'hm_store_products_v5',
      'hm_store_categories_v5',
      'hm_store_ads_v5',
      'hm_store_blogs_v5',
      'hm_store_media_v5',
      'hm_store_testimonials_v5',
      'hm_store_hero_v5',
      'hm_store_settings_v5',
      'hm_store_settings_v4',
      'hm_store_settings_v3',
      'hm_store_categories_v4',
      'hm_store_products_v4',
      'hm_store_media_v4',
      'hm_store_categories_v3',
      'hm_store_products_v3',
      'hm_store_media_v3',
      'hm_store_categories_v2',
      'hm_store_categories_v1',
    ].forEach((k) => localStorage.removeItem(k));
  } catch {}
}

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

  // Save all active storefront images into local browser Cache Storage in the background
  useEffect(() => {
    const urls = [
      ...categories.map((c) => c.image),
      ...products.flatMap((p) => [p.image, ...(Array.isArray(p.gallery) ? p.gallery : [])]),
      ...advertisements.flatMap((a) => [a.desktopImage, a.mobileImage]),
      ...blogs.flatMap((b) => [b.image, b.featuredImage]),
      ...testimonials.map((t) => t.avatar),
      ...heroSlides.map((h) => h.image),
    ];
    warmLocalImageCache(urls);
  }, [categories, products, advertisements, blogs, testimonials, heroSlides]);

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
          const sorted = [...remoteData.categories].sort(
            (a, b) => (Number(a.displayOrder) || 99) - (Number(b.displayOrder) || 99)
          );
          setCategories(sorted);
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

  // Load customer enquiries only after an authenticated admin signs in
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .then(({ data }) => {
            if (data) {
              const mapped = data.map(mapEnquiryFromDb);
              setEnquiries(mapped);
              safeSetItem(STORAGE_KEYS.ENQUIRIES, mapped);
            }
          });
      } else if (event === 'SIGNED_OUT') {
        setEnquiries([]);
        try {
          localStorage.removeItem(STORAGE_KEYS.ENQUIRIES);
        } catch {}
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  // SUPABASE REALTIME SUBSCRIPTION
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel('public:realtime_store')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        const table = payload.table;

        if (table === 'categories') {
          supabase
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true })
            .then(({ data }) => {
              if (data && data.length > 0) {
                const mapped = data.map(mapCategoryFromDb);
                const sorted = mapped.sort(
                  (a, b) => (Number(a.displayOrder) || 99) - (Number(b.displayOrder) || 99)
                );
                setCategories(sorted);
                safeSetItem(STORAGE_KEYS.CATEGORIES, sorted);
              }
            });
        } else if (table === 'media') {
          supabase
            .from('media')
            .select('*')
            .order('created_at', { ascending: false })
            .then(({ data }) => {
              if (data) {
                const mapped = data.map(mapMediaFromDb);
                setMedia(mapped);
                safeSetItem(STORAGE_KEYS.MEDIA, mapped);
              }
            });
        } else if (table === 'products') {
          supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .then(({ data }) => {
              if (data && data.length > 0) {
                const mapped = data.map(mapProductFromDb);
                setProducts((prev) => {
                  const ids = new Set(mapped.map((p) => p.id));
                  const slugs = new Set(mapped.map((p) => p.slug));
                  const pendingLocal = prev.filter((p) => !ids.has(p.id) && !slugs.has(p.slug));
                  const combined = [...pendingLocal, ...mapped];
                  safeSetItem(STORAGE_KEYS.PRODUCTS, combined);
                  return combined;
                });
              }
            });
        } else if (table === 'advertisements') {
          supabase
            .from('advertisements')
            .select('*')
            .order('created_at', { ascending: false })
            .then(({ data }) => {
              if (data && data.length > 0) {
                const mapped = data.map(mapAdFromDb);
                setAdvertisements((prev) => {
                  const ids = new Set(mapped.map((a) => a.id));
                  const pendingLocal = prev.filter((a) => !ids.has(a.id));
                  const combined = [...pendingLocal, ...mapped];
                  safeSetItem(STORAGE_KEYS.ADS, combined);
                  return combined;
                });
              }
            });
        } else if (table === 'blogs') {
          supabase
            .from('blogs')
            .select('*')
            .order('published_at', { ascending: false })
            .then(({ data }) => {
              if (data && data.length > 0) {
                const mapped = data.map(mapBlogFromDb);
                setBlogs((prev) => {
                  const ids = new Set(mapped.map((b) => b.id));
                  const slugs = new Set(mapped.map((b) => b.slug));
                  const pendingLocal = prev.filter((b) => !ids.has(b.id) && !slugs.has(b.slug));
                  const combined = [...pendingLocal, ...mapped];
                  safeSetItem(STORAGE_KEYS.BLOGS, combined);
                  return combined;
                });
              }
            });
        } else if (table === 'site_settings') {
          supabase
            .from('site_settings')
            .select('*')
            .limit(1)
            .then(({ data }) => {
              if (data && data[0]) {
                const mapped = mapSettingsFromDb(data[0]);
                setSettings(mapped);
                safeSetItem(STORAGE_KEYS.SETTINGS, mapped);
              }
            });
        } else if (table === 'testimonials') {
          supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false })
            .then(({ data }) => {
              if (data && data.length > 0) {
                const mapped = data.map(mapTestimonialFromDb);
                setTestimonials(mapped);
                safeSetItem(STORAGE_KEYS.TESTIMONIALS, mapped);
              }
            });
        } else if (table === 'enquiries') {
          supabase
            .from('enquiries')
            .select('*')
            .order('created_at', { ascending: false })
            .then(({ data }) => {
              if (data) {
                const mapped = data.map(mapEnquiryFromDb);
                setEnquiries(mapped);
                safeSetItem(STORAGE_KEYS.ENQUIRIES, mapped);
              }
            });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
          '/images/stock/photo-1555041469-a586c61ea9bc.jpg',
        gallery: productData.gallery?.length ? productData.gallery : [productData.image],
        createdAt: new Date().toISOString(),
      };

      setProducts((prev) => {
        const next = [newProduct, ...prev.filter((p) => p.id !== newProduct.id && p.slug !== newProduct.slug)];
        safeSetItem(STORAGE_KEYS.PRODUCTS, next);
        return next;
      });
      syncProductToDb(newProduct);
      notifyChange();
      addToast({ message: `Product "${newProduct.name}" added successfully!`, type: 'success' });
      return newProduct;
    },
    [addToast, notifyChange]
  );

  const updateProduct = useCallback(
    (id, updates) => {
      setProducts((prev) => {
        let updatedProduct = null;
        const next = prev.map((p) => {
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
        });
        safeSetItem(STORAGE_KEYS.PRODUCTS, next);
        if (updatedProduct) {
          syncProductToDb(updatedProduct);
        }
        return next;
      });
      notifyChange();
      addToast({ message: 'Product updated successfully!', type: 'success' });
    },
    [addToast, notifyChange]
  );

  const deleteProduct = useCallback(
    (id) => {
      setProducts((prev) => {
        const next = prev.filter((p) => p.id !== id && p.slug !== id);
        safeSetItem(STORAGE_KEYS.PRODUCTS, next);
        return next;
      });
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
          '/images/stock/photo-1555041469-a586c61ea9bc.jpg',
      };

      setCategories((prev) => {
        const next = [newCategory, ...prev.filter((c) => c.id !== newCategory.id && c.slug !== newCategory.slug)];
        safeSetItem(STORAGE_KEYS.CATEGORIES, next);
        return next;
      });
      syncCategoryToDb(newCategory);
      notifyChange();
      addToast({ message: `Category "${newCategory.name}" created!`, type: 'success' });
      return newCategory;
    },
    [addToast, notifyChange]
  );

  const updateCategory = useCallback(
    (id, updates) => {
      setCategories((prev) => {
        let updatedCategory = null;
        const next = prev.map((c) => {
          if (c.id !== id && c.slug !== id) return c;
          updatedCategory = { ...c, ...updates };
          return updatedCategory;
        });
        safeSetItem(STORAGE_KEYS.CATEGORIES, next);
        if (updatedCategory) {
          syncCategoryToDb(updatedCategory);
        }
        return next;
      });
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
    async (adData) => {
      const desktop =
        adData.desktopImage !== undefined
          ? adData.desktopImage
          : adData.image || '';
      const mobile =
        adData.mobileImage !== undefined ? adData.mobileImage : desktop;
      const nowIso = new Date().toISOString();

      const newAd = {
        ...adData,
        id: adData.id || `a_${Date.now()}`,
        isActive: adData.isActive !== undefined ? adData.isActive : true,
        status: adData.status || 'published',
        clicks: 0,
        placement: adData.slotPosition || adData.placement || 'slot_1',
        slotPosition: adData.slotPosition || adData.placement || 'slot_1',
        desktopImage: desktop,
        mobileImage: mobile,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      setAdvertisements((prev) => {
        const next = [newAd, ...prev.filter((a) => a.id !== newAd.id)];
        safeSetItem(STORAGE_KEYS.ADS, next);
        return next;
      });
      const dbRes = await syncAdToDb(newAd);
      notifyChange();
      if (dbRes && !dbRes.ok) {
        addToast({
          message: `Saved locally, but database sync failed: ${dbRes.error}`,
          type: 'error',
        });
        return { ok: false, error: dbRes.error, ad: newAd };
      }
      addToast({
        message:
          newAd.status === 'draft'
            ? `Advertisement "${newAd.name || newAd.title}" saved as draft.`
            : `Advertisement "${newAd.name || newAd.title}" published!`,
        type: 'success',
      });
      return { ok: true, error: null, ad: newAd };
    },
    [addToast, notifyChange]
  );

  const updateAd = useCallback(
    async (id, updates) => {
      const nowIso = new Date().toISOString();
      const existing = advertisements.find((a) => a.id === id) || { id };
      const desktop =
        updates.desktopImage !== undefined
          ? updates.desktopImage
          : updates.image !== undefined
          ? updates.image
          : existing.desktopImage || '';
      const mobile =
        updates.mobileImage !== undefined ? updates.mobileImage : existing.mobileImage || '';

      const updatedAd = {
        ...existing,
        ...updates,
        id,
        desktopImage: desktop,
        mobileImage: mobile,
        updatedAt: nowIso,
      };

      setAdvertisements((prev) => {
        const exists = prev.some((a) => a.id === id);
        const next = exists
          ? prev.map((a) => (a.id === id ? updatedAd : a))
          : [updatedAd, ...prev];
        safeSetItem(STORAGE_KEYS.ADS, next);
        return next;
      });

      const dbRes = await syncAdToDb(updatedAd);
      notifyChange();
      if (dbRes && !dbRes.ok) {
        addToast({
          message: `Database sync failed: ${dbRes.error}`,
          type: 'error',
        });
        return { ok: false, error: dbRes.error, ad: updatedAd };
      }
      addToast({
        message:
          updates.status === 'draft'
            ? 'Advertisement saved as draft.'
            : 'Advertisement published & live!',
        type: 'success',
      });
      return { ok: true, error: null, ad: updatedAd };
    },
    [advertisements, addToast, notifyChange]
  );

  const deleteAd = useCallback(
    (id) => {
      setAdvertisements((prev) => {
        const next = prev.filter((a) => a.id !== id);
        safeSetItem(STORAGE_KEYS.ADS, next);
        return next;
      });
      deleteAdFromDb(id);
      notifyChange();
      addToast({ message: 'Advertisement deleted', type: 'info' });
    },
    [addToast, notifyChange]
  );

  const toggleAdStatus = useCallback(
    async (id) => {
      const existing = advertisements.find((a) => a.id === id);
      if (!existing) return;
      const updatedAd = {
        ...existing,
        isActive: !existing.isActive,
        updatedAt: new Date().toISOString(),
      };
      setAdvertisements((prev) => {
        const next = prev.map((a) => (a.id === id ? updatedAd : a));
        safeSetItem(STORAGE_KEYS.ADS, next);
        return next;
      });
      const dbRes = await syncAdToDb(updatedAd);
      notifyChange();
      if (dbRes && !dbRes.ok) {
        addToast({ message: `Database sync failed: ${dbRes.error}`, type: 'error' });
        return;
      }
      addToast({ message: 'Advertisement status updated', type: 'info' });
    },
    [advertisements, addToast, notifyChange]
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

      const img =
        blogData.featuredImage ||
        blogData.image ||
        '/images/stock/photo-1600585154340-be6161a56a0c.jpg';
      const dt = blogData.publishedAt || blogData.date || new Date().toISOString().split('T')[0];

      const newBlog = {
        ...blogData,
        id: blogData.id || `b_${Date.now()}`,
        slug,
        title: blogData.title || '',
        author: blogData.author || 'Home & More Styling Team',
        category: blogData.category || 'Interior Design',
        excerpt: blogData.excerpt || '',
        content: blogData.content || '',
        image: img,
        featuredImage: img,
        date: dt,
        publishedAt: dt,
        status: blogData.status || 'published',
        readTime: blogData.readTime || '4 min read',
      };

      setBlogs((prev) => {
        const next = [newBlog, ...prev.filter((b) => b.id !== newBlog.id && b.slug !== newBlog.slug)];
        safeSetItem(STORAGE_KEYS.BLOGS, next);
        return next;
      });
      syncBlogToDb(newBlog);
      notifyChange();
      addToast({ message: `Article "${newBlog.title}" published!`, type: 'success' });
      return newBlog;
    },
    [addToast, notifyChange]
  );

  const updateBlog = useCallback(
    (id, updates) => {
      setBlogs((prev) => {
        let updatedBlog = null;
        const next = prev.map((b) => {
          if (b.id !== id && b.slug !== id) return b;
          const img = updates.featuredImage || updates.image || b.featuredImage || b.image;
          const dt = updates.publishedAt || updates.date || b.publishedAt || b.date;
          updatedBlog = {
            ...b,
            ...updates,
            image: img,
            featuredImage: img,
            date: dt,
            publishedAt: dt,
          };
          return updatedBlog;
        });
        safeSetItem(STORAGE_KEYS.BLOGS, next);
        if (updatedBlog) {
          syncBlogToDb(updatedBlog);
        }
        return next;
      });
      notifyChange();
      addToast({ message: 'Blog article updated!', type: 'success' });
    },
    [addToast, notifyChange]
  );

  const deleteBlog = useCallback(
    (id) => {
      setBlogs((prev) => {
        const next = prev.filter((b) => b.id !== id && b.slug !== id);
        safeSetItem(STORAGE_KEYS.BLOGS, next);
        return next;
      });
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
        id: item.id || `m_${Date.now()}`,
        type: item.type || 'image/jpeg',
        size: item.size || '1.5 MB',
        dimensions: item.dimensions || '1920x1080',
        createdAt: new Date().toISOString(),
      };
      setMedia((prev) => {
        const next = [newItem, ...prev.filter((m) => m.id !== newItem.id)];
        safeSetItem(STORAGE_KEYS.MEDIA, next);
        return next;
      });
      syncMediaToDb(newItem);
      notifyChange();
      addToast({ message: `Image "${newItem.name}" added to Media Library!`, type: 'success' });
      return newItem;
    },
    [addToast, notifyChange]
  );

  const deleteMedia = useCallback(
    (id) => {
      setMedia((prev) => {
        const next = prev.filter((m) => m.id !== id);
        safeSetItem(STORAGE_KEYS.MEDIA, next);
        return next;
      });
      deleteMediaFromDb(id);
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
          '/images/stock/photo-1534528741775-53994a69daeb.jpg',
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
      setTestimonials((prev) => {
        let updatedTestimonial = null;
        const next = prev.map((t) => {
          if (t.id !== id) return t;
          updatedTestimonial = { ...t, ...updates };
          return updatedTestimonial;
        });
        if (updatedTestimonial) {
          syncTestimonialToDb(updatedTestimonial);
        }
        return next;
      });
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
      setTestimonials((prev) => {
        let updatedTestimonial = null;
        const next = prev.map((t) => {
          if (t.id !== id) return t;
          updatedTestimonial = { ...t, isPublished: !t.isPublished };
          return updatedTestimonial;
        });
        if (updatedTestimonial) {
          syncTestimonialToDb(updatedTestimonial);
        }
        return next;
      });
      notifyChange();
      addToast({ message: 'Testimonial status toggled', type: 'info' });
    },
    [addToast, notifyChange]
  );

  // ==========================================
  // WEBSITE SETTINGS & PRICE VISIBILITY ACTIONS
  // ==========================================
  const updateSettings = useCallback(
    (newSettings, { silent = false } = {}) => {
      setSettings((prev) => {
        const merged = { ...prev, ...newSettings };
        safeSetItem(STORAGE_KEYS.SETTINGS, merged);
        syncSettingsToDb(merged);
        return merged;
      });
      notifyChange();
      if (!silent) {
        addToast({ message: 'Website settings saved!', type: 'success' });
      }
    },
    [addToast, notifyChange]
  );

  const toggleGlobalPrices = useCallback(() => {
    let nextVisible = true;
    setSettings((prev) => {
      nextVisible = prev.showPrices === false;
      const merged = { ...prev, showPrices: nextVisible };
      safeSetItem(STORAGE_KEYS.SETTINGS, merged);
      syncSettingsToDb(merged);
      return merged;
    });
    notifyChange();
    addToast({
      message: nextVisible
        ? 'Storefront prices are now VISIBLE'
        : 'Storefront prices are now HIDDEN (WhatsApp direct mode)',
      type: 'success',
    });
  }, [addToast, notifyChange]);

  const setProductPriceVisibility = useCallback(
    (productId, isVisible, { silent = false } = {}) => {
      if (!productId) return;
      setSettings((prev) => {
        const currentHidden = Array.isArray(prev.hiddenPriceProductIds)
          ? prev.hiddenPriceProductIds
          : [];
        const nextHidden = isVisible
          ? currentHidden.filter((id) => id !== productId)
          : Array.from(new Set([...currentHidden, productId]));
        const merged = { ...prev, hiddenPriceProductIds: nextHidden };
        safeSetItem(STORAGE_KEYS.SETTINGS, merged);
        syncSettingsToDb(merged);
        return merged;
      });
      notifyChange();
      if (!silent) {
        addToast({
          message: isVisible
            ? 'Product price set to VISIBLE on storefront'
            : 'Product price set to HIDDEN (WhatsApp direct)',
          type: 'info',
        });
      }
    },
    [addToast, notifyChange]
  );

  const toggleProductPriceVisibility = useCallback(
    (productId) => {
      if (!productId) return;
      const currentHidden = Array.isArray(settings.hiddenPriceProductIds)
        ? settings.hiddenPriceProductIds
        : [];
      const currentlyHidden = currentHidden.includes(productId);
      setProductPriceVisibility(productId, currentlyHidden);
    },
    [settings.hiddenPriceProductIds, setProductPriceVisibility]
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

        // Settings & Price Visibility
        updateSettings,
        toggleGlobalPrices,
        setProductPriceVisibility,
        toggleProductPriceVisibility,
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
