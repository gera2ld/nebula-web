function getRelayConfig(relays: string[] | boolean) {
	if (relays === true) {
		return {
			am_relay: true,
			use_relays: false
		};
	}
	return {
		am_relay: false,
		use_relays: true,
		relays: relays || []
	};
}

const baseConfig = {
	pki: {
		ca: '/etc/nebula/ca.crt',
		cert: '/etc/nebula/host.crt',
		key: '/etc/nebula/host.key'
	},
	lighthouse: {
		am_lighthouse: true
	},
	listen: {
		host: '0.0.0.0',
		port: 4242
	},
	firewall: {
		outbound: [
			{
				port: 'any',
				proto: 'any',
				host: 'any'
			}
		],
		inbound: [
			{
				port: 'any',
				proto: 'icmp',
				host: 'any'
			}
		]
	}
};

export function getLighthouseConfig(relays = true) {
	const data = {
		...baseConfig,
		relay: getRelayConfig(relays)
	};
	return data;
}

export function getHostConfig(params: {
	staticHostMap: Record<string, string[]>;
	lighthouseHosts: string[];
	relays: string[] | boolean;
}) {
	const data = {
		...baseConfig,
		lighthouse: {
			am_lighthouse: false,
			hosts: params.lighthouseHosts
		},
		static_host_map: params.staticHostMap,
		relay: getRelayConfig(params.relays)
	};
	return data;
}
