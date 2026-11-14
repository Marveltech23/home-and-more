/**
 * Dynamically updates the browser tab favicon and shortcuts.
 * Supports SVGs, remote URLs, and base64 data URLs.
 * If a raster image is provided, centers it into a square canvas to prevent
 * browser squishing and distortion in the tab header.
 */
export function setBrowserFavicon(url) {
  if (typeof document === 'undefined') return;

  const defaultFavicon = '/favicon.svg';
  const targetUrl = url && url.trim() ? url.trim() : defaultFavicon;

  const applyLink = (href, type = 'image/svg+xml') => {
    try {
      // Remove existing icon links so the browser refreshes the tab icon immediately
      const existing = document.querySelectorAll("link[rel*='icon']");
      existing.forEach((el) => el.remove());

      const link = document.createElement('link');
      link.id = 'dynamic-favicon';
      link.rel = 'icon';
      link.type = type;
      link.href = href;
      document.head.appendChild(link);

      const shortcut = document.createElement('link');
      shortcut.rel = 'shortcut icon';
      shortcut.href = href;
      document.head.appendChild(shortcut);
    } catch (e) {
      console.warn('Error setting favicon link:', e);
    }
  };

  // If using default SVG or an SVG data URI
  if (
    targetUrl === defaultFavicon ||
    targetUrl.startsWith('data:image/svg') ||
    targetUrl.endsWith('.svg')
  ) {
    applyLink(targetUrl, 'image/svg+xml');
    return;
  }

  // If it's a raster image (PNG, JPG, WEBP, base64 data URL):
  // Generate a clean 64x64 square favicon preserving aspect ratio so the browser tab doesn't squish wide logos
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const size = 64;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // Clear transparent
      ctx.clearRect(0, 0, size, size);

      const aspect = img.width / img.height;
      let drawW, drawH, drawX, drawY;

      if (aspect >= 1) {
        // Wider than tall
        drawW = size;
        drawH = size / aspect;
        drawX = 0;
        drawY = (size - drawH) / 2;
      } else {
        // Taller than wide
        drawH = size;
        drawW = size * aspect;
        drawX = (size - drawW) / 2;
        drawY = 0;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      const squareDataUrl = canvas.toDataURL('image/png');
      applyLink(squareDataUrl, 'image/png');
    };
    img.onerror = () => {
      applyLink(targetUrl, 'image/png');
    };
    img.src = targetUrl;
  } catch {
    applyLink(targetUrl, 'image/png');
  }
}
