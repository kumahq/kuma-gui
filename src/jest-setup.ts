import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import { replaceAttributesSnapshotSerializer } from './jest-replace-attribute-snapshot-serializer'
import { server as setupServer } from '@/services/mocks'

import './kongponents'

class SVGPathElement extends HTMLElement { }

// @ts-ignore
window.SVGPathElement = SVGPathElement

/**
 * Kongponents v6 uses a call to `crypto.getRandomValues` which isn’t implemented in jsdom by default.
 * To make the tests run, we supply it via Node’s `crypto` library.
 *
 * See: https://github.com/jsdom/jsdom/issues/1612
 */
Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (array: []) => require('crypto').randomBytes(array.length),
  },
})

/**
 * Kongponents v6 uses generated UUIDs for several attribute values.
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
]))

const server = setupServer('http://localhost/')

// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())

export { server }
