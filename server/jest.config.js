/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',
  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',
  // The glob patterns Jest uses to detect test files
  // testMatch: [
  //   "**/__tests__/**/*.[jt]s?(x)",
  //   "**/?(*.)+(spec|test).[tj]s?(x)"
  // ],
}

export default config
