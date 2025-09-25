import Image from 'next/image';
import { useState } from 'react';

interface SimpleImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  unoptimized?: boolean;
}

export const SimpleImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  fill, 
  className = '', 
  priority = false, 
  sizes,
  unoptimized = false 
}: SimpleImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`${className} bg-gray-100 dark:bg-neutral-800 flex items-center justify-center rounded border border-gray-200 dark:border-neutral-700 ${fill ? 'absolute inset-0' : width && height ? `w-[${width}px] h-[${height}px]` : 'w-full h-48'}`}>
        <div className="text-center text-gray-500 dark:text-neutral-400">
          <svg className="w-8 h-8 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs">Image failed</p>
        </div>
      </div>
    );
  }

  return (
    <div className={fill ? 'relative' : ''}>
      {isLoading && (
        <div className={`${fill ? 'absolute inset-0' : width && height ? `w-[${width}px] h-[${height}px]` : 'w-full h-48'} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 animate-pulse rounded flex items-center justify-center`}>
          <div className="text-gray-400 dark:text-neutral-500 text-center">
            <svg className="w-6 h-6 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs mt-1">Loading...</p>
          </div>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        priority={priority}
        sizes={sizes}
        unoptimized={unoptimized}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};