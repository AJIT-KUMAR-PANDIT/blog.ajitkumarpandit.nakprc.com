import { Analytics } from './analytics';
import { BottomNavigation } from './bottom-navigation';
import { Footer } from './footer';
import { Integrations } from './integrations';
import { Meta } from './meta';
import { Scripts } from './scripts';
import { TopNav } from './top-nav';

type Props = {
	children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
		return (
			<>
				<Meta />
				<Scripts />
				{/* Global fixed top navigation */}
				<TopNav />
				<div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
					{/* Add top padding to account for fixed nav height */}
					<main className="pt-20 pb-20 lg:pb-8">{children}</main>
					{/* Global bottom navigation (mobile) */}
					<div className="block lg:hidden">
						<BottomNavigation />
					</div>
				</div>
				{/* Footer - Full width outside of main content */}
				<Footer />
				<Analytics />
				<Integrations />
			</>
			);
};
