import {
	Icon,
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ClickFunnelsApi implements ICredentialType {
	name = 'clickFunnelsApi';
	displayName = 'ClickFunnels API';
	documentationUrl = 'https://developers.myclickfunnels.com/';

	icon: Icon = {
		light: 'file:../nodes/ClickFunnels/clickfunnels.svg',
		dark: 'file:../nodes/ClickFunnels/clickfunnels.dark.svg',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'Subdomain',
			name: 'subdomain',
			type: 'string',
			default: '',
			placeholder: 'myworkspace',
			description:
				'Your ClickFunnels workspace subdomain. For example, if your workspace URL is https://myworkspace.myclickfunnels.com, enter "myworkspace".',
			required: true,
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			placeholder: 'pat_xxxxxxxxxxxxxxxxxxxx',
			description:
				'Your ClickFunnels API access token. Generate one at Settings → API Access Tokens in your workspace.',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				// Same normalisation as the node transport: trims, unwraps quotes, drops a pasted Bearer prefix.
				Authorization: `=Bearer {{ String($credentials.accessToken).trim().replace(/^(["'])(.*)\\1$/, '$2').replace(/^Bearer[ \\t]+/i, '') }}`,
				Accept: 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			// Strips everything but [a-z0-9-] so the token can only ever go to *.myclickfunnels.com.
			baseURL: `={{ 'https://' + String($credentials.subdomain).trim().toLowerCase().replace(/^https?:[/][/]/, '').replace(/[.]myclickfunnels[.]com.*$/, '').replace(/[^a-z0-9-]/g, '') + '.myclickfunnels.com/api/v2' }}`,
			url: '/teams',
			method: 'GET',
		},
	};
}
