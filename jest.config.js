export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
      useESM: false
    }]
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^octokit$': '<rootDir>/tests/__mocks__/octokit.ts'
  },
  testTimeout: 10000,
  transformIgnorePatterns: [
    'node_modules/(?!(octokit|@octokit)/)'
  ],
  moduleDirectories: ['node_modules', 'tests/__mocks__'],
  automock: false,
  resetMocks: false,
  extensionsToTreatAsEsm: ['.ts']
};
