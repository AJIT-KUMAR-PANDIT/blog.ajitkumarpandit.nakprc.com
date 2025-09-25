import { resizeImage } from '@starter-kit/utils/image';
import Link from 'next/link';
import { useAppContext } from './contexts/appContext';
import { useState, useEffect, useMemo } from 'react';

export const PersonalHeader = () => {
	const { publication } = useAppContext();
	const [displayText, setDisplayText] = useState(publication.title || '');
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showCursor, setShowCursor] = useState(true);
	const [isClient, setIsClient] = useState(false);
	
	const titles = useMemo(() => [
		publication.title,
		`${publication.author.name}'s Blog`,
		'Tech Stories & Insights',
		'Innovation & Ideas'
	], [publication.title, publication.author.name]);

	// Hydration safety
	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		
		const currentTitle = titles[currentIndex];
		const timeout = setTimeout(() => {
			if (!isDeleting && displayText === currentTitle) {
				setTimeout(() => setIsDeleting(true), 2000);
			} else if (isDeleting && displayText === '') {
				setIsDeleting(false);
				setCurrentIndex((prev) => (prev + 1) % titles.length);
			} else {
				setDisplayText(prev => 
					isDeleting 
						? prev.slice(0, -1)
						: currentTitle.slice(0, prev.length + 1)
				);
			}
		}, isDeleting ? 50 : 100);

		return () => clearTimeout(timeout);
	}, [displayText, currentIndex, isDeleting, titles]);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		
		const cursorInterval = setInterval(() => {
			setShowCursor(prev => !prev);
		}, 500);
		return () => clearInterval(cursorInterval);
	}, []);

	return (
		<>
		<header className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
			{/* Enhanced Background with Multiple Layers */}
			<div className="absolute inset-0">
				{/* Primary gradient */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-white to-primary-100/60 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900"></div>
				{/* Overlay patterns */}
				<div className="absolute inset-0">
					<div className="absolute inset-0 bg-gradient-to-br from-primary-500/3 to-primary-600/5 dark:from-primary-400/5 dark:to-primary-500/10"></div>
					<div className="absolute inset-0 bg-dot-pattern opacity-20 dark:opacity-10"></div>
					<div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-5"></div>
				</div>
				{/* Animated elements */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-4 -left-4 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
					<div className="absolute top-1/4 right-1/4 w-48 h-48 bg-primary-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
					<div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-primary-600/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
				</div>
			</div>

			<style jsx>{`
				.bg-dot-pattern {
					background-image: radial-gradient(circle, rgba(79, 70, 229, 0.15) 2px, transparent 2px);
					background-size: 40px 40px;
					animation: dotMove 20s linear infinite;
				}
				.bg-grid-pattern {
					background-image: linear-gradient(rgba(79, 70, 229, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(79, 70, 229, 0.1) 1px, transparent 1px);
					background-size: 60px 60px;
					animation: gridMove 15s linear infinite reverse;
				}
				@keyframes dotMove {
					0% { background-position: 0 0; }
					100% { background-position: 40px 40px; }
				}
				@keyframes gridMove {
					0% { background-position: 0 0; }
					100% { background-position: 60px 60px; }
				}
				@keyframes floating {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-20px); }
				}
				.floating { animation: floating 6s ease-in-out infinite; }
			`}</style>
			
			<div className="relative z-10 max-w-7xl mx-auto px-5 py-20">
				{/* Modern Hero Layout */}
				<div className="text-center space-y-12">
					{/* Enhanced Profile Section */}
					<div className="space-y-8">
						{/* Profile Image with Enhanced Effects */}
						{publication.author.profilePicture && (
							<div className="relative inline-block floating">
								{/* Outer ring with pulse effect */}
								<div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full opacity-20 blur-lg animate-pulse"></div>
								<div className="relative">
									<div className="relative w-32 h-32 lg:w-40 lg:h-40 mx-auto">
										{/* Gradient border */}
										<div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 rounded-full p-1 shadow-2xl">
											<div className="w-full h-full bg-white dark:bg-neutral-900 rounded-full p-1">
												<img
													className="w-full h-full rounded-full object-cover transition-all duration-500 hover:scale-105"
													alt={publication.author.name}
													src={resizeImage(publication.author.profilePicture, {
														w: 400,
														h: 400,
														c: 'face',
													})}
												/>
											</div>
										</div>
										{/* Live Status with Enhanced Animation */}
										<div className="absolute -bottom-2 -right-2 w-8 h-8 lg:w-10 lg:h-10">
											<div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg animate-bounce">
												<div className="absolute inset-1 bg-green-400 rounded-full animate-ping opacity-75"></div>
												<div className="absolute inset-2 bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center">
													<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Dynamic Title with Typing Animation */}
						<div className="space-y-4">
							<Link href="/" className="group block">
								<h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-primary-600 to-gray-900 dark:from-white dark:via-primary-400 dark:to-white leading-tight tracking-tight min-h-[1.2em]">
									{displayText}
									{isClient && (
										<span className={`inline-block w-1 ml-2 bg-primary-500 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`} style={{height: '0.8em'}}></span>
									)}
								</h1>
								{/* Enhanced underline effect */}
								<div className="flex justify-center mt-6">
									<div className="h-1.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent w-32 lg:w-48 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
								</div>
							</Link>

							{/* Enhanced Tagline */}
							{publication.descriptionSEO && (
								<p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-medium leading-relaxed opacity-90">
									{publication.descriptionSEO}
								</p>
							)}
						</div>
					</div>

					{/* Enhanced Stats & Author Info */}
					<div className="space-y-8">
						{/* Author Badge with Glass Effect */}
						<div className="inline-flex items-center gap-4 px-8 py-4 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-neutral-700/50 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-pulse shadow-lg"></div>
								<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
									Curated by
								</span>
							</div>
							<span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
								{publication.author.name}
							</span>
						</div>

						{/* Enhanced Stats Grid */}
						<div className="flex items-center justify-center gap-12 lg:gap-16">
							<div className="text-center group">
								<div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-500 group-hover:scale-110 transition-transform duration-300">
									{publication.postsCount?.totalDocuments || 0}
								</div>
								<div className="text-sm lg:text-base text-gray-600 dark:text-gray-400 font-semibold mt-2">
									Stories Published
								</div>
								<div className="w-8 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mt-2 rounded-full"></div>
							</div>
							
							<div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300 dark:via-neutral-600 to-transparent"></div>
							
							<div className="text-center group">
								<div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-500 group-hover:scale-110 transition-transform duration-300">
									{publication.followersCount || '2.5K'}
								</div>
								<div className="text-sm lg:text-base text-gray-600 dark:text-gray-400 font-semibold mt-2">
									Active Readers
								</div>
								<div className="w-8 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mt-2 rounded-full"></div>
							</div>

							<div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300 dark:via-neutral-600 to-transparent"></div>

							<div className="text-center group">
								<div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-500 group-hover:scale-110 transition-transform duration-300">
									150K+
								</div>
								<div className="text-sm lg:text-base text-gray-600 dark:text-gray-400 font-semibold mt-2">
									Total Views
								</div>
								<div className="w-8 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mt-2 rounded-full"></div>
							</div>
						</div>
					</div>

					{/* Call to Action */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
						<button className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<div className="relative flex items-center gap-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
								</svg>
								Explore Articles
							</div>
						</button>
						
						<button className="group px-8 py-4 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl text-gray-900 dark:text-white font-semibold rounded-2xl border border-gray-200/50 dark:border-neutral-700/50 hover:border-primary-300 dark:hover:border-primary-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
							<div className="flex items-center gap-2">
								<svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
								</svg>
								Subscribe to Newsletter
							</div>
						</button>
					</div>
				</div>
			</div>
		</header>
		</>
	);
};
