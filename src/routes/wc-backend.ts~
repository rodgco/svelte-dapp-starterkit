import WalletConnect from '@walletconnect/client';

export async function get() {
	return new Promise((resolve, reject) => {
		const connector = new WalletConnect({
			bridge: 'https://svelte-dapp-starterkit.vercel.app/eip1328/bridge'
		});

		if (!connector.connected) {
			// create new session
			connector.createSession();
		}

		// Subscribe to connection events
		connector.on('connect', (error, payload) => {
			if (error) {
				throw error;
			}
			// After the connection is successful, the wallet account and chain ID will be returned
			const { accounts, chainId } = payload.params[0];
			console.log('On Connect.\nAccounts:', accounts, '\nChain', chainId);
		});

		connector.on('display_uri', function (error, payload) {
			if (error)
				reject({
					status: 500,
					body: {
						error
					}
				});
			resolve({
				status: 200,
				body: {
					uri: payload.params[0]
				}
			});
		});
	});
}
