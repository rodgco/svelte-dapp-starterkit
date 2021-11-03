/// <reference types="@sveltejs/kit" />

interface EthereumWindow extends Window {
	ethereum: providers.ExternalProvider;
}
