<script>
	import wallet from '$lib/wallet';
</script>

<header>
	{#if !$wallet.active}
		<p>You need a Wallet!</p>
	{:else if !$wallet.connected}
		<button on:click={() => wallet.connect()}>Connect Wallet</button>
	{:else}
		<div>{$wallet.account.slice(0, 6)}...{$wallet.account.slice(-4)}</div>
		<div>{$wallet.chain_id}</div>
		{#if $wallet.chain_id != '0x89'}
			<button on:click={() => wallet.changeNetwork('mumbai')}>Change to Polygon</button>
		{/if}
	{/if}
</header>

<style>
	header {
		padding: 0 1rem;
		width: 100%;
		height: 4rem;
		background-color: yellow;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	button {
		padding: 0.5rem 1rem;
		height: 2rem;
	}

	div {
		padding: 0.5rem 1rem;
		background-color: skyblue;
		color: white;
		font-weight: bold;
		border-radius: 3px;
	}
</style>
