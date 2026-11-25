import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export default function Logo({
  variant = 'dark', // 'dark' (on light backgrounds) | 'light' (on dark backgrounds)
  className = '',
  size = 'md',
  to = '/',
  // Optional preview overrides (used in admin settings live preview)
  overrideLogoUrl,
  overrideLogoLightUrl,
  overrideDisplayMode,
  overrideBusinessName,
  overrideSubtitle,
}) {
  let settings = {};
  try {
    const store = useStore();
    if (store && store.settings) {
      settings = store.settings;
    }
  } catch {
    settings = {};
  }

  const [imageError, setImageError] = useState(false);

  const isLight = variant === 'light'; // Light text for dark backgrounds (footer, admin sidebar)

  const businessName =
    overrideBusinessName !== undefined
      ? overrideBusinessName
      : settings.businessName || 'Home & More Furniture';

  const subtitle =
    overrideSubtitle !== undefined
      ? overrideSubtitle
      : settings.logoSubtitle !== undefined
      ? settings.logoSubtitle
      : 'FURNITURE';

  const displayMode =
    overrideDisplayMode !== undefined
      ? overrideDisplayMode
      : settings.logoDisplayMode || 'both'; // 'both' | 'image_only'

  // Pick appropriate logo URL:
  // For dark backgrounds (footer, admin sidebar), prefer light variant if set, else fallback to primary logo
  const primaryLogo =
    overrideLogoUrl !== undefined ? overrideLogoUrl : settings.logoUrl || '';

  const lightLogo =
    overrideLogoLightUrl !== undefined
      ? overrideLogoLightUrl
      : settings.logoLightUrl || '';

  const activeLogoUrl = isLight ? lightLogo || primaryLogo : primaryLogo;

  // Reset image error state whenever active logo URL changes
  useEffect(() => {
    setImageError(false);
  }, [activeLogoUrl]);

  const hasCustomLogo = Boolean(activeLogoUrl && !imageError);

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
  };

  const imageOnlyHeights = {
    sm: 'h-9 max-h-9 max-w-[170px]',
    md: 'h-12 sm:h-14 max-h-14 max-w-[240px]',
    lg: 'h-14 sm:h-16 max-h-16 max-w-[280px]',
  };

  const textSizes = {
    sm: { main: 'text-base font-bold', sub: 'text-[9px] font-bold tracking-[0.24em]' },
    md: { main: 'text-lg sm:text-[22px] font-black tracking-tight', sub: 'text-[10px] sm:text-[11px] font-extrabold tracking-[0.28em]' },
    lg: { main: 'text-2xl sm:text-[28px] font-black tracking-tight', sub: 'text-xs sm:text-[13px] font-extrabold tracking-[0.3em]' },
  };

  // Format typography: split name and subtitle gracefully
  let mainText = businessName;
  let subText = subtitle;
  if (subText && mainText && mainText.toLowerCase().endsWith(subText.toLowerCase())) {
    mainText = mainText.slice(0, -subText.length).trim();
  }

  const renderContent = () => {
    // Mode 1: Full Image Only (User uploaded a complete wordmark / banner logo)
    if (displayMode === 'image_only' && hasCustomLogo) {
      return (
        <div
          className={`flex items-center ${
            isLight && !lightLogo
              ? 'bg-white/95 px-2.5 py-1.5 rounded-xl shadow-xs'
              : ''
          }`}
        >
          <img
            src={activeLogoUrl}
            alt={businessName}
            onError={() => setImageError(true)}
            className={`${imageOnlyHeights[size]} w-auto object-contain rounded-lg transition-transform duration-200 group-hover:scale-[1.02]`}
          />
        </div>
      );
    }

    // Mode 2: Both (Custom emblem or signature house icon + brand typography)
    return (
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Brand Icon or Custom Emblem */}
        <div
          className={`${iconSizes[size]} shrink-0 relative flex items-center justify-center rounded-xl overflow-hidden shadow-xs transition-transform duration-200 group-hover:scale-105 ${
            hasCustomLogo
              ? isLight
                ? 'bg-white/10 backdrop-blur-xs border border-white/20 p-1'
                : 'bg-white border border-[#F0DFD1] p-1'
              : 'bg-gradient-to-br from-[#F36B0A] to-[#D94D00] text-white shadow-sm'
          }`}
        >
          {hasCustomLogo ? (
            <img
              src={activeLogoUrl}
              alt={businessName}
              onError={() => setImageError(true)}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[85%] h-[85%] drop-shadow-xs">
              {/* Signature Stylized Roof, Chimney & Architecture */}
              <path d="M12 2.5L2 10.5h3v9.5c0 .55.45 1 1 1h4v-6h4v6h4c.55 0 1-.45 1-1v-9.5h3L12 2.5z" />
              <path d="M17 3.5h2.5v4.5H17V3.5z" />
            </svg>
          )}
        </div>

        {/* Brand Typography */}
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`font-black tracking-tight transition-colors ${
              textSizes[size].main
            } ${isLight ? 'text-white' : 'text-[#24150F]'}`}
          >
            {mainText || 'Home & More'}
          </span>
          {subText && (
            <span
              className={`font-extrabold uppercase mt-0.5 ${
                textSizes[size].sub
              } ${isLight ? 'text-orange-200/90' : 'text-[#82746B]'}`}
            >
              {subText}
            </span>
          )}
        </div>
      </div>
    );
  };

  const containerClasses = `inline-flex items-center group select-none ${className}`;

  if (to) {
    return (
      <Link to={to} className={containerClasses}>
        {renderContent()}
      </Link>
    );
  }

  return <div className={containerClasses}>{renderContent()}</div>;
}
