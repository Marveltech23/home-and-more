/**
 * Supabase Data Mappers
 * Converts between Supabase PostgreSQL schema (snake_case)
 * and Frontend application models (camelCase).
 */

// ==========================================
// 1. CATEGORIES MAPPER
// ==========================================
export function mapCategoryFromDb(c) {
  if (!c) return null;
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description || '',
    image: c.image,
    displayOrder: c.display_order ?? 1,
    isActive: c.is_active ?? true,
    itemCount: c.item_count || 0,
  };
}

export function mapCategoryToDb(c) {
  if (!c) return {};
  const out = {};
  if (c.id !== undefined) out.id = c.id;
  if (c.slug !== undefined) out.slug = c.slug;
  if (c.name !== undefined) out.name = c.name;
  if (c.description !== undefined) out.description = c.description;
  if (c.image !== undefined) out.image = c.image;
  if (c.displayOrder !== undefined) out.display_order = Number(c.displayOrder) || 1;
  if (c.isActive !== undefined) out.is_active = Boolean(c.isActive);
  return out;
}

// ==========================================
// 2. PRODUCTS MAPPER
// ==========================================
export function mapProductFromDb(p) {
  if (!p) return null;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline || '',
    description: p.description || '',
    price: Number(p.price) || 0,
    discountPrice: p.discount_price ? Number(p.discount_price) : null,
    sku: p.sku || '',
    stock: p.stock ?? 0,
    category: p.category_slug || '',
    categorySlug: p.category_slug || '',
    image: p.image,
    gallery: Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery : (p.image ? [p.image] : []),
    dimensions: p.dimensions || '',
    material: p.material || '',
    colors: Array.isArray(p.colors) ? p.colors : [],
    featured: Boolean(p.featured),
    status: p.status || 'published',
    createdAt: p.created_at || new Date().toISOString(),
  };
}

export function mapProductToDb(p) {
  if (!p) return {};
  const out = {};
  if (p.id !== undefined) out.id = p.id;
  if (p.slug !== undefined) out.slug = p.slug;
  if (p.name !== undefined) out.name = p.name;
  if (p.tagline !== undefined) out.tagline = p.tagline;
  if (p.description !== undefined) out.description = p.description;
  if (p.price !== undefined) out.price = Number(p.price) || 0;
  if (p.discountPrice !== undefined) out.discount_price = p.discountPrice ? Number(p.discountPrice) : null;
  if (p.sku !== undefined) out.sku = p.sku;
  if (p.stock !== undefined) out.stock = Number(p.stock) || 0;
  if (p.category !== undefined || p.categorySlug !== undefined) {
    out.category_slug = p.categorySlug || p.category || 'chairs';
  }
  if (p.image !== undefined) out.image = p.image;
  if (p.gallery !== undefined) out.gallery = p.gallery;
  if (p.dimensions !== undefined) out.dimensions = p.dimensions;
  if (p.material !== undefined) out.material = p.material;
  if (p.colors !== undefined) out.colors = p.colors;
  if (p.featured !== undefined) out.featured = Boolean(p.featured);
  if (p.status !== undefined) out.status = p.status;
  return out;
}

// ==========================================
// 3. ADVERTISEMENTS MAPPER
// ==========================================
export function mapAdFromDb(a) {
  if (!a) return null;
  return {
    id: a.id,
    title: a.title,
    subtitle: a.subtitle || '',
    tagline: a.tagline || '',
    description: a.description || '',
    buttonText: a.button_text || 'Shop Now',
    buttonUrl: a.button_url || '/shop',
    placement: a.placement || 'hero_bottom',
    desktopImage: a.desktop_image,
    mobileImage: a.mobile_image || a.desktop_image,
    startDate: a.start_date || '',
    endDate: a.end_date || '',
    isActive: a.is_active ?? true,
    clicks: a.clicks || 0,
  };
}

export function mapAdToDb(a) {
  if (!a) return {};
  const out = {};
  if (a.id !== undefined) out.id = a.id;
  if (a.title !== undefined) out.title = a.title;
  if (a.subtitle !== undefined) out.subtitle = a.subtitle;
  if (a.tagline !== undefined) out.tagline = a.tagline;
  if (a.description !== undefined) out.description = a.description;
  if (a.buttonText !== undefined) out.button_text = a.buttonText;
  if (a.buttonUrl !== undefined) out.button_url = a.buttonUrl;
  if (a.placement !== undefined) out.placement = a.placement;
  if (a.desktopImage !== undefined) out.desktop_image = a.desktopImage;
  if (a.mobileImage !== undefined) out.mobile_image = a.mobileImage;
  if (a.startDate !== undefined) out.start_date = a.startDate || null;
  if (a.endDate !== undefined) out.end_date = a.endDate || null;
  if (a.isActive !== undefined) out.is_active = Boolean(a.isActive);
  if (a.clicks !== undefined) out.clicks = Number(a.clicks) || 0;
  return out;
}

// ==========================================
// 4. BLOGS MAPPER
// ==========================================
export function mapBlogFromDb(b) {
  if (!b) return null;
  return {
    id: b.id,
    slug: b.slug,
    title: b.title,
    author: b.author || 'Home & More Styling Team',
    category: b.category || 'Interior Design',
    excerpt: b.excerpt || '',
    content: b.content || '',
    image: b.featured_image,
    date: b.published_at || new Date().toISOString().split('T')[0],
    readTime: b.read_time || '4 min read',
    status: b.status || 'published',
  };
}

export function mapBlogToDb(b) {
  if (!b) return {};
  const out = {};
  if (b.id !== undefined) out.id = b.id;
  if (b.slug !== undefined) out.slug = b.slug;
  if (b.title !== undefined) out.title = b.title;
  if (b.author !== undefined) out.author = b.author;
  if (b.category !== undefined) out.category = b.category;
  if (b.excerpt !== undefined) out.excerpt = b.excerpt;
  if (b.content !== undefined) out.content = b.content;
  if (b.image !== undefined || b.featured_image !== undefined) {
    out.featured_image = b.image || b.featured_image;
  }
  if (b.date !== undefined || b.published_at !== undefined) {
    out.published_at = b.date || b.published_at;
  }
  if (b.readTime !== undefined) out.read_time = b.readTime;
  if (b.status !== undefined) out.status = b.status;
  return out;
}

// ==========================================
// 5. TESTIMONIALS MAPPER
// ==========================================
export function mapTestimonialFromDb(t) {
  if (!t) return null;
  return {
    id: t.id,
    name: t.name,
    location: t.location || 'Abuja',
    quote: t.quote || '',
    rating: t.rating ?? 5,
    photo: t.photo || '',
    isPublished: t.is_published ?? true,
    createdAt: t.created_at || new Date().toISOString(),
  };
}

export function mapTestimonialToDb(t) {
  if (!t) return {};
  const out = {};
  if (t.id !== undefined) out.id = t.id;
  if (t.name !== undefined) out.name = t.name;
  if (t.location !== undefined) out.location = t.location;
  if (t.quote !== undefined) out.quote = t.quote;
  if (t.rating !== undefined) out.rating = Number(t.rating) || 5;
  if (t.photo !== undefined) out.photo = t.photo;
  if (t.isPublished !== undefined) out.is_published = Boolean(t.isPublished);
  return out;
}

// ==========================================
// 6. ENQUIRIES MAPPER
// ==========================================
export function mapEnquiryFromDb(e) {
  if (!e) return null;
  return {
    id: e.id,
    customerName: e.customer_name,
    phone: e.phone,
    email: e.email || '',
    productName: e.product_name,
    productId: e.product_id || '',
    price: Number(e.price) || 0,
    message: e.message || '',
    notes: e.notes || '',
    status: e.status || 'pending',
    createdAt: e.created_at || new Date().toISOString(),
  };
}

export function mapEnquiryToDb(e) {
  if (!e) return {};
  const out = {};
  if (e.id !== undefined) out.id = e.id;
  if (e.customerName !== undefined) out.customer_name = e.customerName;
  if (e.phone !== undefined) out.phone = e.phone;
  if (e.email !== undefined) out.email = e.email;
  if (e.productName !== undefined) out.product_name = e.productName;
  if (e.productId !== undefined) out.product_id = e.productId;
  if (e.price !== undefined) out.price = Number(e.price) || 0;
  if (e.message !== undefined) out.message = e.message;
  if (e.notes !== undefined) out.notes = e.notes;
  if (e.status !== undefined) out.status = e.status;
  return out;
}

// ==========================================
// 7. WEBSITE SETTINGS MAPPER
// ==========================================
export function mapSettingsFromDb(s) {
  if (!s) return null;
  const social = s.social || {};
  return {
    businessName: s.business_name || 'Home & More Furniture',
    slogan: s.slogan || 'Modern Living. Better You.',
    logoSubtitle: social.logoSubtitle !== undefined ? social.logoSubtitle : 'FURNITURE',
    logoUrl: social.logoUrl || '',
    logoLightUrl: social.logoLightUrl || '',
    logoDisplayMode: social.logoDisplayMode || 'both',
    phone: s.phone || '+234 801 234 5678',
    whatsappNumber: s.whatsapp_number || '+2348012345678',
    whatsappGreeting:
      s.whatsapp_greeting || 'Hello Home & More Furniture, I would like to enquire about',
    email: s.email || 'hello@homeandmorefurniture.ng',
    address:
      s.address || 'Plot 1042 Ahmadu Bello Way, Central Business District, Abuja, Nigeria',
    currency: '₦',
    social: {
      facebook: social.facebook || 'https://facebook.com',
      instagram: social.instagram || 'https://instagram.com',
      youtube: social.youtube || 'https://youtube.com',
      whatsapp: social.whatsapp || 'https://wa.me/2348012345678',
    },
  };
}

export function mapSettingsToDb(s) {
  if (!s) return {};
  return {
    id: 'default_settings',
    business_name: s.businessName || 'Home & More Furniture',
    slogan: s.slogan || 'Modern Living. Better You.',
    phone: s.phone || '+234 801 234 5678',
    whatsapp_number: s.whatsappNumber || '+2348012345678',
    whatsapp_greeting:
      s.whatsappGreeting || 'Hello Home & More Furniture, I would like to enquire about',
    email: s.email || 'hello@homeandmorefurniture.ng',
    address:
      s.address || 'Plot 1042 Ahmadu Bello Way, Central Business District, Abuja, Nigeria',
    social: {
      facebook: s.social?.facebook || '',
      instagram: s.social?.instagram || '',
      youtube: s.social?.youtube || '',
      whatsapp: s.social?.whatsapp || '',
      logoUrl: s.logoUrl || '',
      logoLightUrl: s.logoLightUrl || '',
      logoDisplayMode: s.logoDisplayMode || 'both',
      logoSubtitle: s.logoSubtitle !== undefined ? s.logoSubtitle : 'FURNITURE',
    },
    updated_at: new Date().toISOString(),
  };
}
