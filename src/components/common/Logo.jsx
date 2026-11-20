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
      : settings.businessName || 'Home & More';

  const subtitle =
    overrideSubtitle !== undefined
      ? overrideSubtitle
      : settings.logoSubtitle !== undefined && settings.logoSubtitle !== ''
      ? settings.logoSubtitle
      : 'ATELIER • ABUJA';

  const displayMode =
    overrideDisplayMode !== undefined
      ? overrideDisplayMode
      : settings.logoDisplayMode || 'both'; // 'both' | 'image_only'

  const primaryLogo =
    overrideLogoUrl !== undefined ? overrideLogoUrl : settings.logoUrl || '';

  const lightLogo =
    overrideLogoLightUrl !== undefined
      ? overrideLogoLightUrl
      : settings.logoLightUrl || '';

  const activeLogoUrl = isLight ? lightLogo || primaryLogo : primaryLogo;

  useEffect(() => {
    setImageError(false);
  }, [activeLogoUrl]);

  const hasCustomLogo = Boolean(activeLogoUrl && !imageError);

  const badgeSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const imageOnlyHeights = {
    sm: 'h-7 max-h-7 max-w-[150px]',
    md: 'h-9 max-h-9 max-w-[200px]',
    lg: 'h-12 max-h-12 max-w-[260px]',
  };

  const textSizes = {
    sm: { main: 'text-base sm:text-lg', sub: 'text-[8px] tracking-[0.24em]' },
    md: { main: 'text-xl sm:text-2xl', sub: 'text-[9px] sm:text-[10px] tracking-[0.26em]' },
    lg: { main: 'text-2xl sm:text-3xl', sub: 'text-[10px] sm:text-[11px] tracking-[0.3em]' },
  };

  const renderContent = () => {
    if (displayMode === 'image_only' && hasCustomLogo) {
      return (
        <div className="flex items-center">
          <img
            src={activeLogoUrl}
            alt={businessName}
            onError={() => setImageError(true)}
            className={`${imageOnlyHeights[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]`}
          />
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        {/* Architectural Monogram Emblem */}
        <div
          className={`${badgeSizes[size]} shrink-0 flex items-center justify-center font-luxury-serif font-semibold border transition-all duration-300 ${
            hasCustomLogo
              ? 'bg-transparent p-0 border-0'
              : isLight
              ? 'bg-white/10 text-white border-white/25 group-hover:border-amber-300/60'
              : 'bg-[#1C1815] text-[#FBF9F5] border-[#1C1815] group-hover:bg-[#B89358] group-hover:border-[#B89358]'
          }`}
        >
          {hasCustomLogo ? (
            <img
              src={activeLogoUrl}
              alt={businessName}
              onError={() => setImageError(true)}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="tracking-tighter">HM</span>
          )}
        </div>

        {/* Wordmark Typography */}
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`font-luxury-serif font-normal tracking-[0.14em] uppercase transition-colors ${
              textSizes[size].main
            } ${isLight ? 'text-white' : 'text-[#1C1815]'}`}
          >
            {businessName}
          </span>
          {subtitle && (
            <span
              className={`font-sans font-medium uppercase mt-1 ${
                textSizes[size].sub
              } ${isLight ? 'text-white/60' : 'text-[#7A7268]'}`}
            >
              {subtitle}
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
