module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>/tests'],
	testMatch: ['**/*.test.ts'],
	transform: {
		'^.+\\.ts$': ['ts-jest', { tsconfig: { types: ['jest', 'node'], esModuleInterop: true, strict: true } }],
	},
	collectCoverageFrom: ['nodes/**/*.ts', 'credentials/**/*.ts', '!**/dist/**'],
};
