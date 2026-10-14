import { describe, expect, test } from 'vitest'

import { semver, search } from './'

describe('search', () => {
  test.each([
    // Name
    [
      'foo',
      {
        name: 'foo',
      },
    ],
    [
      'name',
      {
        name: 'name',
      },
    ],
    [
      'name:foo',
      {
        name: 'foo',
      },
    ],

    // Shortcuts
    [
      'namespace:foo',
      {
        ['filter[labels.k8s.kuma.io/namespace]']: 'foo',
      },
    ],
    [
      'zone:foo',
      {
        ['filter[labels.kuma.io/zone]']: 'foo',
      },
    ],
    [
      'service:foo',
      {
        ['filter[labels.kuma.io/service]']: 'foo',
      },
    ],
    [
      'namespace:foo service:bar zone:baz',
      {
        ['filter[labels.k8s.kuma.io/namespace]']: 'foo',
        ['filter[labels.kuma.io/service]']: 'bar',
        ['filter[labels.kuma.io/zone]']: 'baz',
      },
    ],
    [
      'tag:version',
      {
        tag: ['version'],
      },
    ],
    [
      'tag:namespace tag:zone tag:kuma.io/service',
      {
        tag: ['k8s.kuma.io/namespace', 'kuma.io/zone', 'kuma.io/service'],
      },
    ],
    [
      'tag:namespace:foo tag:zone:bar tag:kuma.io/service:baz',
      {
        tag: ['k8s.kuma.io/namespace:foo', 'kuma.io/zone:bar', 'kuma.io/service:baz'],
      },
    ],
    [
      'label:namespace:foo label:zone:bar label:kuma.io/service:baz',
      {
        ['filter[labels.k8s.kuma.io/namespace]']: 'foo',
        ['filter[labels.kuma.io/zone]']: 'bar',
        ['filter[labels.kuma.io/service]']: 'baz',
      },
    ],
    [
      'label:namespace:foo tag:zone:bar',
      {
        ['filter[labels.k8s.kuma.io/namespace]']: 'foo',
        tag: ['kuma.io/zone:bar'],
      },
    ],

    // Labels
    [
      'foo:bar',
      {
        ['filter[labels.foo]']: 'bar',
      },
    ],
    [
      'label:foo:bar',
      {
        ['filter[labels.foo]']: 'bar',
      },
    ],
    [
      'label: foo:bar',
      {
        ['filter[labels.foo]']: 'bar',
      },
    ],
    [
      'label:foo:bar label:baz=qux label: quux:quuux label: kuma.io/service=foo',
      {
        ['filter[labels.foo]']: 'bar',
        ['filter[labels.baz]']: 'qux',
        ['filter[labels.quux]']: 'quuux',
        ['filter[labels.kuma.io/service]']: 'foo',
      },
    ],

    // Invalids
    [
      ':',
      {},
    ],
    [
      'foo:',
      {},
    ],
    [
      ':foo',
      {},
    ],
  ])('searching by %s works', (str, expected) => {
    const actual = search(str)
    expect(actual).toStrictEqual(expected)
  })

  // defaultKey
  test.each([
    [
      'bar',
      'foo',
      {
        foo: 'bar',
      },
    ],
    [
      'foo',
      'bar',
      {
        bar: 'foo',
      },
    ],
  ])('using %s as the defaultKey works', (str, defaultKey, expected) => {
    const actual = search(str, { defaultKey })
    expect(actual).toStrictEqual(expected)
  })

})

describe('utilities', () => {
  test('semver', () => {
    expect(semver('1.1.1').patch).toBe('1.1.1')
    expect(semver('0.0.0-preview.1').patch).toBe('0.0.0')
    expect(semver('0.0.1-rc.1').patch).toBe('0.0.1')
    expect(semver('10.10.1').major).toBe('10')
    expect(semver('0.9.1').minor).toBe('0.9')
    expect(semver('0.9.1-rc.10').pre).toBe('0.9.1-rc.10')
  })
})
