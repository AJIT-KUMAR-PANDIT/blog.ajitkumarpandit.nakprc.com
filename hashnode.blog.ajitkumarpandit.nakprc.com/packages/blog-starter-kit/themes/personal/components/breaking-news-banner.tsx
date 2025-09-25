import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PostFragment } from '../generated/graphql';
import { formatDistanceToNow } from 'date-fns';

interface BreakingNewsBannerProps {
  posts: PostFragment[];
  autoRotate?: boolean;
  rotationInterval?: number;
  className?: string;
}

export const BreakingNewsBanner = ({ 
  posts, 
  autoRotate = true, 
  rotationInterval = 5000,
  className = '' 
}: BreakingNewsBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Get the most recent posts for breaking news
  const breakingPosts = posts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  useEffect(() => {
    if (!autoRotate || breakingPosts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingPosts.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, breakingPosts.length, rotationInterval]);

  if (breakingPosts.length === 0 || !isVisible) {
    return null;
  }

  const currentPost = breakingPosts[currentIndex];

  return (
    <div className={`relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white overflow-hidden ${className}`}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
      </div>
      
      {/* Content */}
      <div className="relative px-4 py-3 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Breaking News Label */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="font-bold text-sm lg:text-base uppercase tracking-wide">
                🚨 Breaking
              </span>
              <div className="hidden sm:block h-4 w-px bg-white/30"></div>
            </div>

            {/* News Content */}
            <div className="flex-1 min-w-0">
              <Link 
                href={`/${currentPost.slug}`}
                className="group block"
              >
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-sm lg:text-base group-hover:underline truncate">
                    {currentPost.title}
                  </h3>
                  
                  {/* Metadata */}
                  <div className="hidden md:flex items-center gap-2 text-xs text-white/80 flex-shrink-0">
                    <time dateTime={new Date(currentPost.publishedAt).toISOString()} suppressHydrationWarning>
                      {formatDistanceToNow(new Date(currentPost.publishedAt), { addSuffix: true })}
                    </time>
                    {currentPost.readTimeInMinutes && (
                      <>
                        <span>•</span>
                        <span>{currentPost.readTimeInMinutes}m read</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            {/* Rotation indicators */}
            {breakingPosts.length > 1 && (
              <div className="hidden sm:flex items-center gap-1">
                {breakingPosts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      index === currentIndex 
                        ? 'bg-white' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Navigation buttons */}
            {breakingPosts.length > 1 && (
              <div className="hidden lg:flex items-center gap-1">
                <button
                  onClick={() => setCurrentIndex((prev) => 
                    prev === 0 ? breakingPosts.length - 1 : prev - 1
                  )}
                  className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
                  aria-label="Previous news"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % breakingPosts.length)}
                  className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
                  aria-label="Next news"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors duration-200 ml-2"
              aria-label="Close breaking news banner"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar for auto-rotation */}
      {autoRotate && breakingPosts.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: '100%' // Fixed width to avoid hydration mismatch with Date.now()
            }}
          ></div>
        </div>
      )}
    </div>
  );
};