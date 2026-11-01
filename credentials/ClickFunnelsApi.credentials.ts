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
				Authorization: '=Bearer {{$credentials.accessToken}}',
				Accept: 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://{{$credentials.subdomain}}.myclickfunnels.com/api/v2',
			url: '/teams',
			method: 'GET',
		},
	};
}
