import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { useAppContext } from './contexts/appContext';
import { ThemeToggle } from './theme-toggle';

interface NavItem {
  name: string;
  href: string;
  icon: (active: boolean) => JSX.Element;
  label: string;
}

// Modern SVG Icons
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg 
    className={`w-6 h-6 transition-all duration-300 ${active ? 'text-primary-500' : 'text-gray-500'}`} 
    fill={active ? 'currentColor' : 'none'} 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const PostsIcon = ({ active }: { active: boolean }) => (
  <svg 
    className={`w-6 h-6 transition-all duration-300 ${active ? 'text-primary-500' : 'text-gray-500'}`} 
    fill={active ? 'currentColor' : 'none'} 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const SearchIcon = ({ active }: { active: boolean }) => (
  <svg 
    className={`w-6 h-6 transition-all duration-300 ${active ? 'text-primary-500' : 'text-gray-500'}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const AboutIcon = ({ active }: { active: boolean }) => (
  <svg 
    className={`w-6 h-6 transition-all duration-300 ${active ? 'text-primary-500' : 'text-gray-500'}`} 
    fill={active ? 'currentColor' : 'none'} 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);


export const BottomNavigation = () => {
  const router = useRouter();
  const { publication } = useAppContext();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle subscribe button click - same as desktop
  const handleSubscribeClick = () => {
    setShowQuickActions(false);
    const subscribeSection = document.getElementById('subscribe');
    if (subscribeSection) {
      subscribeSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If no subscribe section on current page, go to homepage where it exists
      window.location.href = '/#subscribe';
    }
  };

  // Handle share button click
  const handleShareClick = async () => {
    setShowQuickActions(false);
    const currentUrl = window.location.href;
    
    if (navigator.share) {
      // Use native share API on mobile
      try {
        await navigator.share({
          title: document.title,
          url: currentUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(currentUrl);
        // You could show a toast notification here
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
      // Prevent body scroll on mobile when menu is open
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

  const navItems: NavItem[] = [
    {
      name: 'home',
      href: '/',
      icon: (active) => <HomeIcon active={active} />,
      label: 'Home'
    },
    {
      name: 'posts',
      href: '/posts',
      icon: (active) => <PostsIcon active={active} />,
      label: 'Posts'
    },
    {
      name: 'search',
      href: '/search',
      icon: (active) => <SearchIcon active={active} />,
      label: 'Search'
    },
    {
      name: 'about',
      href: '/about',
      icon: (active) => <AboutIcon active={active} />,
      label: 'About'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-neutral-800 safe-area-pb lg:bg-transparent lg:border-t-0 lg:backdrop-blur-0">
      <div className="max-w-md mx-auto px-4 py-3 lg:hidden">
        <div className="flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href || 
              (item.name === 'home' && router.pathname === '/');
            
            return (
              <Link 
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center p-2 min-w-[64px] min-h-[52px] relative group active:bg-gray-100 dark:active:bg-neutral-800 rounded-lg transition-colors duration-200"
                aria-label={`Navigate to ${item.label}`}
              >
                <div className={`transition-all duration-300 transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {item.icon(isActive)}
                </div>
                <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                  isActive 
                    ? 'text-primary-500' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full" />
                )}
              </Link>
            );
          })}
          
          {/* Theme Toggle Button */}
          <div className="min-w-[64px] min-h-[52px] flex items-center justify-center">
            <ThemeToggle className="p-2" showLabel={true} size="md" />
          </div>
        </div>
      </div>
      
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
            className="absolute bottom-16 right-4 z-50 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 p-4 animate-in slide-in-from-bottom-4 duration-200 lg:bottom-20 lg:right-0"
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
      
      {/* + Button - Visible on both mobile and desktop */}
      <div className="absolute -top-8 right-6 lg:fixed lg:bottom-8 lg:right-8 lg:top-auto">
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
    </nav>
  );
};