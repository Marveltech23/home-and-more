/**
 * Defensive URL & input sanitization helpers.
 * Blocks javascript:, vbscript:, data:text/html, and protocol-relative open redirects.
 */

const SAFE_PROTOCOLS = new Set(['https:', 'http:', 'mailto:', 'tel:']);

export function sanitizeUrl(rawUrl, fallback = '/shop') {
  if (typeof rawUrl !== 'string') return fallback;
  const trimmed = rawUrl.trim();
  if (!trimmed) return fallback;

  // Allow safe internal relative paths (but block protocol-relative //evil.com)
  if (trimmed.startsWith('/')) {
    if (trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
      return fallback;
    }
    return trimmed;
  }

  // Allow fragment anchors
  if (trimmed.startsWith('#')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (SAFE_PROTOCOLS.has(parsed.protocol)) {
      return parsed.href;
    }
  } catch {
    // Invalid URL
  }

  return fallback;
}

/**
 * Ensures post-login redirects stay strictly inside /admin routes
 * to prevent open-redirect phishing attacks.
 */
export function sanitizeAdminRedirect(pathname, fallback = '/admin') {
  if (typeof pathname !== 'string') return fallback;
  const trimmed = pathname.trim();
  if (
    trimmed.startsWith('/admin') &&
    !trimmed.startsWith('//') &&
    !trimmed.includes('\\') &&
    trimmed !== '/admin/login'
  ) {
    return trimmed;
  }
  return fallback;
}
