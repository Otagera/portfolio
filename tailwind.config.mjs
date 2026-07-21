import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
			},
			typography: {
				DEFAULT: {
					css: {
						// Kill the default backtick pseudo-elements around inline code
						'code::before': { content: 'none' },
						'code::after': { content: 'none' },
					},
				},
			},
		},
	},
	plugins: [typography],
};