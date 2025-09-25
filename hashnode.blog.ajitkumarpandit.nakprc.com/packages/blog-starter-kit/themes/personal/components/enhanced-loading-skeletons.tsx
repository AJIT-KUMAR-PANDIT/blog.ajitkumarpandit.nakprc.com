import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'hero' | 'card' | 'list' | 'trending' | 'categories';
  count?: number;
  className?: string;
}

export const EnhancedLoadingSkeleton = ({ 
  variant = 'card', 
  count = 1,
  className = "" 
}: LoadingSkeletonProps) => {
  
  const SkeletonBase = ({ children, className: baseClassName = "" }: { children?: React.ReactNode, className?: string }) => (
    <div className={`animate-pulse ${baseClassName}`}>
      {children}
    </div>
  );

  const ShimmerBox = ({ className: shimmerClassName = "" }: { className?: string }) => (
    <div className={`bg-gray-200 dark:bg-neutral-800 loading-shimmer rounded ${shimmerClassName}`}></div>
  );

  const HeroSkeleton = () => (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50/80 via-white to-primary-100/60 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <SkeletonBase className="max-w-7xl mx-auto px-5 py-20">
        <div className="text-center space-y-12">
          {/* Profile Image Skeleton */}
          <div className="space-y-8">
            <div className="relative inline-block">
              <div className="relative w-32 h-32 lg:w-40 lg:h-40 mx-auto">
                <ShimmerBox className="w-full h-full rounded-full" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 lg:w-10 lg:h-10">
                  <ShimmerBox className="w-full h-full rounded-full" />
                </div>
              </div>
            </div>
            
            {/* Title Skeleton */}
            <div className="space-y-4">
              <ShimmerBox className="h-16 lg:h-24 max-w-4xl mx-auto rounded-2xl" />
              <ShimmerBox className="h-8 max-w-2xl mx-auto rounded-xl" />
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="space-y-8">
            <ShimmerBox className="h-16 max-w-md mx-auto rounded-2xl" />
            <div className="flex items-center justify-center gap-12 lg:gap-16">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <ShimmerBox className="h-12 w-16 mx-auto rounded-xl" />
                  <ShimmerBox className="h-4 w-24 mx-auto rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ShimmerBox className="h-14 w-48 rounded-2xl" />
            <ShimmerBox className="h-14 w-56 rounded-2xl" />
          </div>
        </div>
      </SkeletonBase>
    </div>
  );

  const CardSkeleton = () => (
    <SkeletonBase className="group bg-white dark:bg-neutral-900 rounded-3xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm">
      {/* Image Skeleton */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <ShimmerBox className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Tags */}
        <div className="flex items-center gap-2">
          <ShimmerBox className="h-6 w-16 rounded-full" />
          <ShimmerBox className="h-4 w-8 rounded" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <ShimmerBox className="h-6 w-full rounded" />
          <ShimmerBox className="h-6 w-3/4 rounded" />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <ShimmerBox className="h-4 w-full rounded" />
          <ShimmerBox className="h-4 w-5/6 rounded" />
          <ShimmerBox className="h-4 w-2/3 rounded" />
        </div>

        {/* Author and meta */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <ShimmerBox className="w-8 h-8 rounded-full" />
            <div className="space-y-1">
              <ShimmerBox className="h-4 w-20 rounded" />
              <ShimmerBox className="h-3 w-16 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShimmerBox className="h-4 w-8 rounded" />
            <ShimmerBox className="h-4 w-10 rounded" />
          </div>
        </div>
      </div>
    </SkeletonBase>
  );

  const TrendingSkeleton = () => (
    <SkeletonBase className="group relative bg-white dark:bg-neutral-900 rounded-3xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-lg">
      {/* Trending Badge */}
      <div className="absolute top-4 left-4 z-20">
        <ShimmerBox className="h-8 w-32 rounded-full" />
      </div>

      {/* Featured Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <ShimmerBox className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShimmerBox className="h-6 w-20 rounded-full" />
        </div>

        <div className="space-y-2">
          <ShimmerBox className="h-6 w-full rounded" />
          <ShimmerBox className="h-6 w-4/5 rounded" />
        </div>

        <div className="space-y-2">
          <ShimmerBox className="h-4 w-full rounded" />
          <ShimmerBox className="h-4 w-3/4 rounded" />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <ShimmerBox className="w-8 h-8 rounded-full" />
            <div className="space-y-1">
              <ShimmerBox className="h-4 w-24 rounded" />
              <ShimmerBox className="h-3 w-16 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShimmerBox className="h-4 w-8 rounded" />
            <ShimmerBox className="h-4 w-12 rounded" />
          </div>
        </div>
      </div>
    </SkeletonBase>
  );

  const CategoriesSkeleton = () => (
    <SkeletonBase className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 shadow-sm">
      <div className="relative">
        <ShimmerBox className="w-16 h-16 rounded-2xl mb-4" />
        <ShimmerBox className="h-6 w-3/4 rounded mb-2" />
        <ShimmerBox className="h-4 w-1/2 rounded" />
      </div>
    </SkeletonBase>
  );

  const ListSkeleton = () => (
    <SkeletonBase className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700">
      <ShimmerBox className="w-16 h-16 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <ShimmerBox className="h-5 w-3/4 rounded" />
        <ShimmerBox className="h-4 w-1/2 rounded" />
        <div className="flex items-center gap-4">
          <ShimmerBox className="h-3 w-16 rounded" />
          <ShimmerBox className="h-3 w-12 rounded" />
        </div>
      </div>
    </SkeletonBase>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'hero':
        return <HeroSkeleton />;
      case 'trending':
        return <TrendingSkeleton />;
      case 'categories':
        return <CategoriesSkeleton />;
      case 'list':
        return <ListSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  if (variant === 'hero') {
    return renderSkeleton();
  }

  return (
    <div className={className}>
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

// Section-specific loading components
export const HeroLoadingSkeleton = () => (
  <EnhancedLoadingSkeleton variant="hero" />
);

export const PostsLoadingSkeleton = ({ count = 6 }: { count?: number }) => (
  <EnhancedLoadingSkeleton 
    variant="card" 
    count={count}
    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
  />
);

export const TrendingLoadingSkeleton = () => (
  <section className="py-16 bg-white dark:bg-neutral-950">
    <div className="max-w-7xl mx-auto px-5">
      <div className="text-center mb-12">
        <EnhancedLoadingSkeleton 
          variant="list"
          count={1}
          className="max-w-md mx-auto"
        />
      </div>
      <EnhancedLoadingSkeleton 
        variant="trending" 
        count={3}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      />
    </div>
  </section>
);

export const CategoriesLoadingSkeleton = () => (
  <section className="py-16 bg-gray-50 dark:bg-neutral-950">
    <div className="max-w-7xl mx-auto px-5">
      <div className="text-center mb-12">
        <EnhancedLoadingSkeleton 
          variant="list"
          count={1}
          className="max-w-md mx-auto"
        />
      </div>
      <EnhancedLoadingSkeleton 
        variant="categories" 
        count={8}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      />
    </div>
  </section>
);