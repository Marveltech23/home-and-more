import { supabase, isSupabaseConfigured } from './supabase.js';
import {
  mapCategoryFromDb,
  mapCategoryToDb,
  mapProductFromDb,
  mapProductToDb,
  mapAdFromDb,
  mapAdToDb,
  mapBlogFromDb,
  mapBlogToDb,
  mapTestimonialFromDb,
  mapTestimonialToDb,
  mapEnquiryFromDb,
  mapEnquiryToDb,
  mapSettingsFromDb,
  mapSettingsToDb,
  mapMediaFromDb,
  mapMediaToDb,
} from './supabaseMappers.js';

/**
 * Loads all primary storefront and admin records from Supabase in parallel.
 * Returns null if Supabase is not configured or if an error occurs.
 */
export async function fetchAllSupabaseData() {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    // Only fetch customer enquiries when an authenticated admin session is active
    const { data: sessionData } = await supabase.auth.getSession();
    const isAdminSession = Boolean(sessionData?.session?.user);

    const [
      settingsRes,
      categoriesRes,
      productsRes,
      adsRes,
      blogsRes,
      testimonialsRes,
      enquiriesRes,
      mediaRes,
    ] = await Promise.all([
      supabase.from('site_settings').select('*').limit(1),
      supabase.from('categories').select('*').order('display_order', { ascending: true }),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('advertisements').select('*').order('created_at', { ascending: false }),
      supabase.from('blogs').select('*').order('published_at', { ascending: false }),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
      isAdminSession
        ? supabase.from('enquiries').select('*').order('created_at', { ascending: false })
        : Promise.resolve({ data: null }),
      supabase.from('media').select('*').order('created_at', { ascending: false }),
    ]);

    const result = {};

    if (settingsRes.data && settingsRes.data[0]) {
      result.settings = mapSettingsFromDb(settingsRes.data[0]);
    }

    if (categoriesRes.data && categoriesRes.data.length > 0) {
      result.categories = categoriesRes.data.map(mapCategoryFromDb);
    }

    if (productsRes.data && productsRes.data.length > 0) {
      result.products = productsRes.data.map(mapProductFromDb);
    }

    if (adsRes.data && adsRes.data.length > 0) {
      result.advertisements = adsRes.data.map(mapAdFromDb);
    }

    if (blogsRes.data && blogsRes.data.length > 0) {
      result.blogs = blogsRes.data.map(mapBlogFromDb);
    }

    if (testimonialsRes.data && testimonialsRes.data.length > 0) {
      result.testimonials = testimonialsRes.data.map(mapTestimonialFromDb);
    }

    if (enquiriesRes.data) {
      result.enquiries = enquiriesRes.data.map(mapEnquiryFromDb);
    }

    if (mediaRes.data) {
      result.media = mediaRes.data.map(mapMediaFromDb);
    }

    return result;
  } catch (err) {
    console.warn('Error fetching all data from Supabase:', err);
    return null;
  }
}

// ==========================================
// CATEGORY DB OPERATIONS
// ==========================================
export async function syncCategoryToDb(category) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapCategoryToDb(category);
    await supabase.from('categories').upsert(payload, { onConflict: 'slug' });
  } catch (e) {
    console.warn('Supabase category upsert error:', e);
  }
}

export async function deleteCategoryFromDb(idOrSlug) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('categories').delete().or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
  } catch (e) {
    console.warn('Supabase category delete error:', e);
  }
}

// ==========================================
// PRODUCT DB OPERATIONS
// ==========================================
export async function syncProductToDb(product) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapProductToDb(product);
    await supabase.from('products').upsert(payload, { onConflict: 'slug' });
  } catch (e) {
    console.warn('Supabase product upsert error:', e);
  }
}

export async function deleteProductFromDb(idOrSlug) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('products').delete().or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
  } catch (e) {
    console.warn('Supabase product delete error:', e);
  }
}

// ==========================================
// ADVERTISEMENT DB OPERATIONS
// ==========================================
export async function syncAdToDb(ad) {
  if (!isSupabaseConfigured || !supabase) return { ok: true, error: null };
  try {
    const payload = mapAdToDb(ad);
    const { error } = await supabase
      .from('advertisements')
      .upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('Supabase ad upsert error:', error);
      return { ok: false, error: error.message || 'Database save failed' };
    }
    return { ok: true, error: null };
  } catch (e) {
    console.error('Supabase ad upsert exception:', e);
    return { ok: false, error: e?.message || 'Network error while saving' };
  }
}

export async function deleteAdFromDb(id) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('advertisements').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase ad delete error:', e);
  }
}

// ==========================================
// BLOG DB OPERATIONS
// ==========================================
export async function syncBlogToDb(blog) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapBlogToDb(blog);
    await supabase.from('blogs').upsert(payload, { onConflict: 'slug' });
  } catch (e) {
    console.warn('Supabase blog upsert error:', e);
  }
}

export async function deleteBlogFromDb(idOrSlug) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('blogs').delete().or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
  } catch (e) {
    console.warn('Supabase blog delete error:', e);
  }
}

// ==========================================
// TESTIMONIAL DB OPERATIONS
// ==========================================
export async function syncTestimonialToDb(testimonial) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapTestimonialToDb(testimonial);
    await supabase.from('testimonials').upsert(payload, { onConflict: 'id' });
  } catch (e) {
    console.warn('Supabase testimonial upsert error:', e);
  }
}

export async function deleteTestimonialFromDb(id) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('testimonials').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase testimonial delete error:', e);
  }
}

// ==========================================
// ENQUIRY DB OPERATIONS
// ==========================================
export async function syncEnquiryToDb(enquiry) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapEnquiryToDb(enquiry);
    await supabase.from('enquiries').upsert(payload, { onConflict: 'id' });
  } catch (e) {
    console.warn('Supabase enquiry upsert error:', e);
  }
}

export async function updateEnquiryStatusInDb(id, status) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('enquiries').update({ status }).eq('id', id);
  } catch (e) {
    console.warn('Supabase enquiry status update error:', e);
  }
}

export async function deleteEnquiryFromDb(id) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('enquiries').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase enquiry delete error:', e);
  }
}

// ==========================================
// WEBSITE SETTINGS DB OPERATIONS
// ==========================================
export async function syncSettingsToDb(settings) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapSettingsToDb(settings);
    await supabase.from('site_settings').upsert(payload, { onConflict: 'id' });
  } catch (e) {
    console.warn('Supabase settings upsert error:', e);
  }
}

// ==========================================
// MEDIA DB OPERATIONS
// ==========================================
export async function syncMediaToDb(mediaItem) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapMediaToDb(mediaItem);
    await supabase.from('media').upsert(payload, { onConflict: 'id' });
  } catch (e) {
    console.warn('Supabase media upsert error:', e);
  }
}

export async function deleteMediaFromDb(id) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('media').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase media delete error:', e);
  }
}
