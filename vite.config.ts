import { resolve } from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import unoCSS from '@unocss/vite';
import presetUno from '@unocss/preset-uno';
import transformerDirectives from '@unocss/transformer-directives';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [
		unoCSS({
			presets: [
				presetUno({
					dark: 'media'
				})
			],
			shortcuts: {
				't-border':
					'border-gray-400 dark:border-gray-600 hover:border-gray-600 dark:hover:border-gray-400',
				't-card': 'rounded border t-border px-4 py-2'
			},
			transformers: [transformerDirectives()]
		}),
		sveltekit()
	],
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
