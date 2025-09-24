import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PublicationNavbarItem, PostFragment } from '../generated/graphql';
import { useAppContext } from './contexts/appContext';
import { ThemeToggle } from './theme-toggle';
import { Logo } from './logo';
import { SITE_CONFIG } from '../lib/constants';
import request from 'graphql-request';
import {
  PostsByPublicationDocument,
  PostsByPublicationQuery,
  PostsByPublicationQueryVariables,
} from '../generated/graphql';

function hasUrl(
	navbarItem: PublicationNavbarItem,
): navbarItem is PublicationNavbarItem & { url: string } {
	return !!navbarItem.url && navbarItem.url.length > 0;
}

type TopicsWithPosts = {
	[topicName: string]: PostFragment[];
};

export const TopNav = () => {
	const { publication } = useAppContext();
	const navbarItems = publication.preferences.navbarItems.filter(hasUrl);
	const visibleItems = navbarItems.slice(0, 3);
	const hiddenItems = navbarItems.slice(3);
	
	// Off-canvas state
	const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
	const [posts, setPosts] = useState<PostFragment[]>([]);
	const [topicsWithPosts, setTopicsWithPosts] = useState<TopicsWithPosts>({});
	const [isLoading, setIsLoading] = useState(false);

	// Fetch posts when off-canvas opens
	useEffect(() => {
		const fetchPosts = async () => {
			if (!isOffCanvasOpen || posts.length > 0) return;
			
			setIsLoading(true);
			try {
				const data = await request<PostsByPublicationQuery, PostsByPublicationQueryVariables>(
					process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT!,
					PostsByPublicationDocument,
					{
						first: 50,
						host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST!,
					}
				);
				
				if (data.publication?.posts.edges) {
					const fetchedPosts = data.publication.posts.edges.map(edge => edge.node);
					setPosts(fetchedPosts);
					
					// Group posts by topics
					const grouped: TopicsWithPosts = {};
					
					fetchedPosts.forEach(post => {
						if (post.tags && post.tags.length > 0) {
							post.tags.forEach(tag => {
								if (!grouped[tag.name]) {
									grouped[tag.name] = [];
								}
								grouped[tag.name].push(post);
							});
						} else {
							// Posts without tags go to "Uncategorized"
							if (!grouped['Uncategorized']) {
								grouped['Uncategorized'] = [];
							}
							grouped['Uncategorized'].push(post);
						}
					});
					
					// Sort topics by post count
					const sortedTopics: TopicsWithPosts = {};
					Object.keys(grouped)
						.sort((a, b) => grouped[b].length - grouped[a].length)
						.forEach(topic => {
							sortedTopics[topic] = grouped[topic];
						});
					
					setTopicsWithPosts(sortedTopics);
				}
			} catch (error) {
				console.error('Failed to fetch posts:', error);
			} finally {
				setIsLoading(false);
			}
		};
		
		fetchPosts();
	}, [isOffCanvasOpen, posts.length]);

	// Close off-canvas when clicking outside
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setIsOffCanvasOpen(false);
			}
		};
		
		if (isOffCanvasOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		
		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOffCanvasOpen]);

	return (
		<>
		<nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white shadow-lg backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo and Brand */}
					<div className="flex items-center gap-3">
						<Link href="/" className="group flex items-center gap-3">
							<Logo priority={true} />
							<div className="block">
								<h1 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 text-xl font-bold text-gray-900 transition-colors duration-300 dark:text-white">
									{SITE_CONFIG.TITLE}
								</h1>
							</div>
						</Link>
					</div>

					{/* Navigation Links */}
					<div className="hidden items-center space-x-8 lg:flex">
						<Link
							href="/"
							className="hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium text-gray-700 transition-colors duration-300 dark:text-gray-300"
						>
							Home
						</Link>
						<Link
							href="/posts"
							className="hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium text-gray-700 transition-colors duration-300 dark:text-gray-300"
						>
							All Posts
						</Link>
						<Link
							href="/about"
							className="hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium text-gray-700 transition-colors duration-300 dark:text-gray-300"
						>
							About
						</Link>
						<Link
							href="/search"
							className="hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium text-gray-700 transition-colors duration-300 dark:text-gray-300"
						>
							Search
						</Link>
					</div>

					{/* Right Side Actions */}
					<div className="flex items-center gap-4">
						{/* Theme Toggle - Desktop Only */}
						<div className="hidden md:flex">
							<ThemeToggle
								className="rounded-lg p-2 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
								showLabel={false}
								size="sm"
							/>
						</div>

						{/* External Links */}
						<div className="hidden items-center space-x-4 lg:flex">
							{visibleItems.map((item) => (
								<a
									key={item.url}
									href={item.url}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium text-gray-600 transition-colors duration-300 dark:text-gray-400"
								>
									{item.label}
								</a>
							))}
							{hiddenItems.length > 0 && (
								<DropdownMenu.Root>
									<DropdownMenu.Trigger asChild>
										<button className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors duration-300 dark:text-gray-400">
											More
											<svg
												className="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Portal>
										<DropdownMenu.Content
											className="animate-in fade-in-0 zoom-in-95 flex min-w-[160px] flex-col items-stretch gap-1 rounded-xl border bg-white/90 p-2 text-sm font-medium text-neutral-600 shadow-2xl backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-800/90 dark:text-neutral-300"
											sideOffset={5}
											align="end"
										>
											{hiddenItems.map((item) => (
												<DropdownMenu.Item asChild key={item.url}>
													<a
														href={item.url}
														target="_blank"
														rel="noopener noreferrer"
														className="hover:text-primary-500 dark:hover:text-primary-400 block w-full rounded-lg px-3 py-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-neutral-700"
													>
														{item.label}
													</a>
												</DropdownMenu.Item>
											))}
										</DropdownMenu.Content>
									</DropdownMenu.Portal>
								</DropdownMenu.Root>
							)}
						</div>

						{/* Subscribe Button */}
						<button className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 hidden items-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 sm:inline-flex">
							<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
								/>
							</svg>
							Subscribe
						</button>

						{/* Mobile menu button */}
						<button 
							onClick={() => setIsOffCanvasOpen(true)}
							className="focus:ring-primary-500 inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset dark:text-gray-300 dark:hover:bg-neutral-800"
							aria-label="Open menu"
						>
							<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</nav>

		{/* Off-Canvas Menu */}
		{isOffCanvasOpen && (
			<>
				{/* Backdrop */}
				<div 
					className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
					onClick={() => setIsOffCanvasOpen(false)}
					aria-hidden="true"
				/>
				
				{/* Off-Canvas Panel */}
				<div className="fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw] transform overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-neutral-900">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-neutral-700">
						<div className="flex items-center gap-3">
							<Logo priority={true} />
							<h2 className="text-lg font-bold text-gray-900 dark:text-white">
								{SITE_CONFIG.TITLE}
							</h2>
						</div>
						<button
							onClick={() => setIsOffCanvasOpen(false)}
							className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-200"
							aria-label="Close menu"
						>
							<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					
					{/* Content */}
					<div className="flex h-full flex-col overflow-y-auto pb-20">
						{/* Navigation Links */}
						<div className="border-b border-gray-200 p-4 dark:border-neutral-700">
							<h3 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Navigation
							</h3>
							<div className="space-y-2">
								<Link
									href="/"
									onClick={() => setIsOffCanvasOpen(false)}
									className="flex items-center gap-3 rounded-lg p-3 text-gray-700 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-primary-400 transition-colors duration-200"
								>
									<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m0 0V9a1 1 0 00-1-1H9a1 1 0 00-1 1" />
									</svg>
									Home
								</Link>
								<Link
									href="/posts"
									onClick={() => setIsOffCanvasOpen(false)}
									className="flex items-center gap-3 rounded-lg p-3 text-gray-700 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-primary-400 transition-colors duration-200"
								>
									<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									All Posts
								</Link>
								<Link
									href="/about"
									onClick={() => setIsOffCanvasOpen(false)}
									className="flex items-center gap-3 rounded-lg p-3 text-gray-700 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-primary-400 transition-colors duration-200"
								>
									<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									About
								</Link>
								<Link
									href="/search"
									onClick={() => setIsOffCanvasOpen(false)}
									className="flex items-center gap-3 rounded-lg p-3 text-gray-700 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-primary-400 transition-colors duration-200"
								>
									<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
									Search
								</Link>
							</div>
						</div>
						
						{/* Topics and Posts */}
						<div className="flex-1 p-4">
							<h3 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Topics & Posts
							</h3>
							
							{isLoading ? (
								<div className="flex items-center justify-center py-8">
									<div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
										<div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
										<span className="text-sm">Loading posts...</span>
									</div>
								</div>
							) : Object.keys(topicsWithPosts).length > 0 ? (
								<div className="space-y-4">
									{Object.entries(topicsWithPosts).map(([topic, topicPosts]) => (
										<div key={topic} className="rounded-lg border border-gray-200 dark:border-neutral-700">
											{/* Topic Header */}
											<div className="flex items-center justify-between bg-gray-50 dark:bg-neutral-800 p-3 rounded-t-lg">
												<div className="flex items-center gap-2">
													<div className="w-2 h-2 bg-primary-500 rounded-full"></div>
													<h4 className="font-semibold text-gray-900 dark:text-white">{topic}</h4>
												</div>
												<span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-neutral-700 px-2 py-1 rounded-full">
													{topicPosts.length} {topicPosts.length === 1 ? 'post' : 'posts'}
												</span>
											</div>
											
											{/* Posts List */}
											<div className="divide-y divide-gray-200 dark:divide-neutral-700">
												{topicPosts.slice(0, 5).map((post) => (
													<Link
														key={post.id}
														href={`/${post.slug}`}
														onClick={() => setIsOffCanvasOpen(false)}
														className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors duration-200"
													>
														<div className="mt-1 w-1.5 h-1.5 bg-primary-400 rounded-full flex-shrink-0"></div>
														<div className="flex-1 min-w-0">
															<h5 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight">
																{post.title}
															</h5>
															<div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
																<span>{new Date(post.publishedAt).toLocaleDateString()}</span>
																{post.readTimeInMinutes && (
																	<>
																		<span>•</span>
																		<span>{post.readTimeInMinutes} min</span>
																	</>
																)}
															</div>
														</div>
													</Link>
												))}
												
												{topicPosts.length > 5 && (
													<div className="p-3 text-center border-t border-gray-100 dark:border-neutral-800">
														<Link
															href={`/tag/${topic.toLowerCase().replace(/\s+/g, '-')}`}
															onClick={() => setIsOffCanvasOpen(false)}
															className="text-xs text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
														>
															View all {topicPosts.length} posts →
														</Link>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8 text-gray-500 dark:text-gray-400">
									<svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									<p className="text-sm">No posts available</p>
								</div>
							)}
						</div>
						
						{/* Footer */}
						<div className="border-t border-gray-200 p-4 dark:border-neutral-700">
							<div className="flex items-center justify-between mb-3">
								<ThemeToggle
									className="rounded-lg p-2 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
									showLabel={true}
									size="sm"
								/>
							</div>
							
							{/* External Links */}
							{navbarItems.length > 0 && (
								<div className="space-y-2">
									<h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
										External Links
									</h4>
									{navbarItems.map((item) => (
										<a
											key={item.url}
											href={item.url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
										>
											<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
											</svg>
											{item.label}
										</a>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</>
		)}
		</>
	);
};
