import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import { PublicationNavbarItem } from '../generated/graphql';
import { useAppContext } from './contexts/appContext';
import { ThemeToggle } from './theme-toggle';

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
		<nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white shadow-lg backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo and Brand */}
					<div className="flex items-center gap-3">
						<Link href="/" className="group flex items-center gap-3">
							<div className="relative">
								<Image
									src="/AJITKUMARPANDIT_LOGO.png"
									alt="Ajit Kumar Pandit Logo"
									width={100}
									height={50}
									className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
								/>
							</div>
							<div className=" sm:block">
								<h1 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 text-xl font-bold text-gray-900 transition-colors duration-300 dark:text-white">
									{/* {publication.title} */}
									BLOG
								</h1>
							</div>
						</Link>
					</div>

					{/* Navigation Links */}
					<div className="hidden items-center space-x-8 md:flex">
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
						<button className="focus:ring-primary-500 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset dark:hover:bg-neutral-800 md:hidden">
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
	);
};
