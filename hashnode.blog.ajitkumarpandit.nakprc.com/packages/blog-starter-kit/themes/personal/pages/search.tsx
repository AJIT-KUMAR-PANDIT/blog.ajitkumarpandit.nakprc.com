import { useState, useEffect, useMemo } from 'react';
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

export default function Search({ publication, posts }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  // Set mounted state to handle hydration issues
  useEffect(() => {
    setMounted(true);
    // Get search query from URL if present
    const query = router.query.q as string;
    if (query) {
      setSearchQuery(query);
    }
  }, [router.query.q]);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.brief?.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.name.toLowerCase().includes(query))
    );
  }, [posts, searchQuery]);

  // Update URL when search query changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      router.replace(`/search?q=${encodeURIComponent(value)}`, undefined, {
        shallow: true,
      });
    } else {
      router.replace('/search', undefined, { shallow: true });
    }
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
        <Container className="mx-auto flex max-w-2xl flex-col items-stretch gap-10 px-5 py-10 pt-24">
          {/* Search Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Search Articles
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Find articles, tutorials, and insights from {publication.title}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search articles, authors, tags..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                aria-label="Clear search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

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
                <div className="space-y-6">
                  {filteredPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="opacity-0 animate-in slide-in-from-bottom-4 duration-500"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'forwards',
                      }}
                    >
                      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:border-primary-200 dark:hover:border-primary-800">
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
                        {post.brief && (
                          <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                            {post.brief}
                          </p>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Link
                                key={tag.slug}
                                href={`/tag/${tag.slug}`}
                                className="text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors duration-200"
                              >
                                #{tag.name}
                              </Link>
                            ))}
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

          {/* Popular Tags */}
          {!searchQuery.trim() && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Popular Topics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                      onClick={() => handleSearchChange(tagName)}
                      className="p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full group-hover:scale-125 transition-transform duration-200" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {tagName}
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}
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