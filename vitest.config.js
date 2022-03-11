import { extractFromSvelteConfig } from 'vitest-svelte-kit';

export default {
	...extractFromSvelteConfig(),
	test: {
		deps: {
			inline: ['@ethersproject/signing-key']
		}
	}
};
