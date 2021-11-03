# Svelte Dapp StarterKit 

This is my Svelte + Dapp StarterKit. 

## Code Structure

This repository is a PNPM Workspace (aka Monorepo) with (initially) two packages:

1. frontend - which hosts the SvelteKit app
2. dapp - for the dapp (Solidity) code

This was necessary as SvelteKit is an ESM project, and most of the tooling around dapp development are CommonJS so it's hard to keep both under the same `package.json`.

In the future new packages may be incorporated, as soon as we're finding opportunities 

## Todo

- [ ] Automate update contract address to the frontend
- [ ] Stage contract address?
