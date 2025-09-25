import React from 'react';
import Link from 'next/link';
import { PostFragment } from '../generated/graphql';

interface FeaturedCategoriesProps {
  posts: PostFragment[];
  className?: string;
}

export const FeaturedCategories = ({ posts, className = "" }: FeaturedCategoriesProps) => {
  // Extract unique categories from posts
  const categories = React.useMemo(() => {
    const categoryMap = new Map();
    
    posts.forEach(post => {
      post.tags?.forEach(tag => {
        if (categoryMap.has(tag.slug)) {
          categoryMap.get(tag.slug).count += 1;
        } else {
          categoryMap.set(tag.slug, {
            name: tag.name,
            slug: tag.slug,
            count: 1
          });
        }
      });
    });

    return Array.from(categoryMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Show top 8 categories
  }, [posts]);

  if (categories.length === 0) return null;

  // Predefined colors and icons for categories
  const categoryStyles = [
    { bg: 'from-blue-500 to-blue-600', icon: '💻' },
    { bg: 'from-green-500 to-green-600', icon: '🚀' },
    { bg: 'from-purple-500 to-purple-600', icon: '🎨' },
    { bg: 'from-red-500 to-red-600', icon: '⚡' },
    { bg: 'from-yellow-500 to-yellow-600', icon: '🌟' },
    { bg: 'from-indigo-500 to-indigo-600', icon: '🔬' },
    { bg: 'from-pink-500 to-pink-600', icon: '🎯' },
    { bg: 'from-teal-500 to-teal-600', icon: '🌊' },
  ];

  return (
    <section className={`py-16 bg-gray-50 dark:bg-neutral-950 ${className}`}>
      <div className="max-w-7xl mx-auto px-5">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-4">
            🎯 Explore Categories
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Dive deep into topics that matter to you
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const style = categoryStyles[index % categoryStyles.length];
            
            return (
              <Link
                key={category.slug}
                href={`/tag/${category.slug}`}
                className="group block"
              >
                <div className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                  {/* Background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  {/* Icon and gradient background */}
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${style.bg} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl">{style.icon}</span>
                    </div>
                    
                    {/* Category name */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-primary-600 dark:group-hover:from-white dark:group-hover:to-primary-400 transition-all duration-300">
                      {category.name}
                    </h3>
                    
                    {/* Post count */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{category.count} articles</span>
                      </div>
                    </div>
                    
                    {/* Hover arrow */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Bottom accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${style.bg} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-2xl`}></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* All Categories CTA */}
        <div className="text-center mt-12">
          <Link 
            href="/posts"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-neutral-900 border-2 border-gray-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600 text-gray-900 dark:text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <span>Browse All Categories</span>
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};