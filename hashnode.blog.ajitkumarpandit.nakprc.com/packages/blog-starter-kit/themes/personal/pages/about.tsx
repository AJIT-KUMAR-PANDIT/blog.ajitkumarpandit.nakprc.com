import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import request from 'graphql-request';
import { resizeImage } from '@starter-kit/utils/image';
import { Container } from '../components/container';
import { AppProvider } from '../components/contexts/appContext';
import { Layout } from '../components/layout';
import { TopNav } from '../components/top-nav';
import {
  PublicationByHostDocument,
  PublicationByHostQuery,
  PublicationByHostQueryVariables,
  PublicationFragment,
} from '../generated/graphql';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

type Props = {
  publication: PublicationFragment;
};

export default function About({ publication }: Props) {
  const author = publication.author;
  
  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>About - {publication.title}</title>
          <meta
            name="description"
            content={`Learn more about ${author.name} and ${publication.title}`}
          />
          <meta property="og:title" content={`About - ${publication.title}`} />
          <meta
            property="og:description"
            content={`Learn more about ${author.name} and ${publication.title}`}
          />
        </Head>

        <TopNav />
        <Container className="mx-auto flex max-w-2xl flex-col items-stretch gap-10 px-5 py-10 pt-24">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              {author.profilePicture && (
                <div className="relative">
                  <img
                    className="w-32 h-32 rounded-full mx-auto border-4 border-white dark:border-neutral-800 shadow-xl"
                    alt={author.name}
                    src={resizeImage(author.profilePicture, {
                      w: 400,
                      h: 400,
                      c: 'face',
                    })}
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-neutral-950 animate-pulse" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {author.name}
              </h1>
              {author.tagline && (
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {author.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Bio Section */}
          {author.bio && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-gray-200 dark:border-neutral-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About Me
              </h2>
              <div 
                className="prose prose-gray dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: author.bio.html }}
              />
            </div>
          )}

          {/* Publication Info */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-8 border border-primary-200 dark:border-primary-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              About This Blog
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-300">
                {publication.title}
              </h3>
              {publication.descriptionSEO && (
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {publication.descriptionSEO}
                </p>
              )}
              
              {/* Blog Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-600">
                  <div className="text-2xl font-bold text-primary-500">
                    {publication.postsCount?.totalDocuments || '0'}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Articles Published
                  </div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-600">
                  <div className="text-2xl font-bold text-primary-500">
                    {publication.followersCount || '0'}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Followers
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-gray-200 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Connect With Me
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Twitter */}
              {author.socialMediaLinks?.twitter && (
                <a
                  href={author.socialMediaLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200 group"
                >
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Twitter</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Follow me on Twitter</div>
                  </div>
                </a>
              )}

              {/* LinkedIn */}
              {author.socialMediaLinks?.linkedin && (
                <a
                  href={author.socialMediaLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200 group"
                >
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">LinkedIn</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Connect on LinkedIn</div>
                  </div>
                </a>
              )}

              {/* GitHub */}
              {author.socialMediaLinks?.github && (
                <a
                  href={author.socialMediaLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900/40 transition-colors duration-200 group"
                >
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">GitHub</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Check out my code</div>
                  </div>
                </a>
              )}

              {/* Website */}
              {author.socialMediaLinks?.website && (
                <a
                  href={author.socialMediaLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors duration-200 group"
                >
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9a9 9 0 01-9-9m9 9c0-4.97-4.03-9-9-9" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Website</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Visit my website</div>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">
                Stay Updated
              </h2>
              <p className="text-primary-100">
                Subscribe to get notified about new articles and updates.
              </p>
              <div className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Blog */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Blog</span>
            </Link>
          </div>
        </Container>
      </Layout>
    </AppProvider>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await request<PublicationByHostQuery, PublicationByHostQueryVariables>(
    GQL_ENDPOINT,
    PublicationByHostDocument,
    {
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
    }
  );

  const publication = data.publication;
  if (!publication) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      publication,
    },
    revalidate: 3600, // Revalidate every hour
  };
};