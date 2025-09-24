/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
	darkMode: 'class',
	content: ['./components/**/*.tsx', './pages/**/*.tsx'],
	theme: {
		extend: {
			colors: {
				'accent-1': '#FAFAFA',
				'accent-2': '#EAEAEA',
				'accent-7': '#333',
				success: '#0070f3',
				cyan: '#79FFE1',
				primary: {
					50: '#ecfdf5',
					100: '#d1fae5',
					200: '#a7f3d0',
					300: '#6ee7b7',
					400: '#34d399',
					500: '#00a587',
					600: '#059669',
					700: '#047857',
					800: '#065f46',
					900: '#064e3b',
					950: '#022c22',
				},
			},
			spacing: {
				28: '7rem',
			},
			letterSpacing: {
				tighter: '-.04em',
			},
			lineHeight: {
				tight: 1.2,
			},
			fontSize: {
				'5xl': '2.5rem',
				'6xl': '2.75rem',
				'7xl': '4.5rem',
				'8xl': '6.25rem',
			},
			boxShadow: {
				sm: '0 5px 10px rgba(0, 0, 0, 0.12)',
				md: '0 8px 30px rgba(0, 0, 0, 0.12)',
				'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
			},
			animation: {
				'shimmer': 'shimmer 2s linear infinite',
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'bounce-in': 'bounceIn 0.6s ease-out',
			},
			keyframes: {
				shimmer: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' },
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				bounceIn: {
					'0%': { transform: 'scale(0.3)', opacity: '0' },
					'50%': { transform: 'scale(1.05)', opacity: '0.8' },
					'70%': { transform: 'scale(0.95)', opacity: '0.9' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
			},
			backdropBlur: {
				xs: '2px',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		// Add safe area padding for mobile devices
		function({ addUtilities }) {
			const newUtilities = {
				'.safe-area-pb': {
					'padding-bottom': 'env(safe-area-inset-bottom)',
				},
				'.safe-area-pt': {
					'padding-top': 'env(safe-area-inset-top)',
				},
				'.line-clamp-2': {
					'overflow': 'hidden',
					'display': '-webkit-box',
					'-webkit-box-orient': 'vertical',
					'-webkit-line-clamp': '2',
				},
				'.line-clamp-3': {
					'overflow': 'hidden',
					'display': '-webkit-box',
					'-webkit-box-orient': 'vertical',
					'-webkit-line-clamp': '3',
				},
				'.scrollbar-hide': {
					/* IE and Edge */
					'-ms-overflow-style': 'none',
					/* Firefox */
					'scrollbar-width': 'none',
					/* Safari and Chrome */
					'&::-webkit-scrollbar': {
						'display': 'none'
					}
				},
			}
			addUtilities(newUtilities)
		}
	],
};
