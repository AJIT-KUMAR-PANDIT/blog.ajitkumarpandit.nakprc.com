import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAppContext } from './contexts/appContext';

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

const ThemeIcon = ({ active }: { active: boolean }) => (
  <svg 
    className={`w-6 h-6 transition-all duration-300 ${active ? 'text-primary-500' : 'text-gray-500'}`} 
    fill={active ? 'currentColor' : 'none'} 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export const BottomNavigation = () => {
  const router = useRouter();
  const { publication } = useAppContext();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Initialize theme
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  if (!mounted) return null;

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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-neutral-800 safe-area-pb">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href || 
              (item.name === 'home' && router.pathname === '/');
            
            return (
              <Link 
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center p-2 min-w-[64px] relative group"
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
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center justify-center p-2 min-w-[64px] group"
            aria-label="Toggle theme"
          >
            <div className="transition-all duration-300 transform group-hover:scale-105 group-active:scale-95">
              <ThemeIcon active={false} />
            </div>
            <span className="text-xs mt-1 font-medium text-gray-500 dark:text-gray-400">
              Theme
            </span>
          </button>
        </div>
      </div>
      
      {/* Floating Action Button for Quick Actions */}
      <div className="absolute -top-8 right-6">
        <button className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-3 shadow-lg transform transition-all duration-300 hover:scale-110 focus:scale-105">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </nav>
  );
};