import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class SubnotoApi implements ICredentialType {
	name = 'subnotoApi';

	displayName = 'Subnoto API';

	documentationUrl = 'https://subnoto.com/documentation/developers/sdks/typescript';

	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'apiBaseUrl',
			type: 'string',
			default: 'https://enclave.subnoto.com',
			required: true,
			description: 'Subnoto API base URL',
		},
		{
			displayName: 'Access Key',
			name: 'accessKey',
			type: 'string',
			default: '',
			required: true,
			description: 'API access key',
		},
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'API secret key',
		},
		{
			displayName: 'Unattested Mode',
			name: 'unattested',
			type: 'boolean',
			default: false,
			description: 'Use unattested mode (default: false)',
		},
	];
}
