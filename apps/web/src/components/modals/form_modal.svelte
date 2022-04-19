<script lang="ts">
	export let id: string;
	export let target: string;
	export let method: string = 'POST';
</script>

<form {id} class="modal" {target} {method}>
	<!-- svelte-ignore a11y-missing-content a11y-invalid-attribute -->
	<a href="#" class="modalClose" hidden />
	<div>
		<h2><slot name="header" /></h2>
		<!-- svelte-ignore a11y-missing-content a11y-invalid-attribute -->
		<a href="#" class="modalClose" hidden />
		<fieldset>
			<slot name="fieldset" />
		</fieldset>
		<footer>
			<slot name="footer" />
		</footer>
	</div>
</form>

<style media="screen">
	form {
		position: fixed;
		bottom: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		padding: 0.5em;
		overflow: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-modal-fader);
		opacity: 0;
		transition: left 0s 0.5s, opacity 0.5s;
	}
	form:target {
		left: 0;
		opacity: 1;
		transition: left 0s, opacity 0.5s;
	}
	.modalClose {
		display: block;
		position: absolute;
		text-decoration: none;
	}
	form > .modalClose {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	form > div .modalClose {
		top: 0.88rem;
		right: 0.85rem;
		width: 1.5rem;
		height: 1.5rem;
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 352 512'%3E%3Cpath fill='%23800' d='M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z'%3E%3C/path%3E%3C/svg%3E")
			center center no-repeat;
		background-size: cover;
	}
	form h2 {
		font-size: 1.5rem;
		padding: 0.5rem 1rem;
		background: var(--color-chrome-bg);
		border-bottom: 1px solid var(--color-shadow);
	}
	form > div {
		flex-grow: 0;
		position: relative;
		top: -50%;
		width: 100%;
		margin: auto;
		overflow: hidden;
		transition: top 0.5s;
		background: var(--color-modal-bg);
		box-shadow: var(--shadow-chrome);
		border: var(--border-hairline);
		border-radius: var(--borderRadius-outer);
		max-width: var(--maxWidth-modalForm);
	}
	form:target > div {
		top: 0;
	}
	form > div > fieldset {
		padding: var(--pad);
	}
	form > div > footer {
		padding: 0 var(--pad) var(--pad);
	}
	form :global(input:not([type='checkbox']):not([type='radio'])),
	form :global(textarea) {
		width: 100%;
		padding: 0.25em 0.5em;
		margin: 0.25em 0 0.5em;
		border: var(--border-hairline);
		border-radius: var(--borderRadius-inner);
	}
	form :global(label) {
		display: block;
		text-indent: 0.5em;
	}
	form footer :global(button) {
		display: inline-block;
		padding: 0.5em 1em;
		text-decoration: none;
		background: var(--color-chrome-bg);
		border: var(--border-hairline);
		border-radius: var(--borderRadius-inner);
		box-shadow: var(--shadow-button);
		color: var(--color-flowText);
		transition: transform 0.5s;
	}
	form footer :global(button:focus),
	form footer :global(button:hover) {
		transform: scale(1.2);
	}
</style>
