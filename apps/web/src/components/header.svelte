<script lang="ts">
	import { onMount } from 'svelte';
	import { wallet } from '$lib/wallet';

	import Contact from './modals/contact.svelte';
	import Modal from './modals/modal.svelte';
	import { browser } from '$app/env';

	let opener: HTMLElement;
	let wrongModal = false;

	$: wrongModal = browser && !$wallet?.correctChain;
	$: console.log('Correct chain?', $wallet.correctChain);
	$: console.log('Current Account', $wallet.currentAccount);

	onMount(() => {
		document.addEventListener('keydown', (event: KeyboardEvent) => {
			if (event.key === 'Escape') opener.blur();
		});
		opener.addEventListener('touchstart', () => opener.focus());
		// opener.nextElementSibling.addEventListener('touchstart', () => opener.blur());
	});
</script>

<header id="top">
	<h1><a href="/">My Dapp</a></h1>
	{#if !$wallet.hasWallet}
		<p>You need a Wallet!</p>
	{:else if !$wallet.currentAccount}
		<button class="action" on:click={() => wallet.connect()}>Connect Wallet</button>
	{:else}
		<div class="info">
			{$wallet.currentAccount.slice(0, 6)}...{$wallet.currentAccount.slice(-4)}
		</div>
		<div class="info">{$wallet.chainId}</div>
	{/if}
	<button type="button" id="mainMenuOpen" hidden bind:this={opener} />
	<nav>
		<ul>
			<li><a href="/about" class="action">Sobre</a></li>
			<li><a href="/faq" class="action">FAQ</a></li>
			<li><a href="#contact" class="action" rel="external">Contato</a></li>
		</ul>
	</nav>
</header>

<Contact />

<Modal showClose={false} active={wrongModal}>
	<svelte:fragment slot="header">Wrong Network</svelte:fragment>
	<svelte:fragment slot="content">
		<p>Please change your network to Polygon.</p>
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<button on:click={() => wallet.changeNetwork('default')}>Change to Polygon</button>
	</svelte:fragment>
</Modal>

<style>
	header {
		padding: 0.5rem 1rem;
		flex-grow: 0;
		background: var(--color-chrome-bg);
		display: flex;
		border-bottom: var(--border-hairline);
	}
	header a {
		display: inline-block;
		text-decoration: none;
		color: var(--color-flowText);
	}
	header nav {
		padding: 0.5em 0;
	}
	header li {
		display: inline;
		list-style: none;
		margin-left: 1.5em;
	}
	header li a {
		transition: transform 0.3s;
	}
	header li a:focus,
	header li a:hover {
		transform: scale(1.25);
	}
	h1 {
		font-size: 1.5em;
	}
	h1 ~ * {
		flex-grow: 0;
	}
	#mainMenuOpen + nav ul:after {
		top: 0.88rem;
		right: 0.85rem;
		width: 1.5rem;
		height: 1.5rem;
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 352 512'%3E%3Cpath fill='%23800' d='M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z'%3E%3C/path%3E%3C/svg%3E")
			center center no-repeat;
		background-size: cover;
	}
	#mainMenuOpen + nav ul:before {
		font-size: 1.5rem;
		padding: 0.5rem 1rem;
		background: var(--color-chrome-bg);
		border-bottom: 1px solid var(--color-shadow);
	}
	@media (max-width: 48rem) {
		#mainMenuOpen {
			display: block;
			flex-grow: 0;
			line-height: 1;
			width: 2em;
			height: 2em;
			border: 0;
			background: transparent
				url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath fill='black' d='M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z'%3E%3C/path%3E%3C/svg%3E")
				center center no-repeat;
			background-size: 1.8em 1.8em;
		}
		#mainMenuOpen + nav {
			position: fixed;
			top: 0;
			left: -100%;
			width: 100%;
			height: 100%;
			overflow: auto;
			display: flex;
			align-items: center;
			justify-content: center;
			opacity: 0;
			background: var(--color-modal-fader);
			transition: left 0s 0.5s, opacity 0.5s;
		}
		#mainMenuOpen:focus + nav,
		#mainMenuOpen + nav:focus-within {
			left: 0;
			opacity: 1;
			transition: left 0s, opacity 0.5s;
		}
		#mainMenuOpen + nav ul {
			flex-grow: 0;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			position: relative;
			top: -50vh;
			max-width: 16em;
			margin: auto;
			overflow: hidden;
			background: var(--color-modal-bg);
			box-shadow: var(--shadow-chrome);
			border: var(--border-hairline);
			border-radius: var(--borderRadius-outer);
			transition: top 0.5s;
		}
		#mainMenuOpen:focus + nav ul,
		#mainMenuOpen + nav:focus-within ul {
			top: 0;
		}
		#mainMenuOpen + nav li {
			width: 34%;
			margin: 0 1em 1em;
		}
		#mainMenuOpen + nav li:nth-child(even) {
			margin-left: 0;
		}
		header > nav a,
		header > nav a.action {
			display: block;
			padding: 0.5em 1em;
			text-align: center;
			background: var(--color-chrome-bg);
			box-shadow: none;
			border: var(--border-hairline);
			border-radius: 0.25em;
			transition: transform 0.3s;
		}
		header > nav a:focus,
		header > nav a:hover,
		header > nav a.action:focus,
		header > nav a.action:hover {
			transform: scale(1.1);
			box-shadow: none;
		}
		#mainMenuOpen + nav ul:before {
			content: 'Main Menu';
			display: block;
			width: 100%;
			margin-bottom: 1rem;
			font-weight: bold;
			background: var(--color-chrome-bg);
			border-bottom: 1px solid var(--color-shadow);
		}
		#mainMenuOpen + nav ul:after {
			content: '';
			display: block;
			position: absolute;
		}
	}
	.action {
		padding: 0.5rem 1rem;
		height: 2rem;
	}
	.info {
		padding: 0.5rem 1rem;
		background-color: skyblue;
		color: white;
		font-weight: bold;
		border-radius: 3px;
	}
</style>
