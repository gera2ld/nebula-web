// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}

interface INebulaHost {
	type: 'lighthouse' | 'host';
	name: string;
	ip: string;
	relay: boolean;
	publicIp: string;
}

interface INebulaNetwork {
	name: string;
	ip: string;
	staticHostMap: Record<string, string[]>;
	hosts: INebulaHost[];
}

interface INebulaData {
	ca?: {
		name: string;
		crt: string;
	};
	networks: INebulaNetwork[];
}
