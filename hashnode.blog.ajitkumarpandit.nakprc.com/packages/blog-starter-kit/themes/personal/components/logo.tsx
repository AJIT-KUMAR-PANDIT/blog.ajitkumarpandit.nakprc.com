import { ASSETS } from '../lib/constants';

interface LogoProps {
	className?: string;
	width?: number;
	height?: number;
	priority?: boolean;
}

export const Logo = ({
	className = 'h-10 w-auto transition-transform duration-300 group-hover:scale-105',
	width = 100,
	height = 50,
	priority = true,
}: LogoProps) => {
	return (
		<img
			src={ASSETS.LOGO}
			alt={ASSETS.LOGO_ALT}
			width={width}
			height={height}
			className={className}
			style={{ width: width, height: height }}
		/>
	);
};
