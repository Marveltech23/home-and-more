import { formatNaira } from './format.js';

export const DEFAULT_WHATSAPP_NUMBER = '+2348033513144';

/** Build a wa.me link. `number` may contain +, spaces or dashes. */
export function buildWhatsAppLink(number, message = '') {
  const digits = String(number || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, '') || '2348033513144';
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${text}`;
}

/** Determine whether a product's price should be visible on the storefront. */
export function isProductPriceVisible(product, settings) {
  if (settings?.showPrices === false) return false;
  const hiddenIds = Array.isArray(settings?.hiddenPriceProductIds)
    ? settings.hiddenPriceProductIds
    : [];
  if (product?.id && hiddenIds.includes(product.id)) return false;
  return true;
}

/**
 * Build a WhatsApp purchase link carrying rich, buyer-ready product details
 * directly to the business WhatsApp number (+234 803 351 3144).
 */
export function buildProductWhatsAppLink(
  product,
  {
    settings = {},
    categories = [],
    selectedColor = '',
    quantity = 1,
    showPrice = true,
  } = {}
) {
  if (!product) {
    return buildWhatsAppLink(
      settings?.whatsappNumber || DEFAULT_WHATSAPP_NUMBER,
      'Hello Home & More Furniture, I would like to enquire about your furniture collection.'
    );
  }

  const number = settings?.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://www.homeandmorefurniture.com';
  const productUrl = `${origin}/product/${product.slug}`;
  const categoryObj = (categories || []).find((c) => c.slug === product.categorySlug);
  const categoryName = categoryObj?.name || product.categorySlug || '';

  const lines = [
    'Hello Home & More Furniture,',
    '',
    'I would like to buy this item from your website:',
    '',
    `*Product:* ${product.name}`,
  ];

  if (categoryName) lines.push(`*Category:* ${categoryName}`);
  if (product.sku) lines.push(`*SKU:* ${product.sku}`);

  if (showPrice && Number(product.price) > 0) {
    const priceText =
      quantity > 1
        ? `${formatNaira(product.price)} x ${quantity} = ${formatNaira(product.price * quantity)}`
        : formatNaira(product.price);
    lines.push(`*Price:* ${priceText}`);
  }

  if (selectedColor) lines.push(`*Finish / Color:* ${selectedColor}`);
  if (quantity > 1) lines.push(`*Quantity:* ${quantity}`);
  if (product.dimensions) lines.push(`*Dimensions:* ${product.dimensions}`);
  if (product.material) lines.push(`*Material:* ${product.material}`);
  lines.push(`*Product Link:* ${productUrl}`);
  lines.push('');
  lines.push(
    showPrice
      ? 'Please confirm availability and delivery details in Abuja.'
      : 'Please share the price, availability, and delivery details in Abuja.'
  );

  return buildWhatsAppLink(number, lines.join('\n'));
}
