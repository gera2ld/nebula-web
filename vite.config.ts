import { resolve } from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		}
	},
	server: {
		proxy: {
			'/api': 'http://localhost:4000'
		}
	}
};

export default config;
