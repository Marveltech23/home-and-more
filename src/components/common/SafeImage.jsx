import { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function SafeImage({
  src,
  alt = '',
  className = '',
  aspectRatio = 'aspect-square',
  fallbackSrc = null,
  showPlaceholderIcon = true,
  loading = 'lazy',
  ...props
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset error state if src changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  if (!src || hasError) {
    if (fallbackSrc && !hasError) {
      // try fallback
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          loading={loading}
          className={className}
          onError={() => setHasError(true)}
          {...props}
        />
      );
    }

    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#F8EBDD] to-[#F0DFD1]/50 text-[#82746B] ${aspectRatio} ${className}`}
        role="img"
        aria-label={alt || 'Image placeholder'}
      >
        {showPlaceholderIcon ? (
          <div className="flex flex-col items-center justify-center gap-1.5 p-3 text-center">
            <ImageIcon className="w-8 h-8 opacity-40 text-[#F36B0A]" />
            {alt && <span className="text-[11px] font-medium opacity-60 line-clamp-1">{alt}</span>}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#F8EBDD]/60 animate-pulse flex items-center justify-center" />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        {...props}
      />
    </div>
  );
}
