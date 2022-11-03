import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'

// Polyfills `window.fetch` for Jest because it runs in a Node environment where fetch isn’t available. It initially looked like this would change with Node.js 18, but that is not so.
import 'isomorphic-fetch'

import { config } from '@vue/test-utils'

import { replaceAttributesSnapshotSerializer } from './jest-replace-attribute-snapshot-serializer'
import { createRouter } from '../src/router/router'
import { setupMockServer } from '../src/api/setupMockServer'

/**
 * Adds the application’s router to vue test utils so that tests don’t have to set-up a new router instance on their own.
 */
const router = createRouter()
config.global.plugins.push(router)

/**
 * amcharts need SVGPathElement defined for our tests to work.
 *
 * See: https://github.com/amcharts/amcharts4/issues/1387
 */
Object.defineProperty(window, 'SVGPathElement', { value: class extends HTMLElement { } })

/**
 * Kongponents uses generated UUIDs for several attribute values.
 * This breaks the project’s snapshot tests since they’re based on fully-mounted components
 * which also includes those from external sources like Kongponents.
 *
 * In order to stabilize the tests which otherwise fail because the attribute values are different every run,
 * we use a custom snapshot serializer to replace those attribute values with one fixed value.
 */
expect.addSnapshotSerializer(replaceAttributesSnapshotSerializer([
  'id',
  'aria-describedby',
  'aria-labelledby',
  'aria-controls',
  'data-tableid',
]))

const server = setupMockServer(import.meta.env.VITE_KUMA_API_SERVER_URL)

// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())

export { router, server }
