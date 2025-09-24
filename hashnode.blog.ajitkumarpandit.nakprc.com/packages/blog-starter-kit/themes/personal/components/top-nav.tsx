import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { PublicationNavbarItem } from '../generated/graphql';
import { useAppContext } from './contexts/appContext';

function hasUrl(
	navbarItem: PublicationNavbarItem,
): navbarItem is PublicationNavbarItem & { url: string } {
	return !!navbarItem.url && navbarItem.url.length > 0;
}

export const TopNav = () => {
	const { publication } = useAppContext();
	const navbarItems = publication.preferences.navbarItems.filter(hasUrl);
	const visibleItems = navbarItems.slice(0, 3);
	const hiddenItems = navbarItems.slice(3);
	
		return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-950 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-800 shadow-lg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo and Brand */}
					<div className="flex items-center gap-3">
						<Link href="/" className="flex items-center gap-3 group">
							<div className="relative">
								<img
									src="/AJITKUMARPANDIT_LOGO.png"
									alt="Ajit Kumar Pandit Logo"
									className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
								/>
							</div>
							<div className="hidden sm:block">
								<h1 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
									{publication.title}
								</h1>
							</div>
						</Link>
					</div>

					{/* Navigation Links */}
					<div className="hidden md:flex items-center space-x-8">
						<Link href="/" className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors duration-300">
							Home
						</Link>
						<Link href="/posts" className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors duration-300">
							All Posts
						</Link>
						<Link href="/about" className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors duration-300">
							About
						</Link>
						<Link href="/search" className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors duration-300">
							Search
						</Link>
					</div>

					{/* Right Side Actions */}
					<div className="flex items-center gap-4">
						{/* External Links */}
						<div className="hidden lg:flex items-center space-x-4">
							{visibleItems.map((item) => (
								<a 
									key={item.url}
									href={item.url} 
									target="_blank" 
									rel="noopener noreferrer" 
									className="text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-300"
								>
									{item.label}
								</a>
							))}
							{hiddenItems.length > 0 && (
								<DropdownMenu.Root>
									<DropdownMenu.Trigger asChild>
										<button className="text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-300 flex items-center gap-1">
											More
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
							)}
						</div>

						{/* Subscribe Button */}
						<button className="hidden sm:inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
							<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
							</svg>
							Subscribe
						</button>

						{/* Mobile menu button */}
						<button className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};
