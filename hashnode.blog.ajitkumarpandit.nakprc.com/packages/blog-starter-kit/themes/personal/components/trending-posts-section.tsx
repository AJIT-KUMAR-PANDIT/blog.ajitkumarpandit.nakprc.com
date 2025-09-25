import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { PostFragment } from '../generated/graphql';
import { resizeImage } from '@starter-kit/utils/image';

interface TrendingPostsSectionProps {
  posts: PostFragment[];
  title?: string;
  showCount?: number;
  className?: string;
}

export const TrendingPostsSection = ({ 
  posts, 
  title = "🔥 Trending Stories",
  showCount = 3,
  className = "" 
}: TrendingPostsSectionProps) => {
  if (posts.length === 0) return null;

  const trendingPosts = posts.slice(0, showCount);

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-5">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Discover the most engaging stories that are capturing readers&apos; attention
          </p>
        </div>

        {/* Trending Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingPosts.map((post, index) => (
            <article
              key={post.id}
              className="group relative bg-white dark:bg-neutral-900 rounded-3xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Trending Badge */}
              <div className="absolute top-4 left-4 z-20">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  #{index + 1} TRENDING
                </div>
              </div>

              {/* Featured Image */}
              {post.coverImage?.url && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Link href={`/${post.slug}`}>
                    <Image
                      src={resizeImage(post.coverImage.url, { w: 600, h: 400, c: 'thumb' })}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </Link>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Floating stats */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {post.readTimeInMinutes}m read
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/tag/${post.tags[0].slug}`}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors duration-200"
                    >
                      {post.tags[0].name}
                    </Link>
                    {post.tags.length > 1 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        +{post.tags.length - 1}
                      </span>
                    )}
                  </div>
                )}

                {/* Title */}
                <Link href={`/${post.slug}`}>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 leading-tight transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                {post.brief && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {post.brief}
                  </p>
                )}

                {/* Author and meta */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-800">
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
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {post.author.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <time dateTime={new Date(post.publishedAt).toISOString()} suppressHydrationWarning>
                          {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                        </time>
                      </p>
                    </div>
                  </div>

                  {/* Engagement stats */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      </svg>
                      <span>{post.comments?.totalDocuments || 0}</span>
                    </div>
                    {/* Removed non-deterministic random value to avoid hydration mismatch */}
                  </div>
                </div>
              </div>

              {/* Bottom accent with fire animation */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 animate-pulse"></div>
              </div>
            </article>
          ))}
        </div>

        {/* View all trending link */}
        <div className="text-center mt-12">
          <Link 
            href="/posts"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <span>View All Trending</span>
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};