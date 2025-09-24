import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { resizeImage } from '@starter-kit/utils/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PublicationNavbarItem } from '../generated/graphql';
import { useAppContext } from './contexts/appContext';

function hasUrl(
	navbarItem: PublicationNavbarItem,
): navbarItem is PublicationNavbarItem & { url: string } {
	return !!navbarItem.url && navbarItem.url.length > 0;
}

export const PersonalHeader = () => {
	const { publication } = useAppContext();
	const [isScrolled, setIsScrolled] = useState(false);

	// Handle scroll effect for header
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const navbarItems = publication.preferences.navbarItems.filter(hasUrl);
	const visibleItems = navbarItems.slice(0, 3);
	const hiddenItems = navbarItems.slice(3);

	const navList = (
		<ul className="hidden lg:flex list-none flex-row items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
			{visibleItems.map((item) => (
				<li key={item.url}>
					<a 
						href={item.url} 
						target="_blank" 
						rel="noopener noreferrer" 
						className="relative transition-all duration-300 hover:text-primary-500 dark:hover:text-primary-400 group"
					>
						{item.label}
						<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full" />
					</a>
				</li>
			))}

			{hiddenItems.length > 0 && (
				<li>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild>
							<button className="relative transition-all duration-300 hover:text-primary-500 dark:hover:text-primary-400 group flex items-center gap-1">
								More
								<svg className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Portal>
							<DropdownMenu.Content
								className="flex flex-col items-stretch gap-1 rounded-xl border bg-white/90 backdrop-blur-sm text-sm font-medium text-neutral-600 shadow-2xl dark:border-neutral-700 dark:bg-neutral-800/90 dark:text-neutral-300 p-2 min-w-[160px] animate-in fade-in-0 zoom-in-95"
								sideOffset={5}
								align="end"
							>
								{hiddenItems.map((item) => (
									<DropdownMenu.Item asChild key={item.url}>
										<a
											href={item.url}
											target="_blank"
											rel="noopener noreferrer"
											className="block w-full px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-primary-500 dark:hover:text-primary-400"
										>
											{item.label}
										</a>
									</DropdownMenu.Item>
								))}
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					</DropdownMenu.Root>
				</li>
			)}
		</ul>
	);

	return (
		<header className={`sticky top-0 z-40 transition-all duration-300 backdrop-blur-sm ${
			isScrolled 
				? 'bg-white/80 dark:bg-neutral-950/80 shadow-sm border-b border-gray-200/50 dark:border-neutral-800/50' 
				: 'bg-transparent'
		}`}>
			<div className="max-w-6xl mx-auto px-5 py-6">
				{/* Hero Section */}
				<div className="text-center space-y-6 py-8">
					{publication.author.profilePicture && (
						<div className="relative inline-block">
							<img
								className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto border-4 border-white dark:border-neutral-800 shadow-2xl transition-all duration-300 hover:scale-105"
								alt={publication.author.name}
								src={resizeImage(publication.author.profilePicture, {
									w: 400,
									h: 400,
									c: 'face',
								})}
							/>
							<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-neutral-900 animate-pulse shadow-lg" />
						</div>
					)}
					
					<div className="space-y-4">
						<Link href="/" className="group">
							<h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
								{publication.title}
							</h1>
						</Link>
						
						{publication.descriptionSEO && (
							<p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
								{publication.descriptionSEO}
							</p>
						)}
						
						<p className="text-sm text-gray-500 dark:text-gray-400">
							by <span className="font-semibold text-primary-600 dark:text-primary-400">{publication.author.name}</span>
						</p>
					</div>
				</div>
				
				{/* Navigation */}
				<div className="flex items-center justify-between gap-4 border-t border-gray-200 dark:border-neutral-800 pt-6">
					<div className="flex items-center gap-2">
						<Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-300">
							🏠 Home
						</Link>
						<span className="text-gray-300 dark:text-gray-600">•</span>
						<Link href="/posts" className="text-sm font-medium text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-300">
							📚 All Posts
						</Link>
						<span className="text-gray-300 dark:text-gray-600">•</span>
						<Link href="/about" className="text-sm font-medium text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-300">
							👨‍💻 About
						</Link>
					</div>

					<div className="flex items-center gap-4">
						<nav>{navList}</nav>
						
						{/* Subscribe/Newsletter Button for larger screens */}
						<div className="hidden lg:block">
							<button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-lg hover:shadow-xl">
								Subscribe
							</button>
						</div>

						{/* Mobile menu button */}
						<button className="lg:hidden p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-neutral-800">
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};
