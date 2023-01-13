import { describe, expect, test } from '@jest/globals'

import { tokenizeFieldFilterQuery } from './tokenizeFieldFilterQuery'

describe('tokenizeFieldFilterQuery', () => {
  test.each([
    [
      'field: camelCase + value: unquoted',
      'namePrefix:back',
      [['namePrefix', 'back']],
    ],
    [
      'field: dash-delimited + value: unquoted',
      'name-prefix:back',
      [['namePrefix', 'back']],
    ],
    [
      'field: space delimited + value: unquoted',
      'name prefix:back',
      [['namePrefix', 'back']],
    ],
    [
      'field: snake_case + value: unquoted',
      'obscure_field_1:back',
      [['obscure_field_1', 'back']],
    ],
    [
      'field: leading spaces + value: unquoted',
      '  name prefix:back',
      [['namePrefix', 'back']],
    ],
    [
      'field: camelCase + value: quoted, no leading spaces',
      'namePrefix:"back"',
      [['namePrefix', 'back']],
    ],
    [
      'field: camelCase + value: unquoted, leading spaces',
      'namePrefix: back',
      [['namePrefix', 'back']],
    ],
    [
      'field: camelCase + value: quoted',
      'namePrefix: "back"',
      [['namePrefix', 'back']],
    ],
    [
      'field: camelCase + value: quoted, leading/trailing spaces',
      'namePrefix:   "   back "',
      [['namePrefix', '   back ']],
    ],
    [
      'field: camelCase + value: quoted, unquoted #1',
      "tag:'kuma.io/zone: europe' tag:'version:v1' namePrefix:back",
      [['tag', 'kuma.io/zone: europe'], ['tag', 'version:v1'], ['namePrefix', 'back']],
    ],
    [
      'field: camelCase + value: quoted, unquoted #2',
      'tag:"kuma.io/zone: europe" tag:"version:v1" namePrefix:back',
      [['tag', 'kuma.io/zone: europe'], ['tag', 'version:v1'], ['namePrefix', 'back']],
    ],
    [
      'field: camelCase + value: quoted, unquoted #3',
      '  tag:"kuma.io/zone: europe"   tag:"version:v1"    namePrefix:back   ',
      [['tag', 'kuma.io/zone: europe'], ['tag', 'version:v1'], ['namePrefix', 'back']],
    ],
    [
      'field: camelCase + value: quoted, unquoted #4',
      'tag:kuma.io/protocol:tcp namePrefix:"redis-58f9d884db-6dzj8.kuma-demo"',
      [['tag', 'kuma.io/protocol:tcp'], ['namePrefix', 'redis-58f9d884db-6dzj8.kuma-demo']],
    ],
    [
      'field: camelCase + value: quoted, unquoted, colons',
      'test:1 test:"2" test:\'3\' test:value:test',
      [['test', '1'], ['test', '2'], ['test', '3'], ['test', 'value:test']],
    ],
    [
      'field: camelCase + value: unquoted, empty #1',
      'test:',
      [],
    ],
    [
      'field: camelCase + value: unquoted, empty #2',
      'test: ',
      [],
    ],
    [
      'field: camelCase + value: quoted, empty',
      'test: ""',
      [],
    ],
    [
      'field: camelCase + value: quoted, only spaces',
      'test: " "',
      [['test', ' ']],
    ],
    [
      'empty query #1',
      '',
      [],
    ],
    [
      'empty query #2',
      ' ',
      [],
    ],
    [
      'stray values #1',
      'test: value stray',
      [['test', 'value']],
    ],
    [
      'stray values #2',
      'test: value stray stray2',
      [['test', 'value']],
    ],
  ])('works (%s)', (_description, query, expectedFields) => {
    expect(tokenizeFieldFilterQuery(query, [])).toEqual(expectedFields)
  })

  test.each([
    [
      'namePrefix:back',
      ['unknown'],
      new Error('Unknown field “namePrefix”. Known fields: unknown'),
    ],
    [
      'nameprefix:back',
      ['namePrefix'],
      new Error('Unknown field “nameprefix”. Known fields: namePrefix'),
    ],
    [
      'tag:"kuma.io/zone: europe" tag:"version:v1" namePrefix:back',
      ['namePrefix'],
      new Error('Unknown field “tag”. Known fields: namePrefix'),
    ],
    [
      'tag:"kuma.io/zone: europe" tag:"version:v1" namePrefix:back',
      ['tag'],
      new Error('Unknown field “namePrefix”. Known fields: tag'),
    ],
    [
      'tag:"kuma.io/zone: europe" tag:"version:v1 namePrefix:back',
      ['tag', 'namePrefix'],
      new Error('Quote mismatch for field “tag”.'),
    ],
  ])('throws expected errors', (query, allowedFields, expectedErrorMessage) => {
    const call = () => tokenizeFieldFilterQuery(query, allowedFields)

    expect(call).toThrowError(expectedErrorMessage)
  })
})
