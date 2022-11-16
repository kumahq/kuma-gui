import { describe, expect, test } from '@jest/globals'

import { getAppGuiPath } from './getAppGuiPath'

describe('getAppGuiPath', () => {
  test.each([
    ['https://example.com/gui', '/gui'],
    ['https://example.com/gui/', '/gui'],
    ['https://gui.example.com/gui/', '/gui'],
    ['https://example.com/dev/gui', '/dev/gui'],
    ['https://example.com/dev/gui/', '/dev/gui'],
    ['https://gui.example.com/dev/gui/', '/dev/gui'],
    ['https://example.com/guillermo/dev/gui', '/guillermo/dev/gui'],
    ['https://example.com/guillermo/dev/gui/', '/guillermo/dev/gui'],
    ['https://gui.example.com/guillermo/dev/gui/', '/guillermo/dev/gui'],
    ['https://example.com/gui/dev/gui', '/gui'],
    ['https://example.com/gui/dev/gui/', '/gui'],
    ['https://gui.example.com/gui/dev/gui/', '/gui'],
    ['https://example.com', ''],
    ['https://example.com/', ''],
    ['https://gui.example.com/', ''],
    ['https://example.com/ui', ''],
    ['https://example.com/ui/', ''],
    ['https://gui.example.com/ui/', ''],
  ])('“%s” → “%s”', (url, expectedAppBasePath) => {
    expect(getAppGuiPath(new URL(url))).toBe(expectedAppBasePath)
  })
})
