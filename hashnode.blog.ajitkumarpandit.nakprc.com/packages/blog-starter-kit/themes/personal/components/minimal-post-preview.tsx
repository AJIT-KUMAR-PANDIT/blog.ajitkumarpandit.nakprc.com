import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { User } from '../generated/graphql';
import { DateFormatter } from './date-formatter';

type Author = Pick<User, 'name'>;

type Props = {
	title: string;
	date: string;
	author: Author;
	slug: string;
	commentCount?: number;
	brief?: string;
	tags?: Array<{ name: string; slug: string }>;
	readTimeInMinutes?: number;
	coverImageUrl?: string;
};

export const MinimalPostPreview = ({ 
	title, 
	date, 
	author, 
	slug, 
	commentCount, 
	brief,
	tags,
	readTimeInMinutes,
	coverImageUrl 
}: Props) => {
	const postURL = `/${slug}`;
	const [isHovered, setIsHovered] = useState(false);

	return (
		<article 
			className="group relative bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 p-0 overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl hover:border-primary-200 dark:hover:border-primary-800 hover:-translate-y-1"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Cover Image */}
			{coverImageUrl && (
				<Link href={postURL} className="block">
					<div className="relative aspect-[16/9] w-full bg-gray-100 dark:bg-neutral-800">
						<Image
							src={coverImageUrl}
							alt={title}
							fill
							sizes="(max-width: 768px) 100vw, 640px"
							className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
							priority={false}
						/>
					</div>
				</Link>
			)}

			{/* Main Content */}
			<div className="space-y-4 p-6">
				{/* Title */}
				<h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
					<Link 
						href={postURL}
						className="block before:absolute before:inset-0 before:rounded-2xl before:transition-all before:duration-300"
					>
						{title}
					</Link>
				</h2>

				{/* Brief/Excerpt */}
				{brief && (
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 text-sm">
						{brief}
					</p>
				)}

				{/* Tags */}
				{tags && tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{tags.slice(0, 3).map((tag) => (
							<span
								key={tag.slug}
								className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full transition-colors duration-200 hover:bg-primary-200 dark:hover:bg-primary-900/40"
							>
								#{tag.name}
							</span>
						))}
						{tags.length > 3 && (
							<span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
								+{tags.length - 3} more
							</span>
						)}
					</div>
				)}

				{/* Meta Information */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-800">
					<div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
						{/* Author */}
						<span className="font-medium">
							{author.name}
						</span>

						{/* Date */}
						<span className="flex items-center space-x-1">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 01-2 2v12a2 2 0 002 2z" />
							</svg>
							<DateFormatter dateString={date} />
						</span>

						{/* Read Time */}
						{readTimeInMinutes && (
							<span className="flex items-center space-x-1">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<span>{readTimeInMinutes} min read</span>
							</span>
						)}
					</div>

					{/* Comments & Action */}
					<div className="flex items-center space-x-3">
						{/* Comments */}
						{commentCount && commentCount > 0 && (
							<span className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
								</svg>
								<span>{commentCount}</span>
							</span>
						)}

						{/* Read More Arrow */}
						<div className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
							<svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
							</svg>
						</div>
					</div>
				</div>
			</div>

			{/* Hover Effect Gradient */}
			<div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
		</article>
	);
};
