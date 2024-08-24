/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['./tests/jest-setup-file.ts'],
  setupFilesAfterEnv: ['./tests/jest-setup-file-after-env.ts'],
};
