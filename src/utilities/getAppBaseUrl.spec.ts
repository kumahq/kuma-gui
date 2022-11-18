import { describe, expect, test } from '@jest/globals'

import { getAppBaseUrl } from './getAppBaseUrl'

describe('getAppBaseUrl', () => {
  test.each([
    ['https://example.com/gui', 'https://example.com'],
    ['https://example.com/gui/', 'https://example.com'],
    ['https://example.com/gui/mesh/default', 'https://example.com'],
    ['https://gui.example.com/gui/', 'https://gui.example.com'],
    ['https://gui.example.com/gui/mesh/default', 'https://gui.example.com'],
    ['https://example.com/dev/gui', 'https://example.com/dev'],
    ['https://example.com/dev/gui/', 'https://example.com/dev'],
    ['https://example.com/dev/gui/mesh/default', 'https://example.com/dev'],
    ['https://gui.example.com/dev/gui/', 'https://gui.example.com/dev'],
    ['https://example.com/guillermo/dev/gui', 'https://example.com/guillermo/dev'],
    ['https://example.com/guillermo/dev/gui/', 'https://example.com/guillermo/dev'],
    ['https://gui.example.com/guillermo/dev/gui/', 'https://gui.example.com/guillermo/dev'],
    ['https://example.com/gui/dev/gui', 'https://example.com'],
    ['https://example.com/gui/dev/gui/', 'https://example.com'],
    ['https://gui.example.com/gui/dev/gui/', 'https://gui.example.com'],
    ['https://example.com', 'https://example.com'],
    ['https://example.com/', 'https://example.com'],
    ['https://gui.example.com/', 'https://gui.example.com'],
    ['https://example.com/ui', 'https://example.com/ui'],
    ['https://example.com/ui/', 'https://example.com/ui'],
    ['https://gui.example.com/ui/', 'https://gui.example.com/ui'],
  ])('“%s” → “%s”', (url, expectedAppBasePath) => {
    expect(getAppBaseUrl(new URL(url))).toBe(expectedAppBasePath)
  })
})
