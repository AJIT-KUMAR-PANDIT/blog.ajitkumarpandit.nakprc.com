import { resizeImage } from '@starter-kit/utils/image';
import Link from 'next/link';
import { useAppContext } from './contexts/appContext';

export const PersonalHeader = () => {
	const { publication } = useAppContext();

	return (
		<header className="bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
			<div className="max-w-6xl mx-auto px-5 py-12">
				{/* Hero Section */}
				<div className="text-center space-y-6">
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
			</div>
		</header>
	);
};
