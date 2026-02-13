import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://othnielagera.netlify.app',
	integrations: [tailwind()],
	output: 'server',
	adapter: node({
		mode: 'standalone',
	}),
});
