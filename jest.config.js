/** @typedef {import('jest').Config} Config */

/** @type {Config} */ const config = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    // Workaround for the “ReferenceError: Vue is not defined” introduced by @testing-library.
    // See: https://stackoverflow.com/a/72608494/2036825
    customExportConditions: ['node', 'node-addons'],
  },
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
    'ts',
  ],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.ts$': [
      'ts-jest',
      {
        // To test Vue/TypeScript files using Jest, we need to use ESM and the Babel configuration.
        useESM: true,
        babelConfig: true,
      },
    ],
    '^.+\\.js$': 'babel-jest',
    '^.+\\.svg(\\?(url|raw))?$': 'jest-transform-stub',
    '^.+\\.(css|png|gif)?$': 'jest-transform-stub',
  },
  transformIgnorePatterns: [
    // Not transforming amcharts speeds up the the tests significantly.
    '[/\\\\]node_modules[/\\\\](?!(@amcharts)\\/).+\\.js$',
  ],
  moduleNameMapper: {
    '^@/(.*)\\.svg\\?(url|raw)$': 'jest-transform-stub',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: [
    'jest-serializer-vue',
  ],
  testMatch: [
    '**/src/**/*.spec.(js|ts)',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/jest-setup.ts',
  ],
}

module.exports = config
