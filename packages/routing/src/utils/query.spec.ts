import { describe, expect, test } from 'vitest'

import { mergeQuery, normalizeUrlParam } from './query'

describe('normalizeUrlParam', () => {
  test.each([
    // Warning: AI generated tests.
    // As they are pretty basic and partially test JS itself
    // feel free to remove/alter if they are annoying. They are mainly added for
    // documentation purposes and the slight non-native-JS-function logic testing
    // ** If you are a human you should add tests above this comment **

    // Boolean Constructor tests
    ['Boolean constructor with null returns true', [null, Boolean], true],
    ['Boolean constructor with empty string returns false', ['', Boolean], false],
    ['Boolean constructor with truthy string returns true', ['any-value', Boolean], true],
    ['Boolean constructor with "0" returns true', ['0', Boolean], true],
    ['Boolean constructor with "false" string returns true', ['false', Boolean], true],

    // Boolean Literal tests
    ['true literal with null returns true', [null, true], true],
    ['false literal with null returns true', [null, false], true],
    ['true literal with any value returns true', ['anything', true], true],
    ['false literal with any value returns false', ['anything', false], false],
    ['false literal with empty string returns false', ['', false], false],

    // Number Constructor tests
    ['Number constructor with null returns 0', [null, Number], 0],
    ['Number constructor with empty string returns 0', ['', Number], 0],
    ['Number constructor with "42" returns 42', ['42', Number], 42],
    ['Number constructor with "3.14" returns 3.14', ['3.14', Number], 3.14],
    ['Number constructor with negative number string', ['-10', Number], -10],
    ['Number constructor decodes encoded space before parsing', ['100%20', Number], 100],
    ['Number constructor parses scientific notation', ['1e10', Number], 10000000000],
    ['Number constructor parses with leading zeros', ['007', Number], 7],
    ['Number constructor handles negative zero', ['-0', Number], -0],
    ['Number constructor parses leading decimal', ['.5', Number], 0.5],
    ['Number constructor parses trailing decimal', ['5.', Number], 5],

    // Number Literal (with default) tests
    ['Number literal with null returns default', [null, 10], 10],
    ['Number literal with empty string returns default', ['', 10], 10],
    ['Number literal with valid number returns parsed value', ['42', 10], 42],
    ['Number literal with invalid string returns default', ['invalid', 10], 10],
    ['Number literal with decimal string returns parsed value', ['3.14', 99], 3.14],
    ['Number literal with negative number string', ['-5', 0], -5],
    ['Number literal with "0" returns 0 not default', ['0', 10], 0],
    ['Number literal parses scientific notation', ['1e5', 10], 100000],
    ['Number literal parses with leading zeros', ['007', 10], 7],
    ['Number literal handles negative zero', ['-0', 10], -0],
    ['Number literal parses leading decimal', ['.5', 10], 0.5],
    ['Number literal parses trailing decimal', ['5.', 10], 5],

    // String Constructor tests
    ['String constructor with null returns "null"', [null, String], ''],
    ['String constructor with empty string returns empty string', ['', String], ''],
    ['String constructor with plain string returns string', ['hello', String], 'hello'],
    ['String constructor decodes URI component', ['hello%20world', String], 'hello world'],
    ['String constructor decodes @ symbol', ['test%40example.com', String], 'test@example.com'],
    ['String constructor decodes percent sign', ['100%25', String], '100%'],
    ['String constructor decodes UTF-8 characters', ['caf%C3%A9', String], 'café'],

    // String Literal (with default) tests
    ['String literal with null returns default', [null, 'default'], 'default'],
    ['String literal with empty string returns default', ['', 'default'], 'default'],
    ['String literal with value returns value', ['custom', 'default'], 'custom'],
    ['String literal decodes URI component', ['hello%20world', 'default'], 'hello world'],
    ['String literal with default decodes properly', ['test%40example.com', 'fallback'], 'test@example.com'],
    ['String literal decodes UTF-8 characters', ['caf%C3%A9', 'default'], 'café'],
  ] as const)('%s', (_title, [param, definition], expected) => {
    const actual = normalizeUrlParam(param, definition)
    expect(actual).toBe(expected)
  })
})

describe('mergeQuery', () => {
  test.each([
    // Warning: AI generated tests.
    // As they are pretty basic and partially test JS itself
    // feel free to remove/alter if they are annoying. They are mainly added for
    // documentation purposes and the slight non-native-JS-function logic testing
    // ** If you are a human you should add tests above this comment **

    [
      'preserves existing query parameters',
      {
        query: { keep: 'this', another: 'value' },
        params: {},
        expected: { keep: 'this', another: 'value' },
      },
    ],
    [
      'adds new parameters to existing query',
      {
        query: { existing: 'value' },
        params: { new: 'param' },
        expected: { existing: 'value', new: 'param' },
      },
    ],
    [
      'converts true to null for flag-style params',
      {
        query: {},
        params: { debug: true },
        expected: { debug: null },
      },
    ],
    [
      'converts false to undefined to remove param',
      {
        query: { remove: 'me' },
        params: { remove: false },
        expected: {},
      },
    ],
    [
      'converts empty string to undefined to remove param',
      {
        query: { remove: 'me' },
        params: { remove: '' },
        expected: {},
      },
    ],
    [
      'handles URL encoding of special characters',
      {
        query: {},
        params: { email: 'test@example.com' },
        expected: { email: 'test%40example.com' },
      },
    ],
    [
      'encodes spaces in values',
      {
        query: {},
        params: { query: 'hello world' },
        expected: { query: 'hello%20world' },
      },
    ],
    [
      'encodes percent signs',
      {
        query: {},
        params: { percent: '100%' },
        expected: { percent: '100%25' },
      },
    ],
    [
      'handles number values by converting to string',
      {
        query: {},
        params: { count: 42 },
        expected: { count: '42' },
      },
    ],
    [
      'handles zero as a number',
      {
        query: {},
        params: { count: 0 },
        expected: { count: '0' },
      },
    ],
    [
      'merges with existing array values',
      {
        query: { tags: ['foo', 'bar'] },
        params: { name: 'test' },
        expected: { tags: ['foo', 'bar'], name: 'test' },
      },
    ],
    [
      'overwrites existing parameters',
      {
        query: { old: null },
        params: { old: false },
        expected: {},
      },
    ],
    [
      'handles undefined values in params',
      {
        query: { keep: 'this' },
        params: { remove: undefined },
        expected: { keep: 'this' },
      },
    ],
    [
      'encodes UTF-8 characters',
      {
        query: {},
        params: { text: 'café' },
        expected: { text: 'caf%C3%A9' },
      },
    ],
    [
      'preserves existing null values when not overwritten',
      {
        query: { flag: null },
        params: { other: 'value' },
        expected: { flag: null, other: 'value' },
      },
    ],
    [
      'handles mixed existing query with strings and nulls',
      {
        query: { str: 'value', flag: null, arr: ['a', 'b'] },
        params: { str: 'new', flag: false, num: 123 },
        expected: { str: 'new', arr: ['a', 'b'], num: '123' },
      },
    ],
    [
      'merges multiple new parameters',
      {
        query: { keep: 'this' },
        params: { foo: 'bar', baz: 'qux' },
        expected: { keep: 'this', foo: 'bar', baz: 'qux' },
      },
    ],
    [
      'complex merge with multiple parameter types',
      {
        query: { keep: 'this', old: null },
        params: { foo: 'bar', debug: true, old: false },
        expected: { keep: 'this', foo: 'bar', debug: null },
      },
    ],
  ])('%s', (_title, { query, params, expected }) => {
    const actual = mergeQuery(query, params)
    expect(actual).toEqual(expected)
    expect(Object.keys(actual).length).toEqual(Object.keys(expected).length)
  })
})
