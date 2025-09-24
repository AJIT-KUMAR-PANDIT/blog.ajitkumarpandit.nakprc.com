import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import request from 'graphql-request';
import { useRouter } from 'next/router';
import { Container } from '../components/container';
import { AppProvider } from '../components/contexts/appContext';
import { Layout } from '../components/layout';
import { MinimalPostPreview } from '../components/minimal-post-preview';
import { TopNav } from '../components/top-nav';
import {
  PostsByPublicationDocument,
  PostsByPublicationQuery,
  PostsByPublicationQueryVariables,
  PostFragment,
  PublicationFragment,
} from '../generated/graphql';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

type Props = {
  publication: PublicationFragment;
  posts: PostFragment[];
};

type SearchFilters = {
  author: string;
  tag: string;
  dateRange: 'all' | 'week' | 'month' | '3months' | 'year';
  sortBy: 'relevance' | 'date' | 'popular';
};

export default function Search({ publication, posts }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    author: '',
    tag: '',
    dateRange: 'all',
    sortBy: 'relevance',
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history from localStorage
  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
    const savedRecent = localStorage.getItem('recentSearches');
    if (savedRecent) {
      setRecentSearches(JSON.parse(savedRecent));
    }
    
    // Get search query from URL if present
    const query = router.query.q as string;
    if (query) {
      setSearchQuery(query);
    }
  }, [router.query.q]);

  // Generate search suggestions based on existing content
  const generateSuggestions = useCallback((query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const suggestions = new Set<string>();

    // Add matching titles
    posts.forEach(post => {
      if (post.title.toLowerCase().includes(searchTerm)) {
        suggestions.add(post.title);
      }
      // Add matching tags
      post.tags?.forEach(tag => {
        if (tag.name.toLowerCase().includes(searchTerm)) {
          suggestions.add(tag.name);
        }
      });
      // Add matching authors
      if (post.author.name.toLowerCase().includes(searchTerm)) {
        suggestions.add(post.author.name);
      }
    });

    setSearchSuggestions(Array.from(suggestions).slice(0, 5));
  }, [posts]);

  // Get unique authors and tags for filters
  const { uniqueAuthors, uniqueTags } = useMemo(() => {
    const authors = new Set<string>();
    const tags = new Set<string>();
    
    posts.forEach(post => {
      authors.add(post.author.name);
      post.tags?.forEach(tag => tags.add(tag.name));
    });
    
    return {
      uniqueAuthors: Array.from(authors).sort(),
      uniqueTags: Array.from(tags).sort(),
    };
  }, [posts]);

  // Enhanced filtering with date range and sorting
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    let filtered = posts.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(query) ||
        post.brief?.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.name.toLowerCase().includes(query));
      
      const matchesAuthor = !filters.author || post.author.name === filters.author;
      const matchesTag = !filters.tag || post.tags?.some(tag => tag.name === filters.tag);
      
      // Date range filtering
      let matchesDate = true;
      if (filters.dateRange !== 'all') {
        const postDate = new Date(post.publishedAt);
        const now = new Date();
        const timeDiff = now.getTime() - postDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        
        switch (filters.dateRange) {
          case 'week':
            matchesDate = daysDiff <= 7;
            break;
          case 'month':
            matchesDate = daysDiff <= 30;
            break;
          case '3months':
            matchesDate = daysDiff <= 90;
            break;
          case 'year':
            matchesDate = daysDiff <= 365;
            break;
        }
      }
      
      return matchesSearch && matchesAuthor && matchesTag && matchesDate;
    });

    // Sorting
    return filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'popular':
          return (b.comments?.totalDocuments || 0) - (a.comments?.totalDocuments || 0);
        case 'relevance':
        default:
          // Simple relevance scoring based on title match
          const aScore = a.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 1;
          const bScore = b.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 1;
          return bScore - aScore;
      }
    });
  }, [posts, searchQuery, filters]);

  // Save search to history
  const saveSearchToHistory = (query: string) => {
    if (!query.trim()) return;
    
    const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
    const newRecent = [query, ...recentSearches.filter(item => item !== query)].slice(0, 5);
    
    setSearchHistory(newHistory);
    setRecentSearches(newRecent);
    
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
  };

  // Update URL when search query changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    generateSuggestions(value);
    setShowSuggestions(value.length >= 2);
    
    if (value.trim()) {
      router.replace(`/search?q=${encodeURIComponent(value)}`, undefined, {
        shallow: true,
      });
    } else {
      router.replace('/search', undefined, { shallow: true });
      setShowSuggestions(false);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setShowSuggestions(false);
    saveSearchToHistory(query);
    router.replace(`/search?q=${encodeURIComponent(query)}`, undefined, {
      shallow: true,
    });
  };

  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  if (!mounted) return null;

  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>Search - {publication.title}</title>
          <meta
            name="description"
            content={`Search articles on ${publication.title}`}
          />
        </Head>

        <TopNav />
        <Container className="mx-auto max-w-4xl px-4 sm:px-5 py-6 sm:py-10 pt-20 sm:pt-24 min-h-screen">
          <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 w-full overflow-hidden">
          {/* Search Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Search Articles
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto px-4">
              Find articles, tutorials, and insights from {publication.title}
            </p>
          </div>

          {/* Search Input with Suggestions */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  handleSearchSubmit(searchQuery);
                }
                if (e.key === 'Escape') {
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search articles, authors, tags..."
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-4 py-3 sm:py-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl sm:rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base sm:text-lg"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 min-w-[44px] justify-center"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-lg z-10">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchSubmit(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-neutral-800 first:rounded-t-xl last:rounded-b-xl transition-colors duration-200 flex items-center space-x-3"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-gray-900 dark:text-white break-words">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Advanced Search Filters */}
          {searchQuery.trim() && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Filter Results
                </h3>
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
                >
                  {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-4 w-full overflow-x-auto">
                {/* Sort By */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 min-w-0 max-w-xs"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="date">Sort by Date</option>
                  <option value="popular">Sort by Popularity</option>
                </select>
                
                {/* Date Range */}
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                  className="px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 min-w-0 max-w-xs"
                >
                  <option value="all">Any time</option>
                  <option value="week">Past week</option>
                  <option value="month">Past month</option>
                  <option value="3months">Past 3 months</option>
                  <option value="year">Past year</option>
                </select>
              </div>
              
              {showAdvancedFilters && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-neutral-800 w-full overflow-x-auto">
                  {/* Author Filter */}
                  <select
                    value={filters.author}
                    onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                    className="px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 min-w-0 max-w-xs"
                  >
                    <option value="">Any author</option>
                    {uniqueAuthors.map(author => (
                      <option key={author} value={author}>{author}</option>
                    ))}
                  </select>
                  
                  {/* Tag Filter */}
                  <select
                    value={filters.tag}
                    onChange={(e) => setFilters(prev => ({ ...prev, tag: e.target.value }))}
                    className="px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 min-w-0 max-w-xs"
                  >
                    <option value="">Any tag</option>
                    {uniqueTags.slice(0, 10).map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  
                  {/* Clear Filters */}
                  <button
                    onClick={() => setFilters({ author: '', tag: '', dateRange: 'all', sortBy: 'relevance' })}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Search Results */}
          {searchQuery.trim() && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Search Results
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'}
                </span>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="space-y-4">
                  {filteredPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="opacity-0 animate-in slide-in-from-bottom-4 duration-500"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'forwards',
                      }}
                    >
                      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:border-primary-200 dark:hover:border-primary-800 overflow-hidden">
                        <div className="p-6">
                          {/* Article Title with Highlighting */}
                          <div className="mb-3">
                            <Link 
                              href={`/${post.slug}`}
                              className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 line-clamp-2 break-words"
                            >
                              {highlightText(post.title, searchQuery)}
                            </Link>
                          </div>
                          
                          {/* Enhanced Metadata */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="font-medium break-words">{highlightText(post.author.name, searchQuery)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                            </div>
                            {post.readTimeInMinutes && (
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <span>{post.readTimeInMinutes} min read</span>
                              </div>
                            )}
                            {post.comments?.totalDocuments && post.comments.totalDocuments > 0 && (
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>{post.comments.totalDocuments} comments</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Article Brief with Highlighting */}
                          {post.brief && (
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 mb-4 break-words">
                              {highlightText(post.brief, searchQuery)}
                            </p>
                          )}
                          
                          {/* Enhanced Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.slice(0, 5).map((tag) => (
                                <Link
                                  key={tag.slug}
                                  href={`/tag/${tag.slug}`}
                                  className="inline-flex items-center text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors duration-200"
                                >
                                  <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                  </svg>
                                  <span className="break-words">{highlightText(tag.name, searchQuery)}</span>
                                </Link>
                              ))}
                              {post.tags.length > 5 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                                  +{post.tags.length - 5} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Cover Image */}
                        {post.coverImage?.url && (
                          <div className="aspect-video bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                            <Link href={`/${post.slug}`}>
                              <img 
                                src={post.coverImage.url} 
                                alt={post.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Try adjusting your search terms or browse all articles.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
                  >
                    Browse All Articles
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Recent Searches and Popular Topics */}
          {!searchQuery.trim() && (
            <div className="space-y-6 sm:space-y-8">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      Recent Searches
                    </h2>
                    <button
                      onClick={() => {
                        setRecentSearches([]);
                        setSearchHistory([]);
                        localStorage.removeItem('recentSearches');
                        localStorage.removeItem('searchHistory');
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full overflow-hidden">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSubmit(search)}
                        className="inline-flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors duration-200 text-sm max-w-xs overflow-hidden"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="truncate break-words min-w-0" title={search}>
                          {search.length > 20 ? `${search.substring(0, 20)}...` : search}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Popular Topics */}
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Popular Topics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full overflow-hidden">
                  {/* Extract unique tags from posts */}
                  {Array.from(
                    new Set(
                      posts
                        .flatMap((post) => post.tags || [])
                        .map((tag) => tag.name)
                    )
                  )
                    .slice(0, 9)
                    .map((tagName, index) => (
                      <button
                        key={tagName}
                        onClick={() => handleSearchSubmit(tagName)}
                        className="p-3 sm:p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all duration-200 text-left group min-h-[48px] w-full overflow-hidden"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 w-full min-w-0">
                          <div className="w-2 h-2 bg-primary-500 rounded-full group-hover:scale-125 transition-transform duration-200 flex-shrink-0" />
                          <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate min-w-0 break-words" title={tagName}>
                            {tagName.length > 25 ? `${tagName.substring(0, 25)}...` : tagName}
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
              
              {/* Search Tips */}
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/10 dark:to-primary-800/10 rounded-xl p-6 border border-primary-200 dark:border-primary-800/30">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">
                      Search Tips
                    </h3>
                    <ul className="text-sm text-primary-700 dark:text-primary-300 space-y-1">
                      <li>• Use quotes for exact phrases: &ldquo;React components&rdquo;</li>
                      <li>• Search by author name or tag to find specific content</li>
                      <li>• Use the filters to narrow down results by date or popularity</li>
                      <li>• Try different keywords if you don&rsquo;t find what you&rsquo;re looking for</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </Container>
      </Layout>
    </AppProvider>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await request<PostsByPublicationQuery, PostsByPublicationQueryVariables>(
    GQL_ENDPOINT,
    PostsByPublicationDocument,
    {
      first: 50, // Get posts for better search results (API limit is 50)
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
    }
  );

  const publication = data.publication;
  if (!publication) {
    return {
      notFound: true,
    };
  }

  const posts = (publication.posts.edges ?? []).map((edge) => edge.node);

  return {
    props: {
      publication,
      posts,
    },
    revalidate: 3600, // Revalidate every hour
  };
};