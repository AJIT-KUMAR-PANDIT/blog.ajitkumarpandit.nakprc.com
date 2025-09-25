import { resizeImage } from '@starter-kit/utils/image';
import Link from 'next/link';
import { useAppContext } from './contexts/appContext';

export const PersonalHeader = () => {
	const { publication } = useAppContext();

	return (
		<>
		<header className="relative overflow-hidden">
			{/* Background with subtle pattern */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900"></div>
			<div className="absolute inset-0 opacity-10">
				<div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5"></div>
				<div className="absolute inset-0 bg-dot-pattern opacity-30"></div>
			</div>
			<style jsx>{`
				.bg-dot-pattern {
					background-image: radial-gradient(circle, rgba(79, 70, 229, 0.1) 2px, transparent 2px);
					background-size: 30px 30px;
				}
			`}</style>
			
			<div className="relative max-w-7xl mx-auto px-5 py-16 lg:py-20">
				{/* Modern Tech News Header */}
				<div className="text-center space-y-8">
					{/* Publication Logo/Avatar */}
					{publication.author.profilePicture && (
						<div className="relative inline-block">
							<div className="relative w-24 h-24 lg:w-32 lg:h-32 mx-auto">
								<img
									className="w-full h-full rounded-full border-4 border-white dark:border-neutral-800 shadow-2xl transition-all duration-300 hover:scale-105 object-cover"
									alt={publication.author.name}
									src={resizeImage(publication.author.profilePicture, {
										w: 400,
										h: 400,
										c: 'face',
									})}
								/>
								{/* Live indicator */}
								<div className="absolute -bottom-1 -right-1 w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full border-3 lg:border-4 border-white dark:border-neutral-900 shadow-lg">
									<div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
								</div>
							</div>
						</div>
					)}
					
					<div className="space-y-6">
						{/* Publication Title */}
						<Link href="/" className="group block">
							<h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 tracking-tight leading-none">
								{publication.title}
							</h1>
							{/* Underline effect */}
							<div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600 max-w-24 mx-auto mt-4 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
						</Link>
						
						{/* Tagline */}
						{publication.descriptionSEO && (
							<p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
								{publication.descriptionSEO}
							</p>
						)}
						
						{/* Author Badge */}
						<div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
							<div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
							<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
								Edited by <span className="text-primary-600 dark:text-primary-400">{publication.author.name}</span>
							</span>
						</div>

						{/* Stats Row */}
						<div className="flex items-center justify-center gap-8 pt-4">
							<div className="text-center">
								<div className="text-2xl font-bold text-gray-900 dark:text-white">
									{publication.postsCount?.totalDocuments || 0}
								</div>
								<div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
									Articles
								</div>
							</div>
							<div className="w-px h-8 bg-gray-300 dark:bg-neutral-600"></div>
							<div className="text-center">
								<div className="text-2xl font-bold text-gray-900 dark:text-white">
									{publication.followersCount || 0}
								</div>
								<div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
									Readers
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
		</>
	);
};
