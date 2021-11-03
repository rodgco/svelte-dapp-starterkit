import type { Writable } from 'svelte/store';

export interface GreeterStore<T> extends Writable<T> {
	greet(): Promise<T>;
	setGreeting(signer: Signer, message: T): void;
}
