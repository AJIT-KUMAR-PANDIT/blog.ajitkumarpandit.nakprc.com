import { Analytics } from './analytics';
import { BottomNavigation } from './bottom-navigation';
import { Integrations } from './integrations';
import { Meta } from './meta';
import { Scripts } from './scripts';

type Props = {
	children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
	return (
		<>
			<Meta />
			<Scripts />
			<div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
				<main className="pb-20 lg:pb-8">{children}</main>
				<div className="block lg:hidden">
					<BottomNavigation />
				</div>
			</div>
			<Analytics />
			<Integrations />
		</>
	);
};
