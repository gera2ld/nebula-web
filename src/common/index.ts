import { browser } from '$app/environment';
import { debounce } from 'lodash-es';
import { nebulaData } from './store';

export { nebulaData };

export async function api<T = unknown>({ command, args }: { command: string; args?: any[] }) {
	const resp = await fetch('/api', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			command,
			args
		})
	});
	const { result, error } = await resp.json();
	if (error) throw error;
	return result as T;
}

export let loading: Promise<void>;

const dumpData = debounce(dumpDataOnce);

if (browser) loadData();

function syncData() {
	let loaded = false;
	nebulaData.subscribe((update) => {
		if (!loaded) loaded = true;
		else dumpData(update);
	});
}

async function loadDataOnce() {
	const data = await api<INebulaData>({ command: 'loadData' });
	nebulaData.update(() => data);
	syncData();
}

export function loadData() {
	loading = loadDataOnce();
	return loading;
}

function dumpDataOnce(data: INebulaData) {
	return api<void>({
		command: 'dumpData',
		args: [
			{
				networks: data.networks
			}
		]
	});
}

export function setUpCA(name: string) {
	return api<{ crt: string }>({ command: 'createCA', args: [name] });
}

export function signCert(params: { name: string; ipRange: string; pub?: string }) {
	return api<{ crt: string; key?: string }>({ command: 'signCert', args: [params] });
}
