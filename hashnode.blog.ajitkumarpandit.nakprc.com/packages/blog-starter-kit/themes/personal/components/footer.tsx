import Link from 'next/link';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import { RiTwitterXFill } from 'react-icons/ri';
import { useAppContext } from './contexts/appContext';

export const Footer = () => {
	const { publication } = useAppContext();

	// Static contact info (can be made dynamic later)
	const contactInfo = {
		email: 'ajit@nakprc.com', // Replace with your actual email
		phone: '', // Add your phone if needed
		linkedin: 'https://linkedin.com/in/ajitkumarpandit', // Replace with your LinkedIn
		github: 'https://github.com/AJIT-KUMAR-PANDIT', // Replace with your GitHub
		twitter: 'https://twitter.com/AjitKrPandit', // Replace with your Twitter
	};

	return (
		<footer className="mt-20 w-full border-t border-gray-200/50 bg-white/80 py-12 backdrop-blur-md dark:border-neutral-800/50 dark:bg-neutral-950/80">
			<div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
				<div className="mb-10 flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
					{/* Left: About */}
					<div className="text-left md:w-1/3">
						<h3 className="mb-0 text-2xl font-bold text-gray-900 dark:text-white">
							{publication.title}
						</h3>
						{publication.descriptionSEO && (
							<p className="-mt-1 text-sm text-gray-600 dark:text-gray-400">
								{publication.descriptionSEO}
							</p>
						)}
						<p className="mb-0 mt-3 leading-relaxed text-gray-700 dark:text-gray-300">
							Passionate Full Stack Developer with expertise in crafting robust and scalable web
							applications. Dedicated to continuous learning and delivering high-quality solutions.
						</p>
					</div>

					{/* Middle: Quick Links */}
					<div className="text-left md:w-1/3">
						<h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
							Quick Links
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/"
									className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-700 transition-colors duration-200 dark:text-gray-300"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-700 transition-colors duration-200 dark:text-gray-300"
								>
									About
								</Link>
							</li>
							<li>
								<Link
									href="/posts"
									className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-700 transition-colors duration-200 dark:text-gray-300"
								>
									Posts
								</Link>
							</li>
							<li>
								<Link
									href="/search"
									className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-700 transition-colors duration-200 dark:text-gray-300"
								>
									Search
								</Link>
							</li>
							<li>
								<Link
									href="/tag/javascript"
									className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-700 transition-colors duration-200 dark:text-gray-300"
								>
									Popular: JavaScript
								</Link>
							</li>
						</ul>
					</div>

					{/* Right: Get in Touch */}
					<div className="text-left md:w-1/3">
						<h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
							Get in Touch
						</h3>
						{contactInfo.email && (
							<p className="mb-2 text-gray-700 dark:text-gray-300">
								Email:{' '}
								<a
									href={`mailto:${contactInfo.email}`}
									className="text-primary-600 dark:text-primary-400 hover:underline"
								>
									{contactInfo.email}
								</a>
							</p>
						)}
						{contactInfo.phone && (
							<p className="mb-4 text-gray-700 dark:text-gray-300">Phone: {contactInfo.phone}</p>
						)}
						<div className="flex justify-start space-x-6">
							{contactInfo.github && (
								<a
									href={contactInfo.github}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-600 transition-colors duration-200 dark:text-gray-400"
								>
									<FaGithub className="text-2xl" />
								</a>
							)}
							{contactInfo.linkedin && (
								<a
									href={contactInfo.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-600 transition-colors duration-200 dark:text-gray-400"
								>
									<FaLinkedin className="text-2xl" />
								</a>
							)}
							{contactInfo.twitter && (
								<a
									href={contactInfo.twitter}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-600 transition-colors duration-200 dark:text-gray-400"
								>
									<RiTwitterXFill className="text-2xl" />
								</a>
							)}
							{contactInfo.email && (
								<a
									href={`mailto:${contactInfo.email}`}
									className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-600 transition-colors duration-200 dark:text-gray-400"
								>
									<FaEnvelope className="text-2xl" />
								</a>
							)}
						</div>
					</div>
				</div>

				{/* Bottom border section */}
				<div className="mt-8 border-t border-gray-200/50 pt-8 text-sm text-gray-600 dark:border-neutral-800/50 dark:text-gray-400">
					<p>
						&copy; {new Date().getFullYear()} {publication.title}. All rights reserved.
					</p>
					<p className="mt-1">Designed and Developed with ❤️ by {publication.title}</p>
				</div>
			</div>

			{/* Marquee-like name scroller */}
			<div className="mt-6 w-full overflow-hidden">
				<div className="animate-slide relative flex w-max">
					<h1 className="select-none whitespace-nowrap px-20 text-[20vw] font-extrabold leading-none opacity-10 dark:opacity-5">
						{publication.title}
					</h1>
					<h1 className="select-none whitespace-nowrap px-20 text-[20vw] font-extrabold leading-none opacity-10 dark:opacity-5">
						{publication.title}
					</h1>
				</div>
				<style jsx>{`
					@keyframes slide {
						0% {
							transform: translateX(0);
						}
						100% {
							transform: translateX(-50%);
						}
					}
					.animate-slide {
						animation: slide 20s linear infinite;
					}
				`}</style>
			</div>
		</footer>
	);
};
