import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle = ({ className = '', showLabel = true, size = 'md' }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className={`${getSizeClasses(size).icon} animate-pulse bg-gray-300 rounded-full`} />
        {showLabel && <div className={`${getSizeClasses(size).text} mt-1 h-3 w-12 animate-pulse bg-gray-300 rounded`} />}
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`group flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 focus:scale-95 focus:outline-none ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <div className={`relative ${getSizeClasses(size).icon} transition-all duration-300`}>
        {/* Sun Icon */}
        <svg
          className={`absolute inset-0 transition-all duration-500 transform ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          } text-amber-500 group-hover:text-amber-600`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
        
        {/* Moon Icon */}
        <svg
          className={`absolute inset-0 transition-all duration-500 transform ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          } text-slate-700 dark:text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-200`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
        </svg>
      </div>
      
      {showLabel && (
        <span className={`${getSizeClasses(size).text} mt-1 font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300`}>
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

function getSizeClasses(size: 'sm' | 'md' | 'lg') {
  switch (size) {
    case 'sm':
      return {
        icon: 'w-5 h-5',
        text: 'text-xs'
      };
    case 'lg':
      return {
        icon: 'w-8 h-8',
        text: 'text-base'
      };
    case 'md':
    default:
      return {
        icon: 'w-6 h-6',
        text: 'text-sm'
      };
  }
}