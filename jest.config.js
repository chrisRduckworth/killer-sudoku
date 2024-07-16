/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ["__tests__/shapes\.ts"]
};