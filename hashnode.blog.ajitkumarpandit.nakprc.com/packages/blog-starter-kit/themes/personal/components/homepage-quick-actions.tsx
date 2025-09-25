import { useState, useEffect, useRef } from 'react';
import { useAppContext } from './contexts/appContext';

export const HomepageQuickActions = () => {
  const { publication } = useAppContext();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle subscribe button click
  const handleSubscribeClick = () => {
    setShowQuickActions(false);
    const subscribeSection = document.getElementById('subscribe');
    if (subscribeSection) {
      subscribeSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#subscribe';
    }
  };

  // Handle share button click
  const handleShareClick = async () => {
    setShowQuickActions(false);
    const currentUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: publication.title,
          text: publication.descriptionSEO || `Check out ${publication.author.name}'s blog`,
          url: currentUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        alert('URL copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy URL');
      }
    }
  };

  // Close menu when clicking outside or on escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowQuickActions(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowQuickActions(false);
      }
    };

    if (showQuickActions) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showQuickActions]);

  return (
    <>
      {/* Quick Actions Menu */}
      {showQuickActions && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowQuickActions(false)}
          />
          
          {/* Quick Actions Panel */}
          <div 
            ref={menuRef}
            className="fixed bottom-20 right-6 z-50 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 p-4 animate-in slide-in-from-bottom-4 duration-200 lg:bottom-16 lg:right-8"
          >
            <div className="flex items-center gap-3">
              {/* Share Button */}
              <button
                onClick={handleShareClick}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors duration-200"
                aria-label="Share current page"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              
              {/* Subscribe Button */}
              <button
                onClick={handleSubscribeClick}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors duration-200"
                aria-label="Subscribe to newsletter"
              >
                <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Homepage + Button */}
      <div className="fixed bottom-8 right-6 z-50 lg:bottom-8 lg:right-8">
        <button 
          onClick={() => setShowQuickActions(!showQuickActions)}
          className={`bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-full p-3 shadow-lg transform transition-all duration-300 hover:scale-110 focus:scale-105 active:scale-95 min-w-[52px] min-h-[52px] flex items-center justify-center ${
            showQuickActions ? 'rotate-45 bg-primary-600 shadow-xl' : ''
          }`}
          aria-label={showQuickActions ? 'Close quick actions menu' : 'Open quick actions menu'}
          aria-expanded={showQuickActions}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </>
  );
};