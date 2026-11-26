import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { sanitizeUrl } from '../../utils/security';

/**
 * Shared WYSIWYG Advertisement Banner Renderer.
 * Used identically on the public Homepage AND inside Admin Live Desktop/Mobile Previews.
 *
 * Supports:
 * - MODE A ("image"): Pure full-bleed uploaded artwork with ZERO text/button overlays.
 * - MODE B ("text"): Art-directed showroom typography banner with custom colors,
 *   optional background image, promotional label, discount highlight, and CTA button.
 */
export default function AdBannerRenderer({
  ad,
  previewDevice = null, // null (responsive storefront) | 'desktop' | 'mobile'
  isSingleFullWidth = false,
  disableNavigation = false,
}) {
  if (!ad) return null;

  const mode = ad.displayMode || 'image';
  const href = sanitizeUrl(ad.destinationUrl || ad.buttonUrl, '/shop');
  const isExternal = /^https?:\/\//i.test(href);

  // Aspect ratios aligned with Baffi Home reference:
  // - Side-by-side 2-slot desktop: 16:7 wide showroom ratio (~620x270)
  // - Single active full-width desktop: 1024:318 (3.22:1) wide ratio
  // - Mobile: 16:9 / clean vertical stack without stretching
  const hasSeparateMobileImg =
    Boolean(ad.mobileImage) && ad.mobileImage !== ad.desktopImage;

  const aspectClass =
    previewDevice === 'mobile'
      ? isSingleFullWidth && mode === 'image' && !hasSeparateMobileImg
        ? 'aspect-[1024/318]'
        : 'aspect-[16/9]'
      : previewDevice === 'desktop'
      ? isSingleFullWidth
        ? 'aspect-[1024/318]'
        : 'aspect-[16/7]'
      : isSingleFullWidth
      ? mode === 'image' && !hasSeparateMobileImg
        ? 'aspect-[1024/318]'
        : 'aspect-[16/9] sm:aspect-[1024/318]'
      : 'aspect-[16/9] md:aspect-[16/8] lg:aspect-[16/7]';

  const wrapWithLink = (children) => {
    if (disableNavigation || !href) {
      return <div className="block w-full h-full">{children}</div>;
    }
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ad.altText || ad.headline || ad.name || 'View promotion'}
          className="block w-full h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F36B0A] rounded-2xl"
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        to={href}
        aria-label={ad.altText || ad.headline || ad.name || 'View promotion'}
        className="block w-full h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F36B0A] rounded-2xl"
      >
        {children}
      </Link>
    );
  };

  // ==========================================
  // MODE A: IMAGE ADVERTISEMENT (Pure Artwork)
  // ==========================================
  if (mode === 'image') {
    const desktopSrc = ad.desktopImage || ad.mobileImage || '';
    const mobileSrc = ad.mobileImage || ad.desktopImage || '';
    const fitClass = ad.imageFit === 'contain' ? 'object-contain' : 'object-cover';

    if (!desktopSrc && !mobileSrc) {
      return (
        <div
          className={`w-full ${aspectClass} rounded-2xl border border-dashed border-[#D9CBBF] bg-[#FAF7F3] flex items-center justify-center p-6 text-center`}
        >
          <p className="text-xs text-[#786B62]">Upload an advertisement image to preview</p>
        </div>
      );
    }

    return wrapWithLink(
      <div
        className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl border border-[#EAE2D9] bg-[#FAF7F3] shadow-xs`}
      >
        {previewDevice === 'mobile' ? (
          <img
            src={mobileSrc}
            alt={ad.altText || ad.name || 'Promotional Advertisement'}
            loading="lazy"
            className={`w-full h-full ${fitClass} transition-transform duration-500 group-hover:scale-[1.015]`}
          />
        ) : previewDevice === 'desktop' ? (
          <img
            src={desktopSrc}
            alt={ad.altText || ad.name || 'Promotional Advertisement'}
            loading="lazy"
            className={`w-full h-full ${fitClass} transition-transform duration-500 group-hover:scale-[1.015]`}
          />
        ) : (
          <>
            <img
              src={desktopSrc}
              alt={ad.altText || ad.name || 'Promotional Advertisement'}
              loading="lazy"
              className={`hidden sm:block w-full h-full ${fitClass} transition-transform duration-500 group-hover:scale-[1.015]`}
            />
            <img
              src={mobileSrc}
              alt={ad.altText || ad.name || 'Promotional Advertisement'}
              loading="lazy"
              className={`block sm:hidden w-full h-full ${fitClass} transition-transform duration-500 group-hover:scale-[1.015]`}
            />
          </>
        )}
      </div>
    );
  }

  // ==========================================
  // MODE B: CUSTOM TEXT / DESIGN ADVERTISEMENT
  // ==========================================
  const bgColor = ad.backgroundColor || '#F4ECE2';
  const bgImage = ad.backgroundImage || '';
  const headlineColor = ad.headlineColor || '#24150F';
  const descColor = ad.descriptionColor || '#5E5148';
  const btnBg = ad.buttonBackgroundColor || '#F36B0A';
  const btnText = ad.buttonTextColor || '#FFFFFF';
  const textAlign = ad.textAlignment || 'left';
  const contentPos = ad.contentPosition || 'left';
  const bannerStyle = ad.bannerStyle || 'editorial';

  const alignTextClass =
    textAlign === 'center'
      ? 'text-center items-center'
      : textAlign === 'right'
      ? 'text-right items-end'
      : 'text-left items-start';

  const justifyContentClass =
    contentPos === 'center'
      ? 'justify-center'
      : contentPos === 'right'
      ? 'justify-end'
      : 'justify-start';

  const isMobilePreview = previewDevice === 'mobile';

  return wrapWithLink(
    <div
      style={{ backgroundColor: bgColor }}
      className={`relative w-full ${
        isMobilePreview ? 'min-h-[210px]' : isSingleFullWidth ? 'min-h-[230px] sm:aspect-[1024/318]' : 'min-h-[220px] md:min-h-[240px] lg:aspect-[16/7]'
      } overflow-hidden rounded-2xl border border-[#EAE2D9]/80 shadow-xs flex items-center ${justifyContentClass} transition-all duration-300 group-hover:shadow-card-hover`}
    >
      {/* Optional Background Image with tasteful readability scrim */}
      {bgImage && (
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                contentPos === 'center'
                  ? `linear-gradient(180deg, ${bgColor}CC 0%, ${bgColor}B3 55%, ${bgColor}D9 100%)`
                  : contentPos === 'right'
                  ? `linear-gradient(270deg, ${bgColor}EE 0%, ${bgColor}C8 55%, ${bgColor}33 100%)`
                  : `linear-gradient(90deg, ${bgColor}EE 0%, ${bgColor}C8 55%, ${bgColor}33 100%)`,
            }}
          />
        </div>
      )}

      {/* Optional Architectural Inner Frame for "framed" style */}
      {bannerStyle === 'framed' && (
        <div
          className="absolute inset-3 sm:inset-4 rounded-xl border pointer-events-none"
          style={{ borderColor: `${headlineColor}26` }}
        />
      )}

      {/* Subtle Accent Strip for "bold" style */}
      {bannerStyle === 'bold' && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 pointer-events-none"
          style={{ backgroundColor: btnBg }}
        />
      )}

      {/* Editorial Content Block */}
      <div
        className={`relative z-10 flex flex-col ${alignTextClass} ${
          isMobilePreview ? 'p-5 max-w-full' : 'p-6 sm:p-8 lg:p-10 max-w-xl'
        } space-y-2.5 sm:space-y-3`}
      >
        {/* Promotional Label & Optional Discount Pill */}
        {(ad.promotionalLabel || ad.discountText) && (
          <div
            className={`flex flex-wrap items-center gap-2 ${
              textAlign === 'center'
                ? 'justify-center'
                : textAlign === 'right'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            {ad.promotionalLabel && (
              <span
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: btnBg }}
              >
                {ad.promotionalLabel}
              </span>
            )}
            {ad.discountText && (
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${btnBg}1F`,
                  color: btnBg,
                  border: `1px solid ${btnBg}40`,
                }}
              >
                {ad.discountText}
              </span>
            )}
          </div>
        )}

        {/* Main Headline */}
        {ad.headline && (
          <h3
            style={{ color: headlineColor }}
            className={`font-editorial font-semibold leading-[1.15] tracking-tight ${
              isMobilePreview
                ? 'text-xl'
                : isSingleFullWidth
                ? 'text-2xl sm:text-3xl lg:text-4xl'
                : 'text-xl sm:text-2xl lg:text-[28px]'
            }`}
          >
            {ad.headline}
          </h3>
        )}

        {/* Supporting Description */}
        {ad.description && (
          <p
            style={{ color: descColor }}
            className={`${
              isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'
            } leading-relaxed max-w-md line-clamp-2 sm:line-clamp-3`}
          >
            {ad.description}
          </p>
        )}

        {/* Optional CTA Button */}
        {ad.ctaText && (
          <div className="pt-1">
            <span
              style={{ backgroundColor: btnBg, color: btnText }}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide shadow-xs transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <span>{ad.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
