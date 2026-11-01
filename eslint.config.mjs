// Mirrors the rule set n8n's verification scanner (@n8n/scan-community-package) applies.
import { n8nCommunityNodesPlugin } from '@n8n/eslint-plugin-community-nodes';
import tsParser from '@typescript-eslint/parser';
import n8nNodesBase from 'eslint-plugin-n8n-nodes-base';
import { defineConfig } from 'eslint/config';

export default defineConfig(
	{ ignores: ['dist/**', 'node_modules/**', 'tests/**', '*.js', '*.mjs'] },
	n8nCommunityNodesPlugin.configs.recommended,
	{ rules: { 'no-console': 'error' } },
	{ plugins: { 'n8n-nodes-base': n8nNodesBase } },
	{ files: ['package.json'], rules: { ...n8nNodesBase.configs.community.rules } },
	{
		files: ['**/credentials/**/*.ts'],
		rules: {
			...n8nNodesBase.configs.credentials.rules,
			'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',
			'n8n-nodes-base/cred-class-field-type-options-password-missing': 'off',
		},
	},
	{
		files: ['**/nodes/**/*.ts'],
		rules: {
			...n8nNodesBase.configs.nodes.rules,
			'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'off',
			'n8n-nodes-base/node-class-description-outputs-wrong': 'off',
			'n8n-nodes-base/node-param-type-options-max-value-present': 'off',
		},
	},
	{ files: ['**/*.json', '**/*.ts'], languageOptions: { parser: tsParser } },
);
