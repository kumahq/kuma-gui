import { describe, test, expect } from '@jest/globals'

import { getLabels } from './getLabels'

describe('getLabels', () => {
  test.each([
    [undefined, []],
    [null, []],
    [{}, []],
    [{ label: 'value' }, [{ label: 'label', value: 'value' }]],
  ])('works', (labels, expectedLabels) => {
    expect(getLabels(labels)).toEqual(expectedLabels)
  })
})
