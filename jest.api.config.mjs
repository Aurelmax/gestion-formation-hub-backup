/** @type {import('jest').Config} */
export default {
  displayName: 'API Tests',
  testEnvironment: 'node',
  
  testMatch: [
    '**/tests/api/**/*.test.ts',
    '**/tests/api/**/*.test.js'
  ],
  
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: 'tsconfig.json',
    },
  },
  
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
    '^@/components/(.*)$': '<rootDir>/app/components/$1',
    '^@/lib/(.*)$': '<rootDir>/app/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/app/hooks/$1',
  },
  
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  setupFiles: ['<rootDir>/jest.env.setup.js'],
  
  collectCoverageFrom: [
    'app/api/**/*.{ts,js}',
    '!app/api/**/*.d.ts',
  ],
  
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))'
  ],
  
  testTimeout: 30000,
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
};