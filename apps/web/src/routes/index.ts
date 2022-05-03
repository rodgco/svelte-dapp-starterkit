import { greeter } from '$lib/wallet';

/** @type {import('./items').RequestHandler} */
export async function get() {
	let greet = '';

	greet = await greeter.greet();

	return {
		body: { greet }
	};
}
