import { PostFragment } from '../generated/graphql';
import { MinimalPostPreview } from './minimal-post-preview';

type Props = {
	posts: PostFragment[];
	context: 'home' | 'series' | 'tag';
};

export const MinimalPosts = ({ posts, context }: Props) => {
		return (
		<>
			{posts.map((post, index) => (
				<div
					key={post.id}
					className="opacity-0 animate-in slide-in-from-bottom-4 duration-700"
					style={{
						animationDelay: `${index * 150}ms`,
						animationFillMode: 'forwards',
					}}
				>
					<MinimalPostPreview
						title={post.title}
						date={post.publishedAt}
						author={{
							name: post.author.name,
						}}
						slug={post.slug}
						commentCount={post.comments?.totalDocuments}
						brief={post.brief}
						tags={post.tags?.map((tag) => ({ name: tag.name, slug: tag.slug }))}
						readTimeInMinutes={post.readTimeInMinutes}
						coverImageUrl={post.coverImage?.url}
					/>
				</div>
			))}
		</>
	);
};
