import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { PostFragment } from '../generated/graphql';
import { resizeImage } from '@starter-kit/utils/image';

interface EnhancedPostGridProps {
  posts: PostFragment[];
  layout?: 'grid' | 'masonry' | 'list';
  showExcerpt?: boolean;
  showMetrics?: boolean;
  className?: string;
}

export const EnhancedPostGrid = ({ 
  posts, 
  layout = 'grid',
  showExcerpt = true,
  showMetrics = true,
  className = '' 
}: EnhancedPostGridProps) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No articles found</h3>
        <p className="text-gray-600 dark:text-gray-400">Check back later for new content.</p>
      </div>
    );
  }

  const getGridClasses = () => {
    switch (layout) {
      case 'masonry':
        return 'columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8';
      case 'list':
        return 'space-y-8';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8';
    }
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {posts.map((post, index) => (
        <article
          key={post.id}
          className={`group bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${layout === 'masonry' ? 'break-inside-avoid' : ''}`}
        >
          {/* Featured Image */}
          {post.coverImage?.url && (
            <div className="relative aspect-[16/10] overflow-hidden">
              <Link href={`/${post.slug}`}>
                <Image
                  src={resizeImage(post.coverImage.url, { w: 600, h: 400, c: 'thumb' })}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </Link>
              
              {/* Overlay with reading time */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {post.readTimeInMinutes}m read
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                {post.tags.slice(0, 2).map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-md hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors duration-200"
                  >
                    {tag.name}
                  </Link>
                ))}
                {post.tags.length > 2 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    +{post.tags.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            <Link href={`/${post.slug}`}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 leading-tight mb-3 transition-colors duration-200 line-clamp-2">
                {post.title}
              </h3>
            </Link>

            {/* Excerpt */}
            {showExcerpt && post.brief && (
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                {post.brief}
              </p>
            )}

            {/* Author and Metadata */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {post.author.profilePicture && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-neutral-700">
                    <Image
                      src={resizeImage(post.author.profilePicture, { w: 64, h: 64, c: 'face' })}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {post.author.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              {showMetrics && (
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span>{post.comments?.totalDocuments || 0}</span>
                  </div>
                  
                  {!post.coverImage?.url && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{post.readTimeInMinutes}m</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom accent */}
          <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </article>
      ))}
    </div>
  );
};