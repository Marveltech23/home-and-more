import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';

// In-memory registry of already-decoded image URLs so route transitions never flash skeletons
const loadedSrcRegistry = new Set();

export default function SafeImage({
  src,
  alt = '',
  className = '',
  aspectRatio = 'aspect-square',
  fallbackSrc = null,
  showPlaceholderIcon = true,
  loading = 'lazy',
  fit = 'cover', // 'cover' | 'contain'
  ...props
}) {
  const imgRef = useRef(null);
  const isInstant =
    typeof src === 'string' && (src.startsWith('data:') || loadedSrcRegistry.has(src));

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(!isInstant);

  // Reset error/loading state only when src actually changes
  useEffect(() => {
    setHasError(false);
    if (!src) {
      setIsLoading(false);
      return;
    }
    if (
      src.startsWith('data:') ||
      loadedSrcRegistry.has(src) ||
      (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0)
    ) {
      loadedSrcRegistry.add(src);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [src]);

  if (!src || hasError) {
    if (fallbackSrc && !hasError) {
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          loading={loading}
          decoding="async"
          className={`${className} object-${fit}`}
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
        <div className="absolute inset-0 bg-[#F8EBDD]/50 animate-pulse flex items-center justify-center" />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={isInstant ? undefined : loading}
        decoding="async"
        onLoad={() => {
          if (src) loadedSrcRegistry.add(src);
          setIsLoading(false);
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`w-full h-full object-${fit} transition-opacity duration-200 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        {...props}
      />
    </div>
  );
}
