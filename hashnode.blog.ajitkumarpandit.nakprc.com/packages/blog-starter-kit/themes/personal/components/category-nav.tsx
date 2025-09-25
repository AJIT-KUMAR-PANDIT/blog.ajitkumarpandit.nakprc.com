import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { PostFragment } from '../generated/graphql';

interface CategoryNavProps {
  posts: PostFragment[];
  activeCategory?: string;
  className?: string;
}

export const CategoryNav = ({ posts, activeCategory, className = '' }: CategoryNavProps) => {
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Extract unique tags from posts and sort by frequency
  const tagStats = posts.reduce((acc, post) => {
    post.tags?.forEach(tag => {
      if (!acc[tag.name]) {
        acc[tag.name] = { count: 0, slug: tag.slug };
      }
      acc[tag.name].count++;
    });
    return acc;
  }, {} as Record<string, { count: number; slug: string }>);

  const sortedTags = Object.entries(tagStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 12); // Limit to top 12 categories

  const handleScroll = () => {
    const element = scrollRef.current;
    if (!element) return;

    const { scrollLeft, scrollWidth, clientWidth } = element;
    setShowLeftGradient(scrollLeft > 0);
    setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    handleScroll();
    const element = scrollRef.current;
    element?.addEventListener('scroll', handleScroll);
    return () => element?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (direction: 'left' | 'right') => {
    const element = scrollRef.current;
    if (!element) return;

    const scrollAmount = 200;
    element.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (sortedTags.length === 0) return null;

  return (
    <div className={`relative bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="relative flex items-center">
          {/* Left gradient and scroll button */}
          {showLeftGradient && (
            <div className="absolute left-0 z-10 flex items-center">
              <div className="w-8 h-full bg-gradient-to-r from-white dark:from-neutral-900 to-transparent"></div>
              <button
                onClick={() => scrollTo('left')}
                className="absolute left-2 p-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                aria-label="Scroll left"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* Navigation items */}
          <div
            ref={scrollRef}
            className="flex items-center gap-1 px-4 py-3 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All Posts link */}
            <Link
              href="/posts"
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                !activeCategory
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 ring-2 ring-primary-200 dark:ring-primary-800'
                  : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                All Posts
                <span className="ml-1 px-2 py-0.5 bg-current text-white dark:text-gray-900 text-xs rounded-full opacity-20">
                  {posts.length}
                </span>
              </span>
            </Link>

            {/* Category links */}
            {sortedTags.map(([tagName, { count, slug }]) => (
              <Link
                key={tagName}
                href={`/tag/${slug}`}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap ${
                  activeCategory === tagName
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 ring-2 ring-primary-200 dark:ring-primary-800'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">📂</span>
                  {tagName}
                  <span className="ml-1 px-2 py-0.5 bg-current text-white dark:text-gray-900 text-xs rounded-full opacity-20">
                    {count}
                  </span>
                </span>
              </Link>
            ))}

            {/* View all categories */}
            <Link
              href="/posts"
              className="flex-shrink-0 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 whitespace-nowrap"
            >
              <span className="flex items-center gap-1">
                View all
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Right gradient and scroll button */}
          {showRightGradient && (
            <div className="absolute right-0 z-10 flex items-center">
              <div className="w-8 h-full bg-gradient-to-l from-white dark:from-neutral-900 to-transparent"></div>
              <button
                onClick={() => scrollTo('right')}
                className="absolute right-2 p-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                aria-label="Scroll right"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile indicator */}
      <div className="block md:hidden">
        <div className="flex justify-center py-1">
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, sortedTags.length + 1) }).map((_, i) => (
              <div
                key={i}
                className={`w-1 h-1 rounded-full ${
                  i === 0 ? 'bg-primary-500' : 'bg-gray-300 dark:bg-neutral-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};