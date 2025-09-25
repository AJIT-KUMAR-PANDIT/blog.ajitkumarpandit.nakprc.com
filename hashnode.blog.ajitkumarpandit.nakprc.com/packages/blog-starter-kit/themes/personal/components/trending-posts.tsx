import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { PostFragment } from '../generated/graphql';

interface TrendingPostsProps {
  posts: PostFragment[];
  title?: string;
  maxPosts?: number;
}

export const TrendingPosts = ({ posts, title = "🔥 Trending Now", maxPosts = 5 }: TrendingPostsProps) => {
  const trendingPosts = posts
    .sort((a, b) => (b.comments?.totalDocuments || 0) - (a.comments?.totalDocuments || 0))
    .slice(0, maxPosts);

  if (trendingPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-red-500 to-orange-500"></div>
      </div>
      
      <div className="space-y-4">
        {trendingPosts.map((post, index) => (
          <Link
            key={post.id}
            href={`/${post.slug}`}
            className="group block"
          >
            <div className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all duration-200">
              {/* Ranking Number */}
              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                {index + 1}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2 leading-tight mb-1">
                  {post.title}
                </h4>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span>{post.comments?.totalDocuments || 0}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{post.readTimeInMinutes}m read</span>
                  </div>
                  
                  <span>·</span>
                  
                  <span>
                    {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                  </span>
                </div>
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag.slug}
                        className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded-full font-medium"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{post.tags.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {posts.length > maxPosts && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
          <Link
            href="/posts"
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1 group"
          >
            View all posts
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};