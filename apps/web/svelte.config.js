import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					$components: path.resolve('./src/components')
				}
			},
			define: {
				global: JSON.stringify({})
			},
			optimizeDeps: {
				esbuildOptions: {
					// Node.js global to browser globalThis
					define: {
						global: 'globalThis'
					},
					// Enable esbuild polyfill plugins
					plugins: [
						NodeGlobalsPolyfillPlugin({
							buffer: true
						})
					]
				}
			}
		}
	}
};
export default config;
