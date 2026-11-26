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
// 3. ADVERTISEMENTS MAPPER (2-Slot Image & Text/Design Mode)
// ==========================================
const AD_CONFIG_PREFIX = '__adcfg__:';

function parseAdConfig(a) {
  // Prefer dedicated JSONB column if migration has been run
  if (a?.design_config && typeof a.design_config === 'object') {
    return { cfg: a.design_config, plainTagline: a.tagline || '' };
  }
  // Fallback: unpack structured JSON stored safely in tagline column
  if (typeof a?.tagline === 'string' && a.tagline.startsWith(AD_CONFIG_PREFIX)) {
    try {
      const parsed = JSON.parse(a.tagline.slice(AD_CONFIG_PREFIX.length));
      if (parsed && typeof parsed === 'object') {
        return { cfg: parsed, plainTagline: parsed.plainTagline || '' };
      }
    } catch {
      // Ignore malformed JSON
    }
  }
  return { cfg: {}, plainTagline: a?.tagline || '' };
}

export function mapAdFromDb(a) {
  if (!a) return null;
  const { cfg, plainTagline } = parseAdConfig(a);
  const rawPlacement = a.placement || 'slot_1';
  const normalizedSlot =
    rawPlacement === 'hero_bottom' ? 'slot_1' : rawPlacement;

  const hasCustomImage =
    Boolean(a.desktop_image) &&
    !String(a.desktop_image).startsWith('/images/stock/') &&
    !String(a.desktop_image).includes('images.unsplash.com');

  const displayMode = cfg.displayMode || (hasCustomImage ? 'image' : 'text');

  return {
    id: a.id,
    name: cfg.name || a.title || (normalizedSlot === 'slot_2' ? 'Advertisement 2' : 'Advertisement 1'),
    slotPosition: cfg.slotPosition || normalizedSlot,
    placement: rawPlacement,
    displayMode, // 'image' | 'text'
    status: cfg.status || (a.is_active === false ? 'draft' : 'published'), // 'published' | 'draft'
    // Image Mode fields
    desktopImage: a.desktop_image || '',
    mobileImage: a.mobile_image || '',
    altText: cfg.altText || a.title || 'Promotional Advertisement',
    imageFit: cfg.imageFit || 'cover', // 'cover' | 'contain'
    // Text / Design Mode fields
    title: a.title || '',
    headline: cfg.headline !== undefined ? cfg.headline : a.title || '',
    subtitle: a.subtitle || '',
    promotionalLabel: cfg.promotionalLabel !== undefined ? cfg.promotionalLabel : a.subtitle || '',
    discountText: cfg.discountText || '',
    tagline: plainTagline,
    description: a.description || '',
    buttonText: a.button_text || '',
    ctaText: cfg.ctaText !== undefined ? cfg.ctaText : a.button_text || '',
    buttonUrl: a.button_url || '/shop',
    destinationUrl: a.button_url || '/shop',
    // Design settings
    backgroundColor: cfg.backgroundColor || (normalizedSlot === 'slot_2' ? '#24150F' : '#F4ECE2'),
    backgroundImage: cfg.backgroundImage || '',
    headlineColor: cfg.headlineColor || (normalizedSlot === 'slot_2' ? '#FFFFFF' : '#24150F'),
    descriptionColor: cfg.descriptionColor || (normalizedSlot === 'slot_2' ? '#E7DCD1' : '#5E5148'),
    buttonBackgroundColor: cfg.buttonBackgroundColor || '#F36B0A',
    buttonTextColor: cfg.buttonTextColor || '#FFFFFF',
    textAlignment: cfg.textAlignment || 'left', // 'left' | 'center' | 'right'
    contentPosition: cfg.contentPosition || 'left', // 'left' | 'center' | 'right'
    bannerStyle: cfg.bannerStyle || 'editorial', // 'editorial' | 'framed' | 'bold'
    // Schedule & status
    startDate: a.start_date || '',
    endDate: a.end_date || '',
    isActive: a.is_active ?? true,
    clicks: a.clicks || 0,
    createdAt: a.created_at || '',
    updatedAt: cfg.updatedAt || a.updated_at || a.created_at || '',
  };
}

export function mapAdToDb(a) {
  if (!a) return {};
  const out = {};
  if (a.id !== undefined) out.id = a.id;

  const titleVal = a.headline || a.title || a.name || 'Promotional Banner';
  out.title = titleVal;
  out.subtitle = a.promotionalLabel !== undefined ? a.promotionalLabel : a.subtitle || '';
  out.description = a.description || '';
  out.button_text = a.ctaText !== undefined ? a.ctaText : a.buttonText || '';
  out.button_url = a.destinationUrl !== undefined ? a.destinationUrl : a.buttonUrl || '/shop';
  out.placement = a.slotPosition || a.placement || 'slot_1';
  out.desktop_image = a.desktopImage || a.backgroundImage || '';
  out.mobile_image = a.mobileImage || '';
  if (a.startDate !== undefined) out.start_date = a.startDate || null;
  if (a.endDate !== undefined) out.end_date = a.endDate || null;
  if (a.isActive !== undefined) out.is_active = Boolean(a.isActive);
  if (a.clicks !== undefined) out.clicks = Number(a.clicks) || 0;

  // Persist rich Image/Text design settings cleanly inside tagline column (works immediately without requiring DDL)
  const designConfig = {
    name: a.name || titleVal,
    slotPosition: a.slotPosition || a.placement || 'slot_1',
    displayMode: a.displayMode || 'image',
    status: a.status || 'published',
    altText: a.altText || titleVal,
    imageFit: a.imageFit || 'cover',
    headline: a.headline !== undefined ? a.headline : titleVal,
    promotionalLabel: a.promotionalLabel !== undefined ? a.promotionalLabel : a.subtitle || '',
    discountText: a.discountText || '',
    ctaText: a.ctaText !== undefined ? a.ctaText : a.buttonText || '',
    backgroundColor: a.backgroundColor || '#F4ECE2',
    backgroundImage: a.backgroundImage || '',
    headlineColor: a.headlineColor || '#24150F',
    descriptionColor: a.descriptionColor || '#5E5148',
    buttonBackgroundColor: a.buttonBackgroundColor || '#F36B0A',
    buttonTextColor: a.buttonTextColor || '#FFFFFF',
    textAlignment: a.textAlignment || 'left',
    contentPosition: a.contentPosition || 'left',
    bannerStyle: a.bannerStyle || 'editorial',
    plainTagline: a.tagline || '',
    updatedAt: a.updatedAt || new Date().toISOString(),
  };

  out.tagline = `${AD_CONFIG_PREFIX}${JSON.stringify(designConfig)}`;
  return out;
}

// ==========================================
// 4. BLOGS MAPPER
// ==========================================
export function mapBlogFromDb(b) {
  if (!b) return null;
  const img = b.featured_image || b.image || '';
  const dt = b.published_at || b.date || new Date().toISOString().split('T')[0];
  return {
    id: b.id,
    slug: b.slug,
    title: b.title,
    author: b.author || 'Home & More Styling Team',
    category: b.category || 'Interior Design',
    excerpt: b.excerpt || '',
    content: b.content || '',
    image: img,
    featuredImage: img,
    date: dt,
    publishedAt: dt,
    readTime: b.read_time || b.readTime || '4 min read',
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
  const img = b.featured_image || b.featuredImage || b.image;
  if (img !== undefined) {
    out.featured_image = img;
  }
  const dt = b.published_at || b.publishedAt || b.date;
  if (dt !== undefined) {
    out.published_at = dt;
  }
  if (b.readTime !== undefined || b.read_time !== undefined) {
    out.read_time = b.readTime || b.read_time;
  }
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
    phone: s.phone || '+234 803 351 3144',
    whatsappNumber: s.whatsapp_number || '+2348033513144',
    whatsappGreeting:
      s.whatsapp_greeting || 'Hello Home & More Furniture, I would like to enquire about',
    email: s.email || 'Homeandmorefurnitures@gmail.com',
    showroomAddress:
      s.showroom_address ||
      social.showroomAddress ||
      '204 Pa Michael Imoudu Ave, 32 Cres, 3rd Avenue Gwarinpa, 900108, Abuja, Nigeria',
    factoryAddress:
      s.factory_address ||
      social.factoryAddress ||
      'Plot D10 Zauda Pazeri Dei-Dei, Abuja',
    address:
      s.address || '204 Pa Michael Imoudu Ave, 32 Cres, 3rd Avenue Gwarinpa, 900108, Abuja, Nigeria',
    currency: '₦',
    showPrices: social.showPrices !== undefined ? Boolean(social.showPrices) : true,
    hiddenPriceProductIds: Array.isArray(social.hiddenPriceProductIds)
      ? social.hiddenPriceProductIds
      : [],
    social: {
      facebook: social.facebook || 'https://facebook.com/homeandmorefurniture',
      instagram: social.instagram || 'https://instagram.com/homeandmorefurniture',
      youtube: social.youtube || 'https://youtube.com/@homeandmorefurniture',
      whatsapp: social.whatsapp || 'https://wa.me/2348033513144',
    },
  };
}

export function mapSettingsToDb(s) {
  if (!s) return {};
  return {
    id: 'default_settings',
    business_name: s.businessName || 'Home & More Furniture',
    slogan: s.slogan || 'Modern Living. Better You.',
    phone: s.phone || '+234 803 351 3144',
    whatsapp_number: s.whatsappNumber || '+2348033513144',
    whatsapp_greeting:
      s.whatsappGreeting || 'Hello Home & More Furniture, I would like to enquire about',
    email: s.email || 'Homeandmorefurnitures@gmail.com',
    address:
      s.address || '204 Pa Michael Imoudu Ave, 32 Cres, 3rd Avenue Gwarinpa, 900108, Abuja, Nigeria',
    social: {
      facebook: s.social?.facebook || '',
      instagram: s.social?.instagram || '',
      youtube: s.social?.youtube || '',
      whatsapp: s.social?.whatsapp || '',
      logoUrl: s.logoUrl || '',
      logoLightUrl: s.logoLightUrl || '',
      logoDisplayMode: s.logoDisplayMode || 'both',
      logoSubtitle: s.logoSubtitle !== undefined ? s.logoSubtitle : 'FURNITURE',
      showroomAddress: s.showroomAddress || '204 Pa Michael Imoudu Ave, 32 Cres, 3rd Avenue Gwarinpa, 900108, Abuja, Nigeria',
      factoryAddress: s.factoryAddress || 'Plot D10 Zauda Pazeri Dei-Dei, Abuja',
      showPrices: s.showPrices !== undefined ? Boolean(s.showPrices) : true,
      hiddenPriceProductIds: Array.isArray(s.hiddenPriceProductIds)
        ? s.hiddenPriceProductIds
        : [],
    },
    updated_at: new Date().toISOString(),
  };
}

// ==========================================
// 8. MEDIA MAPPER
// ==========================================
export function mapMediaFromDb(m) {
  if (!m) return null;
  return {
    id: m.id,
    name: m.name || 'Photo.jpg',
    url: m.url || '',
    type: m.type || 'image/jpeg',
    size: m.size || '1.2 MB',
    dimensions: m.dimensions || '1920x1080',
    category: m.category || 'Products',
    createdAt: m.created_at || new Date().toISOString(),
  };
}

export function mapMediaToDb(m) {
  if (!m) return {};
  const out = {};
  if (m.id !== undefined) out.id = m.id;
  if (m.name !== undefined) out.name = m.name;
  if (m.url !== undefined) out.url = m.url;
  if (m.type !== undefined) out.type = m.type;
  if (m.size !== undefined) out.size = m.size;
  if (m.dimensions !== undefined) out.dimensions = m.dimensions;
  if (m.category !== undefined) out.category = m.category;
  out.created_at = m.createdAt || m.created_at || new Date().toISOString();
  return out;
}
