import { writable } from 'svelte/store';

export const nebulaData = writable<INebulaData>({
	networks: []
});
