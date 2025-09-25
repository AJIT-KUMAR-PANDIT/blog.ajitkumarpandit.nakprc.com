import React, { useState, useEffect } from 'react';
import { useAppContext } from './contexts/appContext';

export const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [progress, setProgress] = useState(0);
  const { publication } = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;
      setShowScrollTop(window.scrollY > 300);
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const pct = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0;
      setProgress(pct);
    };

    // initialize once on mount
    handleScroll();

    // listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true } as any);
      window.addEventListener('resize', handleScroll);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll as any);
        window.removeEventListener('resize', handleScroll as any);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const shareArticle = async () => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: publication.title,
          text: publication.descriptionSEO || `Check out ${publication.author.name}'s blog`,
          url: typeof window !== 'undefined' ? window.location.href : ''
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      // Fallback to clipboard
      const url = typeof window !== 'undefined' ? window.location.href : '';
      try {
        await navigator.clipboard.writeText(url);
      } catch (err) {
        console.log('Error copying to clipboard:', err);
      }
      // You could show a toast notification here
    }
  };

  const toggleTheme = () => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
      html.classList.remove('dark');
      if (typeof localStorage !== 'undefined') localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      if (typeof localStorage !== 'undefined') localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <>
      {/* Main FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-end gap-3">
          {/* Action buttons - show when main FAB is active */}
          <div className={`flex flex-col items-end gap-3 transition-all duration-300 ${showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="group relative flex items-center justify-center w-12 h-12 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-neutral-700/50 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
              title="Toggle theme"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-500 dark:hidden" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
                <svg className="w-5 h-5 text-blue-400 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </div>
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-2 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs rounded whitespace-nowrap">
                  Toggle theme
                </div>
              </div>
            </button>

            {/* Share Button */}
            <button
              onClick={shareArticle}
              className="group relative flex items-center justify-center w-12 h-12 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-neutral-700/50 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
              title="Share blog"
            >
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-2 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs rounded whitespace-nowrap">
                  Share
                </div>
              </div>
            </button>

            {/* Scroll to Top - only show when user has scrolled */}
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="group relative flex items-center justify-center w-12 h-12 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-neutral-700/50 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                title="Scroll to top"
              >
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="px-2 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs rounded whitespace-nowrap">
                    Back to top
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Main toggle button */}
          <button
            onClick={() => setShowActions(!showActions)}
            className={`group relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 ${showActions ? 'rotate-45' : ''}`}
            title="Quick actions"
          >
            <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
          </button>
        </div>
      </div>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-neutral-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`
          }}
        ></div>
      </div>

      {/* Mobile Quick Nav (bottom of screen) */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-t border-gray-200/50 dark:border-neutral-700/50 pb-safe">
        <div className="flex items-center justify-around py-3">
          <button 
            onClick={scrollToTop}
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button 
            onClick={shareArticle}
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="text-xs font-medium">Share</span>
          </button>
          
          <button 
            onClick={toggleTheme}
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
          >
            <svg className="w-5 h-5 dark:hidden" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
            <svg className="w-5 h-5 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <span className="text-xs font-medium">Theme</span>
          </button>
        </div>
      </div>
    </>
  );
};