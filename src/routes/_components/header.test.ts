import { beforeEach, test, expect } from 'vitest';
import { cleanup, render } from '@testing-library/svelte';

import Header from './header.svelte';

beforeEach(cleanup);

test('can render', () => {
	render(Header);
});

test('can find the correct page title', () => {
	const { getByText } = render(Header);
	expect(getByText('My Dapp')).toBeDefined();
});
