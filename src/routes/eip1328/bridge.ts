import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';

export async function get({ request, url, params }: RequestEvent): Promise<EndpointOutput> {
	console.log('Request', request, '\nParams', params, '\nURL', url);

	return {
		status: 200
	};
}
