import React, { useEffect, useState, useRef } from 'react';
import ChevronDownSVG from './icons/svgs/ChevronDownSVG';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
}

interface TableOfContentsProps {
  content?: string;
  className?: string;
  showOnMobile?: boolean;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  content,
  className = '',
  showOnMobile = false,
}) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const observer = useRef<IntersectionObserver>();

  // Generate unique ID from heading text
  const generateId = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  // Extract headings from the actual rendered content in the DOM
  useEffect(() => {
    // Small delay to ensure content is fully rendered
    const timer = setTimeout(() => {
      const contentContainer = document.querySelector('.hashnode-content-style');
      
      if (!contentContainer) {
        const altContainer = document.querySelector('article') || document.querySelector('.prose');
        if (!altContainer) {
          return;
        }
      }

      const targetContainer = contentContainer || document.querySelector('article') || document.querySelector('.prose');
      const headings = targetContainer?.querySelectorAll('h2, h3, h4, h5, h6');
      
      const items: TOCItem[] = [];
      const usedIds = new Set<string>();
      
      if (!headings) {
        return;
      }
      
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.substring(1));
        const text = heading.textContent?.trim() || '';
        
        if (!text) return; // Skip empty headings
        
        let id = generateId(text);
        
        // Ensure we have a valid ID
        if (!id) {
          id = `heading-${level}-${items.length + 1}`;
        }
        
        // Ensure unique IDs by appending numbers if needed
        let counter = 1;
        let uniqueId = id;
        while (usedIds.has(uniqueId) || document.getElementById(uniqueId)) {
          uniqueId = `${id}-${counter}`;
          counter++;
        }
        
        usedIds.add(uniqueId);
        
        // Add the ID to the heading element
        heading.id = uniqueId;
        
        // Add scroll margin for better positioning
        (heading as HTMLElement).style.scrollMarginTop = '100px';
        (heading as HTMLElement).style.paddingTop = '20px';
        (heading as HTMLElement).style.marginTop = '-20px';
        
        items.push({
          id: uniqueId,
          text,
          level,
        });
      });
      
      console.log('TableOfContents: Generated TOC items:', items.map(item => ({ id: item.id, text: item.text, level: item.level })));
      setTocItems(items);
    }, 500); // Delay to ensure all content is rendered

    return () => clearTimeout(timer);
  }, [content]);

  // Set up intersection observer for active section highlighting
  useEffect(() => {
    if (tocItems.length === 0) return;

    const headingElements = tocItems.map(item => document.getElementById(item.id)).filter(Boolean);
    
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        // Find the entry that's most visible
        let bestEntry = null;
        let bestRatio = 0;
        
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestEntry = entry;
            bestRatio = entry.intersectionRatio;
          }
        });
        
        if (bestEntry) {
          setActiveId(bestEntry.target.id);
        }
      },
      {
        rootMargin: '-100px 0px -60% 0px', // Top margin matches our scroll offset
        threshold: [0, 0.1, 0.5, 1.0],
      }
    );

    headingElements.forEach((element) => {
      if (element && observer.current) {
        observer.current.observe(element);
      }
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [tocItems]);

  // Smooth scroll to heading
  const scrollToHeading = (id: string) => {
    let element = document.getElementById(id);
    
    // If element not found, try to find it by text content as fallback
    if (!element) {
      const tocItem = tocItems.find(item => item.id === id);
      if (tocItem) {
        const allHeadings = document.querySelectorAll('h2, h3, h4, h5, h6');
        element = Array.from(allHeadings).find(h => 
          h.textContent?.trim() === tocItem.text
        ) as HTMLElement;
        
        // If found, assign the ID
        if (element) {
          element.id = id;
        }
      }
    }
    
    if (element) {
      // Calculate proper offset accounting for fixed header and additional spacing
      const headerHeight = 80; // Adjust based on your header height
      const additionalOffset = 20; // Extra space for better readability
      const totalOffset = headerHeight + additionalOffset;
      
      // Get the element's position relative to the viewport
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetPosition = rect.top + scrollTop - totalOffset;
      
      window.scrollTo({
        top: Math.max(0, targetPosition), // Ensure we don't scroll past the top
        behavior: 'smooth',
      });
      
      // Update URL hash
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', `#${id}`);
      }
    } else {
      console.warn(`TableOfContents: Could not find heading with ID: ${id}`);
    }
    
    // Close mobile menu after click
    if (showOnMobile) {
      setIsOpen(false);
    }
  };

  // Don't render if no TOC items
  if (tocItems.length === 0) {
    return null;
  }

  // Render TOC item with full text display (no truncation)
  const renderTOCItem = (item: TOCItem) => {
    const isActive = activeId === item.id;
    // Use more precise indentation for better hierarchy visualization
    const indentClass = item.level === 2 ? '' : 
                       item.level === 3 ? 'ml-3' :
                       item.level === 4 ? 'ml-6' :
                       item.level === 5 ? 'ml-9' : 'ml-12';
    
    // Different font sizes for different levels
    const fontSizeClass = item.level === 2 ? 'text-sm font-medium' :
                         item.level === 3 ? 'text-sm' :
                         'text-xs';
    
    return (
      <li key={item.id} className={`${indentClass}`}>
        <button
          onClick={() => scrollToHeading(item.id)}
          className={`
            block w-full text-left py-3 px-3 ${fontSizeClass} rounded-md transition-all duration-200
            hover:bg-primary-50 dark:hover:bg-primary-900/20
            hover:text-primary-700 dark:hover:text-primary-300
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
            ${isActive 
              ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 border-l-2 border-primary-500' 
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }
          `}
        >
          <span className="block leading-relaxed break-words hyphens-auto" lang="en">
            {item.text}
          </span>
        </button>
      </li>
    );
  };

  return (
    <nav className={`table-of-contents ${className}`}>
      {/* Desktop Version */}
      <div className={`${showOnMobile ? 'hidden' : 'hidden xl:block'}`}>
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="desktop-toc bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300 w-80">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-5 flex items-center">
              <span className="w-1.5 h-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full mr-3 shadow-sm"></span>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Table of Contents
              </span>
            </h3>
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
              <ul className="space-y-2">
                {tocItems.map(renderTOCItem)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      {showOnMobile && (
        <div className="xl:hidden mb-8">
          <div className="mobile-toc bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200 rounded-t-xl"
            >
              <div className="flex items-center">
                <span className="w-1.5 h-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full mr-3 shadow-sm"></span>
                <h3 className="text-lg font-semibold">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                    Table of Contents
                  </span>
                  {tocItems.length > 0 && (
                    <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                      ({tocItems.length} sections)
                    </span>
                  )}
                </h3>
              </div>
              <ChevronDownSVG 
                className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            
            {isOpen && (
              <div className="px-4 pb-4 border-t border-gray-200/60 dark:border-gray-700/60 bg-gray-50/30 dark:bg-gray-800/30 rounded-b-xl">
                <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
                  <ul className="space-y-2 mt-4">
                    {tocItems.map(renderTOCItem)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TableOfContents;