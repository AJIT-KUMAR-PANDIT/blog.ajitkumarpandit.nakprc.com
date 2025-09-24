import Image from 'next/image';
import { useState } from 'react';
import { ASSETS, SITE_CONFIG } from '../lib/constants';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export const Logo = ({ 
  className = "h-10 w-auto transition-transform duration-300 group-hover:scale-105", 
  width = 100, 
  height = 50,
  priority = false 
}: LogoProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fallback when image fails to load
  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-primary-600 text-white font-bold text-lg rounded-lg ${className}`}
           style={{ width: width, height: height }}>
        AKP
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div 
          className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${className}`}
          style={{ width: width, height: height }}
        />
      )}
      
      {/* Actual image */}
      <Image
        src={ASSETS.LOGO}
        alt={ASSETS.LOGO_ALT}
        width={width}
        height={height}
        className={`${className} ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        onError={() => {
          console.warn('Logo image failed to load, falling back to text logo');
          setImageError(true);
        }}
        onLoad={() => {
          setImageLoaded(true);
        }}
        // Add explicit unoptimized for production deployments that might have issues
        unoptimized={process.env.NODE_ENV === 'production'}
      />
    </div>
  );
};