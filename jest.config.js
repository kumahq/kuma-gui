/** @typedef {import('jest').Config} Config */

/** @type {Config} */ const config = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    // Workaround for the “ReferenceError: Vue is not defined” when importing `config` from `@vue/test-utils`.
    // See: https://github.com/vuejs/vue-jest/issues/479
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
  setupFiles: [
    '<rootDir>/jest/jest-setup.ts',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest/jest-setup-after-env.ts',
  ],
}

module.exports = config
