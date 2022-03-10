<script lang="ts">
	import Modal from './_FormModal.svelte';
</script>

<Modal id="contact" method="post" target="/api/contact">
	<svelte:fragment slot="header">Contact Us</svelte:fragment>
	<svelte:fragment slot="fieldset">
		<label>
			Your Name<br />
			<input type="text" name="name" required /><br />
		</label><label>
			E-Mail Address<br />
			<input type="email" name="email" required /><br />
		</label><label>
			Phone Number<br />
			<input type="text" name="phone" /><br />
		</label><label>
			Subject<br />
			<input type="text" name="subject" required /><br />
		</label><label>
			Message<br />
			<textarea name="message" required /><br />
		</label>
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<button>Submit</button>
	</svelte:fragment>
</Modal>
