import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import '../styles/index.css';
import '../styles/scrollbar.css';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<Component {...pageProps} />
		</ThemeProvider>
	);
}
