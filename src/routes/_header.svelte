<script>
	import greeter from '$lib/greeter';
</script>

<header>
	{#if !$greeter.active}
		<p>You need a Wallet!</p>
	{:else if !$greeter.connected}
		<button on:click={() => greeter.connect()}>Connect Wallet</button>
	{:else}
		<div>{$greeter.account.slice(0, 6)}...{$greeter.account.slice(-4)}</div>
		<div>{$greeter.chain_id}</div>
		{#if $greeter.chain_id != '0x13881'}
			<button on:click={() => greeter.changeNetwork('mumbai')}>Change to Polygon</button>
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
