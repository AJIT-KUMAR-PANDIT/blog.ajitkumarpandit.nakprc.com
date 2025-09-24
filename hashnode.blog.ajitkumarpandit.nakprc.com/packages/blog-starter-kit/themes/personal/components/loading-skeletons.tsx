// Skeleton Loading Components
export const PostCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 animate-pulse">
      {/* Title Skeleton */}
      <div className="space-y-3 mb-4">
        <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-4/5"></div>
        <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-3/5"></div>
      </div>
      
      {/* Brief Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-4/5"></div>
      </div>
      
      {/* Tags Skeleton */}
      <div className="flex space-x-2 mb-6">
        <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded-full w-14"></div>
      </div>
      
      {/* Meta Information Skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-800">
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-20"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-24"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-8"></div>
          <div className="h-5 w-5 bg-gray-200 dark:bg-neutral-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export const HeaderSkeleton = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-5 py-6">
        <div className="flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            {/* Avatar Skeleton */}
            <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
            <div className="space-y-2">
              {/* Title Skeleton */}
              <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-32"></div>
              {/* Subtitle Skeleton */}
              <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-20"></div>
            </div>
          </div>
          
          {/* Navigation Skeleton */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
            {/* Subscribe Button Skeleton */}
            <div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded-full w-20"></div>
          </div>
          
          {/* Mobile Menu Button Skeleton */}
          <div className="lg:hidden w-10 h-10 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
        </div>
      </div>
    </header>
  );
};

export const SearchSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Search Header Skeleton */}
      <div className="text-center space-y-4 mb-10">
        <div className="w-16 h-16 bg-gray-200 dark:bg-neutral-700 rounded-full mx-auto mb-4"></div>
        <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-48 mx-auto"></div>
        <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-64 mx-auto"></div>
      </div>
      
      {/* Search Input Skeleton */}
      <div className="h-16 bg-gray-200 dark:bg-neutral-700 rounded-2xl mb-10"></div>
      
      {/* Popular Topics Skeleton */}
      <div className="space-y-6">
        <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-32"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AboutSkeleton = () => {
  return (
    <div className="animate-pulse space-y-10">
      {/* Hero Section Skeleton */}
      <div className="text-center space-y-6">
        <div className="w-32 h-32 bg-gray-200 dark:bg-neutral-700 rounded-full mx-auto"></div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-48 mx-auto"></div>
          <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-64 mx-auto"></div>
        </div>
      </div>
      
      {/* Bio Section Skeleton */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 p-8">
        <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-24 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-4/5"></div>
        </div>
      </div>
      
      {/* Publication Info Skeleton */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-8 border border-primary-200 dark:border-primary-800">
        <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-32 mb-4"></div>
        <div className="space-y-4">
          <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-40"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-3/4"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-600">
              <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-8 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-20 mx-auto"></div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-600">
              <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-8 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-16 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Page transition component
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {children}
    </div>
  );
};

// Loading spinner for inline loading states
export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <svg className="w-full h-full text-primary-500" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

// Shimmer effect for images and content
export const ShimmerEffect = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative overflow-hidden bg-gray-200 dark:bg-neutral-700 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-300/60 dark:via-neutral-600/60 to-transparent"></div>
    </div>
  );
};