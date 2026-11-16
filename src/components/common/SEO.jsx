import { useEffect } from 'react';

const DOMAIN = 'https://www.homeandmorefurniture.com';
const DEFAULT_TITLE = 'Home & More Furniture | Modern Living. Better You.';
const DEFAULT_DESC =
  'Shop the finest selection of modern luxury furniture in Abuja, Nigeria at Home & More Furniture. Explore handcrafted sofas, dining sets, orthopedic beds, TV stands, and wardrobes.';
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80';

export default function SEO({
  title,
  description = DEFAULT_DESC,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  schema,
}) {
  useEffect(() => {
    // 1. Title
    const fullTitle = title ? `${title} | Home & More Furniture` : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper to set or create meta tag
    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMeta('name', 'description', description);

    // 3. Canonical Link
    const targetUrl = canonical ? `${DOMAIN}${canonical.startsWith('/') ? '' : '/'}${canonical}` : DOMAIN;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', targetUrl);

    // 4. OpenGraph Tags
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', targetUrl);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:image', image);

    // 5. Twitter Tags
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    // 6. Dynamic JSON-LD Structured Data
    const scriptId = 'dynamic-page-schema';
    let scriptTag = document.getElementById(scriptId);

    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Optional cleanup on unmount
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };
  }, [title, description, canonical, image, type, schema]);

  return null;
}
