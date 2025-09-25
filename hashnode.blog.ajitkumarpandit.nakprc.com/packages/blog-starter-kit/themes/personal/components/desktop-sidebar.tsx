import React from 'react';
import Link from 'next/link';
import { TrendingPosts } from './trending-posts';
import { NewsletterSubscription } from './newsletter-subscription';
import { PostFragment, PublicationFragment } from '../generated/graphql';
import { useAppContext } from './contexts/appContext';

interface DesktopSidebarProps {
  posts: PostFragment[];
  className?: string;
}

export const DesktopSidebar = ({ posts, className = '' }: DesktopSidebarProps) => {
  const { publication } = useAppContext();

  return (
    <aside className={`space-y-8 ${className}`}>
      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl border border-primary-200 dark:border-primary-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-primary-700 dark:text-primary-300">Blog Stats</h3>
            <p className="text-sm text-primary-600 dark:text-primary-400">Live data</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white dark:bg-neutral-800/50 rounded-xl">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {publication.postsCount?.totalDocuments || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Articles</div>
          </div>
          <div className="text-center p-3 bg-white dark:bg-neutral-800/50 rounded-xl">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {publication.followersCount || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
          </div>
        </div>
      </div>

      {/* Trending Posts */}
      <TrendingPosts posts={posts} maxPosts={5} />

      {/* Newsletter Subscription */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Stay Updated</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Get the latest posts</p>
            </div>
          </div>
          
          <NewsletterSubscription 
            publicationId={publication.id} 
            includeAnchor={false}
          />
        </div>
      </div>

      {/* Social Links */}
      {(publication.author.socialMediaLinks?.twitter || 
        publication.author.socialMediaLinks?.github || 
        publication.author.socialMediaLinks?.linkedin ||
        publication.author.socialMediaLinks?.website) && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">🔗 Connect</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {publication.author.socialMediaLinks?.twitter && (
              <a
                href={publication.author.socialMediaLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors duration-200 group"
              >
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Twitter</span>
              </a>
            )}
            
            {publication.author.socialMediaLinks?.github && (
              <a
                href={publication.author.socialMediaLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/20 hover:bg-gray-100 dark:hover:bg-gray-900/40 rounded-xl transition-colors duration-200 group"
              >
                <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</span>
              </a>
            )}
            
            {publication.author.socialMediaLinks?.linkedin && (
              <a
                href={publication.author.socialMediaLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors duration-200 group"
              >
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">LinkedIn</span>
              </a>
            )}
            
            {publication.author.socialMediaLinks?.website && (
              <a
                href={publication.author.socialMediaLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-xl transition-colors duration-200 group"
              >
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9a9 9 0 01-9-9m9 9c0-4.97-4.03-9-9-9" />
                </svg>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Website</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Categories/Tags Cloud */}
      {posts.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">🏷️ Popular Tags</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500 to-pink-500"></div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(posts.flatMap(post => post.tags?.map(tag => tag.name) || [])))
              .slice(0, 12)
              .map((tag, index) => (
                <Link
                  key={tag}
                  href={`/tag/${tag.toLowerCase()}`}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-neutral-800 hover:bg-primary-100 dark:hover:bg-primary-900/20 text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 text-sm rounded-full transition-all duration-200 hover:scale-105"
                >
                  #{tag}
                </Link>
              ))}
          </div>
        </div>
      )}
    </aside>
  );
};