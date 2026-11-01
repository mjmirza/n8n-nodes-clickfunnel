// Mirrors the rule set n8n's verification scanner (@n8n/scan-community-package) applies.
import { n8nCommunityNodesPlugin } from '@n8n/eslint-plugin-community-nodes';
import tsParser from '@typescript-eslint/parser';
import n8nNodesBase from 'eslint-plugin-n8n-nodes-base';
import { defineConfig } from 'eslint/config';

const SHIPPED = ['package.json', 'nodes/**/*.ts', 'credentials/**/*.ts'];

export default defineConfig(
	{ ignores: ['dist/**', 'node_modules/**'] },
	// Community-node rules apply to what ships. Tests and build config are dev-only.
	{ ...n8nCommunityNodesPlugin.configs.recommended, files: SHIPPED },
	{ files: SHIPPED, rules: { 'no-console': 'error' } },
	{ files: ['tests/**/*.ts'], rules: { 'no-eval': 'error' } },
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
	{ files: ['*.js'], languageOptions: { sourceType: 'commonjs', globals: { module: 'writable', require: 'readonly' } } },
);
