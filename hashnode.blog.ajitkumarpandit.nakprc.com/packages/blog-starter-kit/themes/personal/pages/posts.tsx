import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import request from 'graphql-request';
import { Container } from '../components/container';
import { AppProvider } from '../components/contexts/appContext';
import { Layout } from '../components/layout';
import { MinimalPostPreview } from '../components/minimal-post-preview';
import { PostCardSkeleton } from '../components/loading-skeletons';
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

type SortOption = 'newest' | 'oldest' | 'popular';
type ViewMode = 'grid' | 'list';

export default function Posts({ publication, posts }: Props) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterTag, setFilterTag] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isLoading, setIsLoading] = useState(false);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(tag => tagSet.add(tag.name));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Filter by tag if selected
    if (filterTag) {
      filtered = posts.filter(post =>
        post.tags?.some(tag => tag.name === filterTag)
      );
    }

    // Sort posts
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'popular':
          return (b.comments?.totalDocuments || 0) - (a.comments?.totalDocuments || 0);
        default:
          return 0;
      }
    });
  }, [posts, filterTag, sortBy]);

  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>All Posts - {publication.title}</title>
          <meta
            name="description"
            content={`Browse all articles on ${publication.title}`}
          />
        </Head>

        <TopNav />
        <Container className="mx-auto flex max-w-4xl flex-col items-stretch gap-8 px-5 py-10 pt-24">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              All Posts
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore all {posts.length} articles on {publication.title}
            </p>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:gap-6">
              {/* Sort and Filter Row */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Sort Dropdown */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    Sort by:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full sm:w-auto min-w-[140px] px-3 py-2.5 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>

                {/* Tag Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    Filter by tag:
                  </label>
                  <select
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="w-full sm:w-auto min-w-[140px] px-3 py-2.5 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  >
                    <option value="">All Tags</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    View:
                  </span>
                  <div className="flex bg-gray-100 dark:bg-neutral-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 min-w-[44px] min-h-[44px] justify-center ${
                        viewMode === 'list'
                          ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 min-w-[44px] min-h-[44px] justify-center ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>
                  Showing {filteredAndSortedPosts.length} of {posts.length} posts
                  {filterTag && (
                    <span className="ml-2 inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-xs">
                      #{filterTag}
                      <button
                        onClick={() => setFilterTag('')}
                        className="ml-1 hover:text-primary-900 dark:hover:text-primary-100"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </span>
                {isLoading && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Posts Grid/List */}
          {isLoading ? (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-8' : 'space-y-8'}>
              {[...Array(6)].map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredAndSortedPosts.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-8' : 'space-y-8'}>
              {filteredAndSortedPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="opacity-0 animate-in slide-in-from-bottom-4 duration-500"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <MinimalPostPreview
                    title={post.title}
                    date={post.publishedAt}
                    author={{
                      name: post.author.name,
                    }}
                    slug={post.slug}
                    commentCount={post.comments?.totalDocuments}
                    brief={post.brief}
                    tags={post.tags?.map((tag) => ({ name: tag.name, slug: tag.slug }))}
                    readTimeInMinutes={post.readTimeInMinutes}
                    coverImageUrl={post.coverImage?.url}
                  />
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
                No posts found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                No posts match the current filter criteria.
              </p>
              <button
                onClick={() => {
                  setFilterTag('');
                  setSortBy('newest');
                }}
                className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center pt-8 border-t border-gray-200 dark:border-neutral-800">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
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
      first: 50, // Get posts for the archive (API limit is 50)
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