import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import { server as setupServer } from '@/services/mocks'

import './kongponents'

class SVGPathElement extends HTMLElement {}

// @ts-ignore
window.SVGPathElement = SVGPathElement

const server = setupServer('http://localhost/')

// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())

export { server }
