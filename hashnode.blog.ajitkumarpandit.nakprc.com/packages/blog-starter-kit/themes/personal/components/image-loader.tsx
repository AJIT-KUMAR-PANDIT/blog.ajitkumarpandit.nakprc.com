import Image from 'next/image';
import { useState } from 'react';

type ImageLoaderProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  unoptimized?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoadingComplete?: () => void;
};

export const ImageLoader = ({ 
  src, 
  alt, 
  fill, 
  width, 
  height, 
  className = '', 
  priority = false,
  sizes,
  unoptimized = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoadingComplete,
  ...props 
}: ImageLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoadingComplete?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={fill ? "absolute inset-0 bg-gray-100 dark:bg-neutral-800 flex items-center justify-center rounded" : "bg-gray-100 dark:bg-neutral-800 flex items-center justify-center rounded w-full h-48"}>
        <div className="text-center text-gray-500 dark:text-neutral-400">
          <svg className="w-8 h-8 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs">Failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading skeleton */}
      {isLoading && (
        <div className={fill ? "absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 animate-pulse rounded flex items-center justify-center" : "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 animate-pulse rounded w-full h-48 flex items-center justify-center"}>
          <div className="flex flex-col items-center space-y-1 text-gray-400 dark:text-neutral-500">
            <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">Loading...</span>
          </div>
        </div>
      )}

      {/* Actual image */}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        sizes={sizes}
        unoptimized={unoptimized}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

// Hook for handling image loading state
export const useImageLoader = () => {
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  const addLoadingImage = (src: string) => {
    setLoadingImages(prev => new Set(prev).add(src));
  };

  const removeLoadingImage = (src: string) => {
    setLoadingImages(prev => {
      const next = new Set(prev);
      next.delete(src);
      return next;
    });
  };

  const isImageLoading = (src: string) => loadingImages.has(src);

  return {
    addLoadingImage,
    removeLoadingImage,
    isImageLoading,
    loadingCount: loadingImages.size
  };
};