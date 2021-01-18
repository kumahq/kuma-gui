import { getLastDate, verifyVersion } from '@/helpers'

describe('getLastDate', () => {
  const testCases = [
    [undefined, undefined, null],
    [undefined, '2021-01-18T12:50:00.920962+01:00', null],
    ['2021-01-18T12:50:00.920962+01:00', '2021-01-18T12:51:00.920962+01:00', null],
    [
      undefined,
      new Date(2020, 0, 18, 12, 50, 0, 111),
      new Date(2020, 0, 18, 12, 50, 0, 111),
    ],
    [
      new Date(2020, 0, 23, 12, 50, 0, 661),
      new Date(2020, 0, 18, 12, 50, 0, 412),
      new Date(2020, 0, 23, 12, 50, 0, 661),
    ],
    [
      new Date(2010, 0, 23, 12, 50, 0, 661),
      new Date(2021, 0, 18, 12, 50, 0, 412),
      new Date(2021, 0, 18, 12, 50, 0, 412),
    ],
  ]

  test.each(testCases)(
    'getLastDate(%s, %s) should return %s',
    (a, b, expected) => {
      expect(getLastDate(a, b)).toEqual(expected);
    }
  );
})

describe('verifyVersion', () => {
  it('should properly validate version when condition is string', function () {
    const testCases = [
      ['0.0.1', '0.0.1', true],
      ['0.9.1', '0.9', true],
      ['0.9.2', '0.9.1', false],
      ['0.6.0', '0.7.0', false],
      ['0.8.0', '0.7.0', false],
    ]
  })
})
