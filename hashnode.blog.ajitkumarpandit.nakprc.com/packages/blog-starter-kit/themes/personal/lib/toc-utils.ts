import { TOCItem } from '../components/table-of-contents';

/**
 * Generate a unique ID from heading text
 */
export const generateHeadingId = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Extract headings from HTML content and return TOC items
 */
export const extractHeadingsFromHTML = (html: string): TOCItem[] => {
  if (!html) return [];

  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Select all heading elements (h2 through h6, excluding h1)
  const headings = tempDiv.querySelectorAll('h2, h3, h4, h5, h6');
  
  const tocItems: TOCItem[] = [];
  const usedIds = new Set<string>();
  
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1));
    const text = heading.textContent?.trim() || '';
    
    if (!text) return; // Skip empty headings
    
    let id = generateHeadingId(text);
    
    // Ensure unique IDs by appending numbers if needed
    let counter = 1;
    let uniqueId = id;
    while (usedIds.has(uniqueId)) {
      uniqueId = `${id}-${counter}`;
      counter++;
    }
    
    usedIds.add(uniqueId);
    
    tocItems.push({
      id: uniqueId,
      text,
      level,
    });
  });
  
  return tocItems;
};

/**
 * Extract headings from markdown content (before HTML conversion)
 */
export const extractHeadingsFromMarkdown = (markdown: string): TOCItem[] => {
  if (!markdown) return [];

  const lines = markdown.split('\n');
  const tocItems: TOCItem[] = [];
  const usedIds = new Set<string>();
  
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    // Match markdown headings (## to ######)
    const headingMatch = trimmedLine.match(/^(#{2,6})\s+(.+)$/);
    
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      
      if (!text) return; // Skip empty headings
      
      let id = generateHeadingId(text);
      
      // Ensure unique IDs
      let counter = 1;
      let uniqueId = id;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${id}-${counter}`;
        counter++;
      }
      
      usedIds.add(uniqueId);
      
      tocItems.push({
        id: uniqueId,
        text,
        level,
      });
    }
  });
  
  return tocItems;
};

/**
 * Add IDs to heading elements in the DOM
 */
export const addIdsToHeadings = (container: HTMLElement, tocItems: TOCItem[]): void => {
  const headings = container.querySelectorAll('h2, h3, h4, h5, h6');
  let tocIndex = 0;
  
  headings.forEach((heading) => {
    const text = heading.textContent?.trim() || '';
    
    if (text && tocIndex < tocItems.length) {
      const tocItem = tocItems[tocIndex];
      
      // Verify this is the correct heading by comparing text
      if (text === tocItem.text) {
        heading.id = tocItem.id;
        
        // Add scroll margin for better positioning when jumping to sections
        (heading as HTMLElement).style.scrollMarginTop = '100px';
        
        tocIndex++;
      }
    }
  });
};

/**
 * Build nested TOC structure (for hierarchical display)
 */
export const buildNestedTOC = (flatItems: TOCItem[]): TOCItem[] => {
  if (flatItems.length === 0) return [];

  const result: TOCItem[] = [];
  const stack: TOCItem[] = [];
  
  flatItems.forEach((item) => {
    const newItem = { ...item, children: [] };
    
    // Find the correct parent level
    while (stack.length > 0 && stack[stack.length - 1].level >= newItem.level) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      result.push(newItem);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(newItem);
    }
    
    stack.push(newItem);
  });
  
  return result;
};

/**
 * Get visible headings in viewport (for active section detection)
 */
export const getVisibleHeadings = (tocItems: TOCItem[]): string[] => {
  const visibleIds: string[] = [];
  
  tocItems.forEach((item) => {
    const element = document.getElementById(item.id);
    if (element) {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top <= window.innerHeight * 0.3 && rect.bottom >= 0;
      
      if (isVisible) {
        visibleIds.push(item.id);
      }
    }
  });
  
  return visibleIds;
};

/**
 * Smooth scroll to heading with offset
 */
export const scrollToHeading = (id: string, offset: number = 100): void => {
  const element = document.getElementById(id);
  if (!element) return;
  
  const elementPosition = element.offsetTop - offset;
  
  window.scrollTo({
    top: elementPosition,
    behavior: 'smooth',
  });
  
  // Update URL hash without triggering scroll
  const url = new URL(window.location.href);
  url.hash = id;
  window.history.replaceState(null, '', url.toString());
};

/**
 * Parse URL hash and scroll to corresponding heading on page load
 */
export const handleInitialScroll = (): void => {
  const hash = window.location.hash.substring(1);
  if (hash) {
    // Delay to ensure content is rendered
    setTimeout(() => {
      scrollToHeading(hash);
    }, 100);
  }
};